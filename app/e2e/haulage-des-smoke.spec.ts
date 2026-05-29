import { test, expect } from '@playwright/test';

test.describe('Haulage DES demo smoke', () => {
  test('gallery -> haulage-des notebook -> run baseline -> compare scraper -> export JSON', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Mining operations portfolio' }),
    ).toBeVisible();

    await expect(page.getByText('Loading demo catalog…')).toBeHidden({ timeout: 30_000 });

    await page.getByTestId('gallery-haulage-open').click();

    await expect(page).toHaveURL(/\/demo\/haulage-des/);
    await expect(
      page.getByRole('heading', {
        name: 'Would a different haulage method reduce queueing enough to justify a site-data study?',
      }),
    ).toBeVisible();

    const syntheticWarnings = page.getByRole('note', {
      name: 'Synthetic data disclaimer',
    });
    await expect(syntheticWarnings).toHaveCount(1);
    await expect(syntheticWarnings.first()).toBeVisible();
    await expect(
      syntheticWarnings.filter({ hasText: 'Synthetic data.' }),
      'the route should expose exactly one visible synthetic-data warning',
    ).toHaveCount(1);

    await expect(
      page.getByRole('heading', { name: 'Why a deterministic cycle spreadsheet is not enough' }),
    ).toBeVisible();
    await expect(
      page.getByText(
        'The DES keeps the same operational vocabulary but changes the flow.',
      ),
    ).toBeVisible();
    await expect(
      page.getByText('A haul unit asks for the loader, waits if the resource is busy'),
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Run DES' })).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Compare the baseline with the scraper-train hypothesis',
      }),
    ).toBeVisible();
    await expect(page.getByTestId('haulage-clone-other')).toBeVisible();
    await expect(page.getByText('Save two completed runs as A and B')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'What this notebook does not claim' }),
    ).toBeVisible();
    await expect(
      page.getByText('The demo is not an operational forecast, vendor benchmark'),
    ).toBeVisible();

    const runBtn = page.getByTestId('haulage-run-des');
    await expect(runBtn).toBeEnabled({ timeout: 30_000 });

    await page.getByLabel(/Horizon \(shifts\)/).fill('1');

    await runBtn.click();
    await expect(runBtn).toHaveText('Run DES', { timeout: 90_000 });
    await expect(page.getByText('Tonnes per synthetic shift.')).toBeVisible();

    await page.getByTestId('haulage-save-a').click();

    await page.getByTestId('haulage-clone-other').click();
    await expect(page.getByLabel('K-Tec scraper train')).toBeChecked();
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
