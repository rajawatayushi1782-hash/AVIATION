const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function auditSite(url, siteName, screenshotDir) {
  console.log(`\n=== Starting Audit for: ${siteName} (${url}) ===`);
  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleLogs.push(msg.text());
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push({ url: resp.url(), status: resp.status() });
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error(`Failed to load ${url}:`, err.message);
  }

  // Identify root and sections
  const pageDetails = await page.evaluate(() => {
    const isCustomScroll = !document.documentElement.classList.contains('is-scroll-default') &&
                           !document.body.classList.contains('custom-scroll-disabled');
    const scrollEl = document.querySelector('#scrollable') || document.querySelector('.scroll__scrollable') || document.body;
    const scrollHeight = scrollEl ? scrollEl.scrollHeight : document.body.scrollHeight;

    // Detect all top-level sections
    const selectors = [
      '.header',
      '.mission',
      '.text-image',
      '.facts',
      '.quote',
      '.fullsize',
      '.gallery',
      '.magazine',
      '.statement',
      '.footer'
    ];

    const sections = [];
    selectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        sections.push({
          selector: sel,
          index: idx,
          className: el.className,
          id: el.id,
          offsetTop: el.offsetTop,
          rect: {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height
          },
          styles: {
            position: styles.position,
            transform: styles.transform,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            overflow: styles.overflow
          },
          hasVideo: !!el.querySelector('video'),
          videoSrc: el.querySelector('video') ? (el.querySelector('video').currentSrc || el.querySelector('video source')?.src) : null,
          imageCount: el.querySelectorAll('img').length,
          images: Array.from(el.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.getBoundingClientRect().width,
            height: img.getBoundingClientRect().height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            opacity: window.getComputedStyle(img).opacity,
            visibility: window.getComputedStyle(img).visibility,
            transform: window.getComputedStyle(img).transform
          })),
          textContentPreview: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100)
        });
      });
    });

    return {
      title: document.title,
      isCustomScroll,
      totalScrollHeight: scrollHeight,
      sections
    };
  });

  console.log(`Found ${pageDetails.sections.length} sections in ${siteName}`);

  // Capture snapshots at various scroll steps
  const scrollSteps = [0, 500, 1200, 2000, 3000, 4200, 5500, 7000, 8500, 10000];
  const snapshots = [];

  for (let i = 0; i < scrollSteps.length; i++) {
    const scrollY = scrollSteps[i];
    
    // Perform scroll (handling custom wheel vs window scroll)
    await page.evaluate((targetY) => {
      const scrollable = document.querySelector('#scrollable') || document.querySelector('.scroll__scrollable');
      if (scrollable && window.core && window.core.scrollCustom !== false) {
        // Dispatch wheel event to drive custom smooth scroll
        const evt = new WheelEvent('wheel', { deltaY: targetY - (window.core.scrollTop || 0), bubbles: true });
        document.dispatchEvent(evt);
        // Also direct assign if needed for test accuracy
        window.core.scrollTop = targetY;
        scrollable.style.transform = `translate3d(0, -${targetY}px, 0)`;
        document.documentElement.style.setProperty('--scroll', `${targetY}px`);
      } else {
        window.scrollTo(0, targetY);
      }
    }, scrollY);

    await page.waitForTimeout(800); // Allow RAF animations and transitions to settle

    const shotName = `scroll_${String(scrollY).padStart(5, '0')}.png`;
    const shotPath = path.join(screenshotDir, shotName);
    await page.screenshot({ path: shotPath, fullPage: false });

    // Capture state of sections at this scroll position
    const sectionStates = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.header, .mission, .text-image, .facts, .quote, .fullsize, .gallery, .magazine, .statement, .footer'));
      return items.map(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          className: el.className,
          top: Math.round(rect.top),
          height: Math.round(rect.height),
          opacity: style.opacity,
          transform: style.transform,
          inViewport: rect.top < window.innerHeight && rect.bottom > 0
        };
      });
    });

    snapshots.push({
      scrollY,
      shotName,
      sectionStates
    });
  }

  await browser.close();

  return {
    siteName,
    url,
    pageDetails,
    snapshots,
    consoleLogs,
    networkErrors
  };
}

(async () => {
  const originalResult = await auditSite('https://www.flyplatoon.com/', 'Original', path.resolve(__dirname, '../screenshots/audit/original'));
  const cloneResult = await auditSite('http://localhost:3000/', 'Clone', path.resolve(__dirname, '../screenshots/audit/clone'));

  const report = {
    timestamp: new Date().toISOString(),
    original: originalResult,
    clone: cloneResult
  };

  fs.writeFileSync(path.resolve(__dirname, '../screenshots/audit/audit_comparison.json'), JSON.stringify(report, null, 2));
  console.log('\nAudit complete! Saved data to screenshots/audit/audit_comparison.json');
})();
