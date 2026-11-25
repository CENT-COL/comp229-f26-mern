import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/playwright/.auth/user.json'
});

test('test', async ({ page }) => {
  await page.goto('https://comp229-f26-mern.onrender.com/');
  await page.getByRole('link', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Create New Project' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Test Project');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('E2e Test Project Description');
  await page.getByRole('textbox', { name: 'Start Date' }).fill('2026-11-02');
  await page.getByRole('textbox', { name: 'End Date' }).fill('2026-11-30');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.locator('tr:nth-child(10) > td:nth-child(5) > .MuiStack-root > .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-sizeMedium.MuiButton-colorPrimary').click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Test Project - Updated');
  await page.getByRole('button', { name: 'Update' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('tr:nth-child(10) > td:nth-child(5) > .MuiStack-root > .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-sizeMedium.MuiButton-colorError').click();
});