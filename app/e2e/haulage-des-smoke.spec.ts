import { test, expect } from '@playwright/test';

test.describe('Haulage DES demo smoke', () => {
  test('gallery → haulage-des → run → compare A/B → export JSON', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Mining operations portfolio' }),
    ).toBeVisible();

    await expect(page.getByText('Loading demo catalog…')).toBeHidden({ timeout: 30_000 });

    await page.getByTestId('gallery-haulage-open').click();

    await expect(page).toHaveURL(/\/demo\/haulage-des/);
    await expect(
      page.getByRole('heading', { name: 'Haulage discrete-event simulation' }),
    ).toBeVisible();
    await expect(page.getByText('Panel A — Scenario & fleet controls')).toBeVisible();
    await expect(page.getByText('Panel B — Load–haul–dump schematic')).toBeVisible();
    await expect(page.getByText('Panel C — Queue & throughput charts')).toBeVisible();
    await expect(
      page.getByText('Panel D — KPI cards & superintendent summary'),
    ).toBeVisible();

    const runBtn = page.getByTestId('haulage-run-des');
    await expect(runBtn).toBeEnabled({ timeout: 30_000 });

    await page.getByLabel(/Horizon \(shifts\)/).fill('1');

    await runBtn.click();
    await expect(runBtn).toHaveText('Run DES', { timeout: 90_000 });
    await expect(page.getByText('Tonnes / shift')).toBeVisible();

    await page.getByTestId('haulage-save-a').click();

    await page.getByTestId('haulage-clone-other').click();
    await expect(runBtn).toBeEnabled({ timeout: 30_000 });
    await runBtn.click();
    await expect(runBtn).toHaveText('Run DES', { timeout: 90_000 });

    await page.getByTestId('haulage-save-b').click();

    await expect(page.getByRole('columnheader', { name: 'Δ (B−A)' })).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('haulage-export-json').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^haulage-des-.+\.json$/);
  });
});
