import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeading } from "@/components/fluenty/page-heading";

describe("PageHeading", () => {
  it("renders an accessible page title and description", () => {
    render(
      <PageHeading
        eyebrow="Fluenty"
        title="Seu feed de palavras"
        description="Aprenda uma palavra de cada vez."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Seu feed de palavras" }),
    ).toBeVisible();
    expect(screen.getByText("Aprenda uma palavra de cada vez.")).toBeVisible();
  });
});
