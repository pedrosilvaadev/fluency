import { describe, expect, it } from "vitest";

import { safeNextPath } from "@/lib/validation/auth";

describe("safeNextPath", () => {
  it.each([
    "//evil.example/path",
    "/\\evil.example/path",
    "https://evil.example/feed",
    "/auth/login",
    "/unknown",
    "/feed%5Cevil",
  ])("rejects unsafe destination %s", (destination) => {
    expect(safeNextPath(destination, "https://fluenty.example")).toBe("/feed");
  });

  it("preserves an allowed internal destination", () => {
    expect(safeNextPath("/library?status=MASTERED#saved")).toBe(
      "/library?status=MASTERED#saved",
    );
  });

  it("accepts same-origin absolute URLs only when an origin is provided", () => {
    expect(
      safeNextPath(
        "https://fluenty.example/review?from=login",
        "https://fluenty.example",
      ),
    ).toBe("/review?from=login");
  });
});
