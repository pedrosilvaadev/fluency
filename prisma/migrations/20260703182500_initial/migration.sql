-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "vocabulary_level" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "learning_status" AS ENUM ('new', 'learning', 'reviewing', 'mastered');

-- CreateEnum
CREATE TYPE "review_rating" AS ENUM ('again', 'hard', 'easy', 'mastered');

-- CreateEnum
CREATE TYPE "review_session_status" AS ENUM ('in_progress', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "achievement_type" AS ENUM ('words_learned', 'reviews_completed', 'streak_days', 'words_mastered', 'xp_earned');

-- CreateEnum
CREATE TYPE "mission_type" AS ENUM ('words_learned', 'words_reviewed', 'streak_days', 'words_mastered');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "avatar_url" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "time_zone" VARCHAR(64) NOT NULL DEFAULT 'America/Sao_Paulo',
    "last_activity_date" DATE,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "word" VARCHAR(120) NOT NULL,
    "pronunciation" VARCHAR(160) NOT NULL,
    "translation" VARCHAR(240) NOT NULL,
    "example" TEXT NOT NULL,
    "example_translation" TEXT NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "level" "vocabulary_level" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vocabulary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "vocabulary_id" UUID NOT NULL,
    "mastery" SMALLINT NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "wrong_count" INTEGER NOT NULL DEFAULT 0,
    "is_saved" BOOLEAN NOT NULL DEFAULT false,
    "status" "learning_status" NOT NULL DEFAULT 'new',
    "next_review_at" TIMESTAMPTZ(3),
    "last_reviewed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" "review_session_status" NOT NULL DEFAULT 'in_progress',
    "total_cards" INTEGER NOT NULL DEFAULT 0,
    "correct_answers" INTEGER NOT NULL DEFAULT 0,
    "wrong_answers" INTEGER NOT NULL DEFAULT 0,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "review_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_request_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_vocabulary_id" UUID NOT NULL,
    "rating" "review_rating" NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "mastery_before" SMALLINT NOT NULL,
    "mastery_after" SMALLINT NOT NULL,
    "xp_earned" INTEGER NOT NULL,
    "next_review_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(80) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(80) NOT NULL,
    "required_value" INTEGER NOT NULL,
    "type" "achievement_type" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "achievement_id" UUID NOT NULL,
    "unlocked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_missions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(80) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "target_value" INTEGER NOT NULL,
    "type" "mission_type" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_missions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ(3),
    "reward_claimed_at" TIMESTAMPTZ(3),
    "date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_word_key" ON "vocabulary"("word");

-- CreateIndex
CREATE INDEX "vocabulary_category_idx" ON "vocabulary"("category");

-- CreateIndex
CREATE INDEX "vocabulary_level_idx" ON "vocabulary"("level");

-- CreateIndex
CREATE INDEX "vocabulary_category_level_idx" ON "vocabulary"("category", "level");

-- CreateIndex
CREATE INDEX "user_vocabulary_user_id_status_idx" ON "user_vocabulary"("user_id", "status");

-- CreateIndex
CREATE INDEX "user_vocabulary_user_id_next_review_at_idx" ON "user_vocabulary"("user_id", "next_review_at");

-- CreateIndex
CREATE INDEX "user_vocabulary_user_id_is_saved_idx" ON "user_vocabulary"("user_id", "is_saved");

-- CreateIndex
CREATE UNIQUE INDEX "user_vocabulary_user_id_vocabulary_id_key" ON "user_vocabulary"("user_id", "vocabulary_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_vocabulary_id_user_id_key" ON "user_vocabulary"("id", "user_id");

-- CreateIndex
CREATE INDEX "review_sessions_user_id_status_created_at_idx" ON "review_sessions"("user_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "review_sessions_user_id_completed_at_idx" ON "review_sessions"("user_id", "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "review_sessions_id_user_id_key" ON "review_sessions"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_attempts_client_request_id_key" ON "review_attempts"("client_request_id");

-- CreateIndex
CREATE INDEX "review_attempts_session_id_idx" ON "review_attempts"("session_id");

-- CreateIndex
CREATE INDEX "review_attempts_user_id_created_at_idx" ON "review_attempts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "review_attempts_user_vocabulary_id_created_at_idx" ON "review_attempts"("user_vocabulary_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_code_key" ON "achievements"("code");

-- CreateIndex
CREATE INDEX "achievements_type_required_value_idx" ON "achievements"("type", "required_value");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_unlocked_at_idx" ON "user_achievements"("user_id", "unlocked_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_user_id_achievement_id_key" ON "user_achievements"("user_id", "achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_missions_code_key" ON "daily_missions"("code");

-- CreateIndex
CREATE INDEX "daily_missions_type_idx" ON "daily_missions"("type");

-- CreateIndex
CREATE INDEX "user_daily_missions_user_id_date_idx" ON "user_daily_missions"("user_id", "date");

-- CreateIndex
CREATE INDEX "user_daily_missions_user_id_completed_date_idx" ON "user_daily_missions"("user_id", "completed", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_missions_user_id_mission_id_date_key" ON "user_daily_missions"("user_id", "mission_id", "date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_auth_user_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_sessions" ADD CONSTRAINT "review_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "review_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_user_vocabulary_id_fkey" FOREIGN KEY ("user_vocabulary_id") REFERENCES "user_vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enforce that attempts, sessions and progress always belong to the same user.
ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_session_owner_fkey" FOREIGN KEY ("session_id", "user_id") REFERENCES "review_sessions"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "review_attempts" ADD CONSTRAINT "review_attempts_vocabulary_owner_fkey" FOREIGN KEY ("user_vocabulary_id", "user_id") REFERENCES "user_vocabulary"("id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_missions" ADD CONSTRAINT "user_daily_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_missions" ADD CONSTRAINT "user_daily_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "daily_missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Domain invariants that Prisma cannot express in the schema.
ALTER TABLE "users"
  ADD CONSTRAINT "users_progress_check"
  CHECK ("xp" >= 0 AND "level" >= 1 AND "streak" >= 0);

ALTER TABLE "user_vocabulary"
  ADD CONSTRAINT "user_vocabulary_progress_check"
  CHECK (
    "mastery" BETWEEN 0 AND 100
    AND "correct_count" >= 0
    AND "wrong_count" >= 0
  );

ALTER TABLE "review_sessions"
  ADD CONSTRAINT "review_sessions_totals_check"
  CHECK (
    "total_cards" >= 0
    AND "correct_answers" >= 0
    AND "wrong_answers" >= 0
    AND "xp_earned" >= 0
    AND "correct_answers" + "wrong_answers" <= "total_cards"
  ),
  ADD CONSTRAINT "review_sessions_completion_check"
  CHECK (
    (
      "status" = 'completed'
      AND "completed_at" IS NOT NULL
      AND "correct_answers" + "wrong_answers" = "total_cards"
    )
    OR ("status" <> 'completed' AND "completed_at" IS NULL)
  );

ALTER TABLE "review_attempts"
  ADD CONSTRAINT "review_attempts_progress_check"
  CHECK (
    "mastery_before" BETWEEN 0 AND 100
    AND "mastery_after" BETWEEN 0 AND 100
    AND "xp_earned" >= 0
  );

ALTER TABLE "achievements"
  ADD CONSTRAINT "achievements_required_value_check"
  CHECK ("required_value" > 0);

ALTER TABLE "daily_missions"
  ADD CONSTRAINT "daily_missions_rewards_check"
  CHECK ("xp_reward" >= 0 AND "target_value" > 0);

ALTER TABLE "user_daily_missions"
  ADD CONSTRAINT "user_daily_missions_progress_check"
  CHECK (
    "current_value" >= 0
    AND "completed" = ("completed_at" IS NOT NULL)
    AND ("reward_claimed_at" IS NULL OR "completed" = true)
    AND ("reward_claimed_at" IS NULL OR "reward_claimed_at" >= "completed_at")
  );

-- Supabase exposes the public schema through its Data API. The application
-- accesses these tables only through the Prisma backend, so RLS starts closed.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vocabulary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_vocabulary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "review_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "review_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "achievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_achievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "daily_missions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_daily_missions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE
  "users",
  "vocabulary",
  "user_vocabulary",
  "review_sessions",
  "review_attempts",
  "achievements",
  "user_achievements",
  "daily_missions",
  "user_daily_missions"
FROM anon, authenticated;
