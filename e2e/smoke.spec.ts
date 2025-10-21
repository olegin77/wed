import { test, expect } from "@playwright/test";
test("home loads", async ({ page })=>{
  await page.goto(process.env.E2E_BASE||"http://localhost:3000");
  await expect(page).toHaveTitle(/Wedding|Свадьба/i);
});
