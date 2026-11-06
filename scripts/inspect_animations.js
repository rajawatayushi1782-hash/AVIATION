import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function inspect(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  console.log(`[${prefix}] Navigating to ${url}...`);

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Capture initial state
  await page.screenshot({ path: `screenshots/${prefix}_01_initial.png` });

  // Get initial state details
  const initialData = await page.evaluate(() => {
    const video = document.querySelector('video');
    const h1 = document.querySelector('.header-title--home span');
    return {
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      scrollCustom: window.core?.scrollCustom,
      videoSrc: video?.src,
      videoPaused: video?.paused,
      videoReadyState: video?.readyState,
      h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
      customScrollDisabled: document.body.classList.contains('custom-scroll-disabled'),
    };
  });
  console.log(`[${prefix}] Initial state:`, initialData);

  // Wait 3s and capture hero after potential video intro
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `screenshots/${prefix}_02_hero_settled.png` });

  const heroSettled = await page.evaluate(() => {
    const h1 = document.querySelector('.header-title--home span');
    return {
      bodyClasses: document.body.className,
      h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
    };
  });
  console.log(`[${prefix}] Hero settled:`, heroSettled);

  // Scroll through homepage in increments using mouse wheel (like a user on desktop)
  const scrollSteps = [300, 800, 1500, 2500, 3500, 4500, 5500];
  for (let i = 0; i < scrollSteps.length; i++) {
    const targetY = scrollSteps[i];
    // Scroll using wheel
    await page.mouse.wheel(0, targetY);
    await page.waitForTimeout(1000);

    const stepData = await page.evaluate(() => {
      const scrollable = document.querySelector('#scrollable');
      const mission = document.querySelector('.mission');
      const textImage = document.querySelector('.text-image--home-jets');
      const quote = document.querySelector('.quote');
      const magazine = document.querySelector('.magazine');
      const topbar = document.querySelector('.topbar');

      return {
        scrollTop: window.core?.scrollTop,
        windowScrollY: window.scrollY,
        scrollableTransform: scrollable ? scrollable.style.transform : null,
        cssScrollVar: document.documentElement.style.getPropertyValue('--scroll'),
        topbarClasses: topbar?.className,
        missionVisible: mission?.classList.contains('is-visible'),
        textImageIn: textImage?.classList.contains('is-in'),
        textImageOut: textImage?.classList.contains('is-out'),
        quoteIn: quote?.classList.contains('is-in'),
        quoteOut: quote?.classList.contains('is-out'),
        magazineVisible: magazine?.classList.contains('is-visible'),
        magazineOut: magazine?.classList.contains('is-out'),
      };
    });

    console.log(`[${prefix}] Step ${i + 1} (${targetY}px):`, stepData);
    await page.screenshot({ path: `screenshots/${prefix}_step_${i + 1}_${targetY}.png` });
  }

  await browser.close();
}

async function run() {
  fs.mkdirSync('screenshots', { recursive: true });
  console.log('--- Inspecting Original ---');
  await inspect('https://www.flyplatoon.com/', 'orig');
  console.log('--- Inspecting Replica ---');
  await inspect('http://localhost:3000/', 'rep');
}

run().catch(console.error);

