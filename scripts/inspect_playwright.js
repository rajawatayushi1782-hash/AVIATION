const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.flyplatoon.com';

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

async function run() {
  const outDir = path.join(__dirname, '..', 'screenshots', 'original');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  console.log('Browser launched.');

  const networkLog = [];
  const consoleLog = [];

  // Capture all routes at Desktop 1440x900
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  page.on('console', msg => consoleLog.push({ type: msg.type(), text: msg.text() }));
  page.on('requestfinished', req => {
    networkLog.push({ url: req.url(), resourceType: req.resourceType() });
  });

  console.log('Testing Desktop 1440x900 routes...');
  for (const route of ROUTES) {
    console.log(`Navigating to ${route.name} (${BASE_URL}${route.path})...`);
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000); // Wait for animations / fonts to settle
      
      // Full page screenshot
      await page.screenshot({
        path: path.join(outDir, `${route.name}_desktop_full.png`),
        fullPage: true
      });
      // Viewport screenshot
      await page.screenshot({
        path: path.join(outDir, `${route.name}_desktop_viewport.png`),
        fullPage: false
      });
      console.log(`Captured ${route.name} desktop`);
    } catch (e) {
      console.error(`Failed ${route.name}:`, e.message);
    }
  }

  // Test interactive elements: Menu open
  try {
    console.log('Testing Menu Open interaction...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    // Click burger menu button
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

  // Test responsive viewports for key pages (home, jets, career)
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
        await vpPage.goto(`${BASE_URL}${r.path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await vpPage.waitForTimeout(2000);
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
        console.error(`Error ${rName} at ${vp.name}:`, e.message);
      }
    }
    await vpContext.close();
  }

  // Save network and console logs
  fs.writeFileSync(path.join(__dirname, '..', 'inspection_network.json'), JSON.stringify(networkLog, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'inspection_console.json'), JSON.stringify(consoleLog, null, 2));

  await browser.close();
  console.log('Inspection complete. Screenshots saved.');
}

run().catch(console.error);
