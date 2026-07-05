import { expect, test } from "@playwright/test";

test("redirects guests to the login page", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Entre na sua conta" }),
  ).toBeVisible();
});
