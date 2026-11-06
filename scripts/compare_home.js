import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900, isMobile: false },
  { name: 'laptop_1366', width: 1366, height: 768, isMobile: false },
  { name: 'tablet_768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function compare() {
  fs.mkdirSync('screenshots/comparison', { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    
    // Test Replica
    const repContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });
    const repPage = await repContext.newPage();
    await repPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await repPage.waitForTimeout(2000);

    // Test Original
    const origContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });
    const origPage = await origContext.newPage();
    await origPage.goto('https://www.flyplatoon.com/', { waitUntil: 'domcontentloaded' });
    await origPage.waitForTimeout(2000);

    // Initial / Hero screenshot
    await origPage.screenshot({ path: `screenshots/comparison/${vp.name}_orig_01_hero.png` });
    await repPage.screenshot({ path: `screenshots/comparison/${vp.name}_rep_01_hero.png` });

    // Compare video and heading properties
    const heroCompare = await Promise.all([
      origPage.evaluate(() => ({
        bodyClass: document.body.className,
        h1Opacity: document.querySelector('.header-title--home span') ? window.getComputedStyle(document.querySelector('.header-title--home span')).opacity : null,
        videoSrc: document.querySelector('video') ? document.querySelector('video').currentSrc : null,
        videoPaused: document.querySelector('video') ? document.querySelector('video').paused : null,
      })),
      repPage.evaluate(() => ({
        bodyClass: document.body.className,
        h1Opacity: document.querySelector('.header-title--home span') ? window.getComputedStyle(document.querySelector('.header-title--home span')).opacity : null,
        videoSrc: document.querySelector('video') ? document.querySelector('video').currentSrc : null,
        videoPaused: document.querySelector('video') ? document.querySelector('video').paused : null,
      }))
    ]);
    console.log(`[Hero] Orig:`, heroCompare[0]);
    console.log(`[Hero] Rep: `, heroCompare[1]);

    // Test Scroll steps: Mission, Jets, Quote, Magazine, Footer
    const scrollTargets = vp.isMobile ? [600, 1400, 2200, 3000] : [800, 1600, 2600, 3800];
    const sectionNames = ['02_mission', '03_jets', '04_quote', '05_magazine'];

    for (let i = 0; i < scrollTargets.length; i++) {
      const y = scrollTargets[i];
      const sName = sectionNames[i];

      await origPage.evaluate((targetY) => window.scrollTo(0, targetY), y);
      await repPage.evaluate((targetY) => window.scrollTo(0, targetY), y);
      await Promise.all([origPage.waitForTimeout(600), repPage.waitForTimeout(600)]);

      await origPage.screenshot({ path: `screenshots/comparison/${vp.name}_orig_${sName}_${y}.png` });
      await repPage.screenshot({ path: `screenshots/comparison/${vp.name}_rep_${sName}_${y}.png` });

      const stateCompare = await Promise.all([
        origPage.evaluate(() => ({
          scrollY: window.scrollY,
          missionVis: document.querySelector('.mission')?.classList.contains('is-visible'),
          textImageIn: document.querySelector('.text-image--home-jets')?.classList.contains('is-in'),
          quoteIn: document.querySelector('.quote')?.classList.contains('is-in'),
          magazineVis: document.querySelector('.magazine')?.classList.contains('is-visible'),
        })),
        repPage.evaluate(() => ({
          scrollY: window.scrollY,
          missionVis: document.querySelector('.mission')?.classList.contains('is-visible'),
          textImageIn: document.querySelector('.text-image--home-jets')?.classList.contains('is-in'),
          quoteIn: document.querySelector('.quote')?.classList.contains('is-in'),
          magazineVis: document.querySelector('.magazine')?.classList.contains('is-visible'),
        }))
      ]);
      console.log(`[${sName} @ ${y}px] Orig:`, stateCompare[0], `| Rep:`, stateCompare[1]);
    }

    await origContext.close();
    await repContext.close();
  }

  await browser.close();
  console.log('\nComparison screenshots saved to screenshots/comparison/');
}

compare().catch(console.error);

