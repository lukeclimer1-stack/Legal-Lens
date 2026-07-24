const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const box = await page.locator('img[alt="Luke Wilson"]').first().locator('..').boundingBox();
  console.log('box', JSON.stringify(box));
  await page.locator('img[alt="Luke Wilson"]').first().locator('..').screenshot({ path: '/tmp/claude-0/-home-claude-repo/504b94c5-fa7b-5220-8894-46d875d886cc/scratchpad/about-photo-before.png' });
  await browser.close();
})();
