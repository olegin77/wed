import { test } from "@playwright/test";
test("booking flow", async ({ page })=>{
  await page.goto(process.env.E2E_BASE||"http://localhost:3000");
  // здесь могли бы быть шаги UI; демо-тест — smoke
});
