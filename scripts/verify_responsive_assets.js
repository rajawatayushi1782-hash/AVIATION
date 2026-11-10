import { chromium } from 'playwright';
import fs from 'fs';

const VIEWPORTS = [
  { name: 'mobile_375', width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet_768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'tablet_1024', width: 1024, height: 800, isMobile: false },
  { name: 'desktop_1440', width: 1440, height: 900, isMobile: false },
];

const PAGES = ['/', '/jets', '/experience', '/our-story', '/sponsoring', '/career'];

async function verifyVisuals() {
  fs.mkdirSync('screenshots/responsive_assets', { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  const summary = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    for (const route of PAGES) {
      const page = await context.newPage();
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const pageName = route === '/' ? 'home' : route.replace('/', '');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);

      const visualStats = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.src,
          width: i.clientWidth,
          height: i.clientHeight,
          parent: i.parentElement ? i.parentElement.className : ''
        }));
        const videos = Array.from(document.querySelectorAll('video')).map(v => ({
          src: v.src || v.currentSrc,
          width: v.clientWidth,
          height: v.clientHeight,
          paused: v.paused
        }));
        const logo = document.querySelector('.topbar__logo img');
        return {
          imgCount: imgs.length,
          visibleImgs: imgs.filter(i => i.width > 0 && i.height > 0).length,
          zeroDimImgs: imgs.filter(i => i.width === 0 || i.height === 0),
          videoCount: videos.length,
          playingVideos: videos.filter(v => !v.paused).length,
          logoWidth: logo ? logo.clientWidth : null,
          logoHeight: logo ? logo.clientHeight : null,
        };
      });

      console.log(`[${vp.name} - ${route}] scrollWidth: ${scrollWidth}/${innerWidth}, Images: ${visualStats.visibleImgs}/${visualStats.imgCount} visible, Logo: ${visualStats.logoWidth}x${visualStats.logoHeight}px`);

      if (visualStats.zeroDimImgs.length > 0) {
        // Report zero dimension images that are NOT intentionally hidden menu/footer images
        const unexpectedZero = visualStats.zeroDimImgs.filter(i => 
          !i.parent.includes('menu__images') && 
          !i.parent.includes('footer-chapter-item')
        );
        if (unexpectedZero.length > 0) {
          console.warn(`  Unexpected zero-dimension images on ${route}:`, unexpectedZero);
        }
      }

      await page.screenshot({ path: `screenshots/responsive_assets/${vp.name}_${pageName}.png` });
      await page.close();

      summary.push({
        viewport: vp.name,
        route,
        noOverflow: scrollWidth <= innerWidth,
        logoVisible: visualStats.logoWidth > 0,
        visibleImages: visualStats.visibleImgs,
        totalImages: visualStats.imgCount,
      });
    }

    await context.close();
  }

  await browser.close();
  fs.writeFileSync('visual_assets_summary.json', JSON.stringify(summary, null, 2));
  console.log('\nResponsive visual assets test complete. Saved to visual_assets_summary.json');
}

verifyVisuals().catch(console.error);

