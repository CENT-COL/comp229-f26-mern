// @ts-check
import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('Update Project', async ({ page }) => {
  await page.goto('https://comp229-f25-mern.onrender.com/projects');
  await page.getByRole('button', { name: 'Update' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Playwright Project');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Playwright Project');
  await page.getByText('COMP229 MERNHomeProjectsSign outUpdate ProjectName *Name *Description *').click();
  await page.getByRole('button', { name: 'Update' }).click();
});