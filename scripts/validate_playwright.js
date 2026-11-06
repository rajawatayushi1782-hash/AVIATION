import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'jets', path: '/jets' },
  { name: 'experience', path: '/experience' },
  { name: 'our-story', path: '/our-story' },
  { name: 'sponsoring', path: '/sponsoring' },
  { name: 'career', path: '/career' },
  { name: 'imprint', path: '/imprint' },
  { name: 'privacy-policy', path: '/privacy-policy' }
];

async function waitForPageReady(p) {
  try {
    await p.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('.header img, .topbar img, img'));
      return imgs.slice(0, 3).every(img => img.complete);
    }, { timeout: 3000 });
  } catch (e) {}
  await p.waitForTimeout(1200);
}

async function run() {
  const outDir = path.join(__dirname, '..', 'screenshots', 'replica');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  console.log('Validating replica website on localhost:3000...');

  const consoleErrors = [];

  // Desktop viewports for all routes
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  for (const route of ROUTES) {
    console.log(`Checking ${route.name} (${BASE_URL}${route.path})...`);
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await waitForPageReady(page);

      // Viewport screenshot
      await page.screenshot({
        path: path.join(outDir, `${route.name}_desktop_viewport.png`),
        fullPage: false
      });
      // Full page screenshot
      await page.screenshot({
        path: path.join(outDir, `${route.name}_desktop_full.png`),
        fullPage: true
      });
      console.log(`Captured ${route.name} desktop`);
    } catch (e) {
      console.error(`Error on ${route.name}:`, e.message);
    }
  }

  // Test Menu Interaction
  try {
    console.log('Testing Menu Open interaction...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const burger = await page.$('.burger, button[class*="burger"], [class*="Burger"]');
    if (burger) {
      await burger.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(outDir, `menu_open_desktop.png`),
        fullPage: false
      });
      console.log('Captured menu open desktop');
    }
  } catch (e) {
    console.error('Menu open test failed:', e.message);
  }

  // Test other viewports for key pages
  for (const vp of VIEWPORTS.filter(v => v.name !== 'desktop')) {
    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const vpContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.name === 'mobile' || vp.name === 'tablet',
      hasTouch: vp.name === 'mobile' || vp.name === 'tablet'
    });
    const vpPage = await vpContext.newPage();
    for (const rName of ['home', 'jets', 'career', 'our-story']) {
      const r = ROUTES.find(x => x.name === rName);
      try {
        await vpPage.goto(`${BASE_URL}${r.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await waitForPageReady(vpPage);
        await vpPage.screenshot({
          path: path.join(outDir, `${rName}_${vp.name}_viewport.png`),
          fullPage: false
        });
        await vpPage.screenshot({
          path: path.join(outDir, `${rName}_${vp.name}_full.png`),
          fullPage: true
        });
        console.log(`Captured ${rName} at ${vp.name}`);
      } catch (e) {
        console.error(`Error on ${rName} at ${vp.name}:`, e.message);
      }
    }
    await vpContext.close();
  }

  await browser.close();
  console.log('Validation finished. Console errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Sample console errors:', consoleErrors.slice(0, 5));
  }
}

run().catch(console.error);
