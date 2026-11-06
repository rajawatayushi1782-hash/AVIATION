import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  fs.mkdirSync('screenshots/original_detailed', { recursive: true });
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop inspection
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  console.log('Navigating to original website...');
  await page.goto('https://www.flyplatoon.com/', { waitUntil: 'domcontentloaded' });

  // Timeline capture of hero
  const times = [200, 800, 1500, 2500, 4000];
  for (const t of times) {
    await page.waitForTimeout(t === 200 ? 200 : t - times[times.indexOf(t) - 1]);
    await page.screenshot({ path: `screenshots/original_detailed/hero_t_${t}ms.png` });
    const heroInfo = await page.evaluate(() => {
      const h1 = document.querySelector('.header-title--home span');
      const video = document.querySelector('video');
      return {
        bodyClass: document.body.className,
        h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
        h1Transform: h1 ? window.getComputedStyle(h1).transform : null,
        videoCurrentTime: video ? video.currentTime : null,
        videoPaused: video ? video.paused : null
      };
    });
    console.log(`Hero at ${t}ms:`, heroInfo);
  }

  // Scroll positions
  const scrollPositions = [0, 500, 1000, 1600, 2200, 2800, 3400, 4000, 4600, 5200];
  for (const pos of scrollPositions) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pos);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/original_detailed/scroll_${pos}px.png` });
    const sectionState = await page.evaluate((y) => {
      const getBox = sel => {
        const el = document.querySelector(sel);
        return el ? { top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height, opacity: window.getComputedStyle(el).opacity } : null;
      };
      return {
        scrollY: window.scrollY,
        mission: getBox('.mission'),
        textImage: getBox('.text-image--home-jets'),
        quote: getBox('.quote'),
        magazine: getBox('.magazine'),
        footer: getBox('.footer')
      };
    }, pos);
    console.log(`Scroll ${pos}px:`, sectionState);
  }

  // 2. Mobile inspection
  const mContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mPage = await mContext.newPage();
  await mPage.goto('https://www.flyplatoon.com/', { waitUntil: 'domcontentloaded' });
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: `screenshots/original_detailed/mobile_hero.png` });
  
  for (const mPos of [0, 600, 1200, 1800, 2500, 3200]) {
    await mPage.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), mPos);
    await mPage.waitForTimeout(500);
    await mPage.screenshot({ path: `screenshots/original_detailed/mobile_scroll_${mPos}px.png` });
  }

  await browser.close();
  console.log('Detailed inspection complete.');
}

run().catch(console.error);

