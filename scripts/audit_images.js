import { chromium } from 'playwright';
import fs from 'fs';

const ROUTES = [
  '/',
  '/jets',
  '/experience',
  '/our-story',
  '/sponsoring',
  '/career',
  '/imprint',
  '/privacy-policy'
];

async function auditRoute(route, browser) {
  console.log(`\n=================== AUDITING ROUTE: ${route} ===================`);
  const origPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const origFailed = [];
  const repFailed = [];

  origPage.on('response', resp => {
    if (resp.status() >= 400 && resp.request().resourceType() === 'image') {
      origFailed.push({ url: resp.url(), status: resp.status() });
    }
  });

  repPage.on('response', resp => {
    if (resp.status() >= 400 && (resp.request().resourceType() === 'image' || resp.request().resourceType() === 'media')) {
      repFailed.push({ url: resp.url(), status: resp.status() });
    }
  });

  // Load pages
  try {
    await origPage.goto(`https://www.flyplatoon.com${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.warn(`Warning loading orig ${route}:`, e.message);
  }

  try {
    await repPage.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.warn(`Warning loading rep ${route}:`, e.message);
  }

  // Scroll to bottom slowly on both pages to trigger lazy-loaded images
  for (const page of [origPage, repPage]) {
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
      for (let y = 0; y < scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
  }
  await Promise.all([origPage.waitForTimeout(1000), repPage.waitForTimeout(1000)]);

  // Extract all visual assets
  const extractAssets = async (page) => {
    return page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth: img.clientWidth,
        displayedHeight: img.clientHeight,
        alt: img.alt,
        className: img.className,
        visible: img.offsetParent !== null && window.getComputedStyle(img).display !== 'none' && window.getComputedStyle(img).visibility !== 'hidden',
        parentClass: img.parentElement ? img.parentElement.className : '',
      }));

      const videos = Array.from(document.querySelectorAll('video')).map(v => ({
        src: v.src,
        currentSrc: v.currentSrc,
        poster: v.poster,
        videoWidth: v.videoWidth,
        videoHeight: v.videoHeight,
        paused: v.paused,
        className: v.className,
      }));

      // Background images
      const bgImages = [];
      document.querySelectorAll('*').forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none' && bg.startsWith('url(')) {
          bgImages.push({
            tag: el.tagName,
            className: el.className,
            bg: bg
          });
        }
      });

      return { imgs, videos, bgImages };
    });
  };

  const origAssets = await extractAssets(origPage);
  const repAssets = await extractAssets(repPage);

  console.log(`[Orig] Images count: ${origAssets.imgs.length}, Videos: ${origAssets.videos.length}, BG Images: ${origAssets.bgImages.length}`);
  console.log(`[Rep]  Images count: ${repAssets.imgs.length}, Videos: ${repAssets.videos.length}, BG Images: ${repAssets.bgImages.length}`);

  // Check for broken images in replica (naturalWidth === 0)
  const brokenImgs = repAssets.imgs.filter(img => img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'));
  if (brokenImgs.length > 0) {
    console.error(`[Rep Broken Images] ${brokenImgs.length} images failed to load:`, brokenImgs.map(i => ({ src: i.src, parent: i.parentClass })));
  } else {
    console.log(`[Rep Broken Images] None! All ${repAssets.imgs.length} images loaded with positive naturalWidth.`);
  }

  if (repFailed.length > 0) {
    console.error(`[Rep Failed Network Requests (404/etc)]`, repFailed);
  }

  // Check differences in image sources
  const origSrcs = new Set(origAssets.imgs.map(i => i.src));
  const repSrcs = new Set(repAssets.imgs.map(i => i.src));

  const missingFromRep = [...origSrcs].filter(s => !repSrcs.has(s) && !s.includes('google-analytics') && !s.includes('googletagmanager'));
  if (missingFromRep.length > 0) {
    console.warn(`[Images present on Orig but missing in Rep]:`, missingFromRep);
  }

  await origPage.close();
  await repPage.close();

  return {
    route,
    origImagesCount: origAssets.imgs.length,
    repImagesCount: repAssets.imgs.length,
    brokenImgs,
    repFailed,
    missingFromRep,
    origVideos: origAssets.videos,
    repVideos: repAssets.videos,
    origBg: origAssets.bgImages,
    repBg: repAssets.bgImages,
  };
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  const allResults = [];
  for (const route of ROUTES) {
    const res = await auditRoute(route, browser);
    allResults.push(res);
  }

  await browser.close();
  fs.writeFileSync('audit_results.json', JSON.stringify(allResults, null, 2));
  console.log('\nAudit complete. Saved to audit_results.json');
}

run().catch(console.error);

