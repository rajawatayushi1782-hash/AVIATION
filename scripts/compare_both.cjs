const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPage(url, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  const testScrolls = [0, 900, 1500, 2184, 3084, 3800, 4434, 5200];
  const results = [];

  for (const s of testScrolls) {
    await page.evaluate((targetY) => {
      if (window.core && window.core.scrollCustom !== false) {
        window.core.scrollTop = targetY;
        const scrollable = document.querySelector('#scrollable') || document.querySelector('.scroll__scrollable');
        if (scrollable) scrollable.style.transform = `translate3d(0, -${targetY}px, 0)`;
        document.documentElement.style.setProperty('--scroll', `${targetY}px`);
      } else {
        window.scrollTo(0, targetY);
      }
    }, s);

    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const getSec = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return {
          className: el.className,
          style: el.getAttribute('style') || '',
          rectTop: Math.round(el.getBoundingClientRect().top),
          rectHeight: Math.round(el.getBoundingClientRect().height),
          computedOpacity: window.getComputedStyle(el).opacity,
          computedTransform: window.getComputedStyle(el).transform
        };
      };

      return {
        header: getSec('.header'),
        mission: getSec('.mission'),
        textImage: getSec('.text-image'),
        contentBlock: getSec('.content-block'),
        quote: getSec('.quote'),
        magazine: getSec('.magazine'),
        footer: getSec('.footer')
      };
    });

    results.push({ scrollY: s, sections: data });
  }

  await browser.close();
  return results;
}

(async () => {
  const orig = await testPage('https://www.flyplatoon.com/', 'Original');
  const clone = await testPage('http://localhost:3000/', 'Clone');

  fs.writeFileSync(path.resolve(__dirname, '../screenshots/audit/comparison_frames.json'), JSON.stringify({ orig, clone }, null, 2));
  console.log('Saved comparison_frames.json');
})();

