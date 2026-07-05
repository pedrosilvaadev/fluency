export type ReviewErrorCode =
  "NOT_FOUND" | "FORBIDDEN" | "CONFLICT" | "INVALID_STATE";

export class ReviewApplicationError extends Error {
  constructor(
    readonly code: ReviewErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ReviewApplicationError";
  }
}
