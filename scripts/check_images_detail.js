import { chromium } from 'playwright';

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

async function checkPage(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });
  page.on('response', resp => {
    if (resp.status() >= 400 && resp.request().resourceType() === 'image') {
      failedRequests.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Force all images to load (disable lazy loading for audit)
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
    });
  });
  await page.waitForTimeout(2000);

  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      alt: img.alt,
      className: img.className,
      parent: img.parentElement ? img.parentElement.className : '',
    }));
  });

  const videos = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.src || v.currentSrc,
      poster: v.poster,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      className: v.className,
    }));
  });

  await browser.close();
  return { images, videos, failedRequests };
}

async function run() {
  for (const r of ROUTES) {
    console.log(`\n=================== CHECKING: ${r} ===================`);
    const orig = await checkPage(`https://www.flyplatoon.com${r}`);
    const rep = await checkPage(`http://localhost:3000${r}`);

    console.log(`Orig Images: ${orig.images.length}, Videos: ${orig.videos.length}, Failed: ${orig.failedRequests.length}`);
    console.log(`Rep  Images: ${rep.images.length}, Videos: ${rep.videos.length}, Failed: ${rep.failedRequests.length}`);

    // Broken images in replica (naturalWidth === 0)
    const repBroken = rep.images.filter(img => img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'));
    if (repBroken.length > 0) {
      console.log(`[Rep Broken Images]:`, repBroken.map(b => ({ src: b.src, parent: b.parent })));
    } else {
      console.log(`All ${rep.images.length} images loaded successfully with naturalWidth > 0.`);
    }

    // Missing from replica
    const origSrcs = new Set(orig.images.map(i => i.src));
    const repSrcs = new Set(rep.images.map(i => i.src));
    const missing = [...origSrcs].filter(s => !repSrcs.has(s) && !s.includes('google'));
    if (missing.length > 0) {
      console.log(`[Missing from replica]:`, missing);
    }

    const extra = [...repSrcs].filter(s => !origSrcs.has(s) && !s.includes('google'));
    if (extra.length > 0) {
      console.log(`[Present in replica but not in orig]:`, extra);
    }
  }
}

run().catch(console.error);

