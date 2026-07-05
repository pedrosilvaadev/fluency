-- Give every session an explicit eligibility policy. Existing sessions predate
-- this distinction and retain the former feed behaviour.
CREATE TYPE "review_session_source" AS ENUM ('feed', 'review');

ALTER TABLE "review_sessions"
  ADD COLUMN "source" "review_session_source" NOT NULL DEFAULT 'feed';

-- A vocabulary item can be consumed at most once in a session. Fail safely if
-- legacy data violates that invariant instead of deleting user history.
CREATE UNIQUE INDEX "review_attempts_session_id_user_vocabulary_id_key"
  ON "review_attempts"("session_id", "user_vocabulary_id");

CREATE TABLE "review_session_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "session_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "user_vocabulary_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "consumed_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "review_session_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "review_session_items_position_check" CHECK ("position" >= 0)
);

-- Preserve completed/attempted legacy sessions as consumed session items.
INSERT INTO "review_session_items" (
  "session_id",
  "user_id",
  "user_vocabulary_id",
  "position",
  "consumed_at",
  "created_at"
)
SELECT
  "session_id",
  "user_id",
  "user_vocabulary_id",
  ROW_NUMBER() OVER (
    PARTITION BY "session_id"
    ORDER BY "created_at", "id"
  ) - 1,
  "created_at",
  "created_at"
FROM "review_attempts";

CREATE UNIQUE INDEX "review_session_items_session_id_user_vocabulary_id_key"
  ON "review_session_items"("session_id", "user_vocabulary_id");

CREATE UNIQUE INDEX "review_session_items_session_id_position_key"
  ON "review_session_items"("session_id", "position");

CREATE INDEX "review_session_items_user_vocabulary_id_user_id_idx"
  ON "review_session_items"("user_vocabulary_id", "user_id");

ALTER TABLE "review_session_items"
  ADD CONSTRAINT "review_session_items_session_owner_fkey"
    FOREIGN KEY ("session_id", "user_id")
    REFERENCES "review_sessions"("id", "user_id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "review_session_items_vocabulary_owner_fkey"
    FOREIGN KEY ("user_vocabulary_id", "user_id")
    REFERENCES "user_vocabulary"("id", "user_id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "review_session_items" ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE "review_session_items" FROM anon, authenticated;
