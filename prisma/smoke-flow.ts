import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { ProgressService } from "../src/features/progress/application/progress-service";
import { ReviewApplicationError } from "../src/features/review/application/errors";
import { ReviewService } from "../src/features/review/application/review-service";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

const databaseUrl = process.env.DIRECT_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!databaseUrl || !supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase smoke environment is incomplete.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const review = new ReviewService(prisma);
const progress = new ProgressService(prisma);
const authUserIds: string[] = [];

async function createSmokeUser(label: string) {
  const email = `fluenty-smoke-${label}-${randomUUID()}@example.com`;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: `Smoke-${randomUUID()}-9!`,
    email_confirm: true,
    user_metadata: { name: `Smoke ${label}` },
  });
  if (error || !data.user) throw error ?? new Error("Auth user was not created.");
  authUserIds.push(data.user.id);
  await prisma.user.create({
    data: { id: data.user.id, email, name: `Smoke ${label}` },
  });
  return data.user.id;
}

async function expectReviewError(operation: () => Promise<unknown>) {
  try {
    await operation();
  } catch (error) {
    if (error instanceof ReviewApplicationError) return;
    throw error;
  }
  throw new Error("Expected a review application error.");
}

try {
  const firstUserId = await createSmokeUser("primary");
  const secondUserId = await createSmokeUser("isolated");
  const catalog = await review.listVocabulary({ userId: firstUserId, limit: 1 });
  const vocabulary = catalog.items[0];
  if (!vocabulary) throw new Error("Seeded vocabulary was not found.");

  await review.setSaved({
    userId: firstUserId,
    vocabularyId: vocabulary.id,
    isSaved: true,
  });

  const feedSession = await review.createSession({
    userId: firstUserId,
    source: "FEED",
    vocabularyIds: [vocabulary.id],
  });
  const firstRequestId = randomUUID();
  const firstAttempt = await review.submitReview({
    userId: firstUserId,
    sessionId: feedSession.id,
    vocabularyId: vocabulary.id,
    clientRequestId: firstRequestId,
    rating: "EASY",
  });
  const replay = await review.submitReview({
    userId: firstUserId,
    sessionId: feedSession.id,
    vocabularyId: vocabulary.id,
    clientRequestId: firstRequestId,
    rating: "EASY",
  });
  if (replay.id !== firstAttempt.id) throw new Error("Idempotent replay diverged.");
  await review.completeSession({ userId: firstUserId, sessionId: feedSession.id });

  await expectReviewError(() =>
    review.createSession({
      userId: firstUserId,
      source: "FEED",
      vocabularyIds: [vocabulary.id],
    }),
  );

  await prisma.userVocabulary.update({
    where: {
      userId_vocabularyId: { userId: firstUserId, vocabularyId: vocabulary.id },
    },
    data: { nextReviewAt: new Date(Date.now() - 60_000) },
  });
  const due = await review.listDueVocabulary(firstUserId, 10);
  if (!due.some(({ id }) => id === vocabulary.id)) {
    throw new Error("Due vocabulary was not returned.");
  }

  const reviewSession = await review.createSession({
    userId: firstUserId,
    source: "REVIEW",
    vocabularyIds: [vocabulary.id],
  });
  await review.submitReview({
    userId: firstUserId,
    sessionId: reviewSession.id,
    vocabularyId: vocabulary.id,
    clientRequestId: randomUUID(),
    rating: "HARD",
  });
  await review.completeSession({ userId: firstUserId, sessionId: reviewSession.id });

  const [firstLibrary, secondLibrary, snapshot] = await Promise.all([
    review.listVocabulary({ userId: firstUserId, savedOnly: true, limit: 10 }),
    review.listVocabulary({ userId: secondUserId, savedOnly: true, limit: 10 }),
    progress.getSnapshot(firstUserId),
  ]);
  if (firstLibrary.items.length !== 1 || secondLibrary.items.length !== 0) {
    throw new Error("User vocabulary isolation failed.");
  }
  if (snapshot.reviewsCompleted !== 2 || snapshot.xp <= 0) {
    throw new Error("Progress snapshot did not reflect review attempts.");
  }

  console.info(
    "Authenticated flow smoke passed: save, feed eligibility, idempotency, due queue, review, gamification and user isolation.",
  );
} finally {
  for (const userId of authUserIds.reverse()) {
    await supabase.auth.admin.deleteUser(userId).catch(() => undefined);
  }
  await prisma.$disconnect();
}
