const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = path.resolve(__dirname, '../screenshots/corrected_sections');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Desktop captures
  const pDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pDesktop.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await pDesktop.waitForTimeout(2000);

  const sectionsToCapture = [
    { name: '01_header', scrollY: 0 },
    { name: '02_mission', scrollY: 1000 },
    { name: '03_text_image_jets', scrollY: 2200 },
    { name: '04_quote_dual_jets', scrollY: 3400 },
    { name: '05_magazine_experience', scrollY: 4600 },
    { name: '06_footer_legal', scrollY: 5780 }
  ];

  for (const s of sectionsToCapture) {
    await pDesktop.evaluate((targetY) => {
      window.scrollTo(0, targetY);
      if (window.core) {
        window.core.scrollTop = targetY;
        const scrollable = document.querySelector('#scrollable') || document.querySelector('.scroll__scrollable');
        if (scrollable && window.core.scrollCustom !== false) {
          scrollable.style.transform = `translate3d(0, -${targetY}px, 0)`;
        }
        document.documentElement.style.setProperty('--scroll', `${targetY}px`);
      }
    }, s.scrollY);

    await pDesktop.waitForTimeout(500);
    const dest = path.join(outDir, `desktop_${s.name}.png`);
    await pDesktop.screenshot({ path: dest, fullPage: false });
    console.log(`Saved desktop screenshot: ${dest}`);
  }

  // Mobile captures (390px)
  const pMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pMobile.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await pMobile.waitForTimeout(2000);

  const mobileSections = [
    { name: '01_header_mobile', scrollY: 0 },
    { name: '02_mission_mobile', scrollY: 800 },
    { name: '03_text_image_mobile', scrollY: 1800 },
    { name: '04_quote_mobile', scrollY: 2800 },
    { name: '05_magazine_mobile', scrollY: 3800 },
    { name: '06_footer_mobile', scrollY: 4800 }
  ];

  for (const s of mobileSections) {
    await pMobile.evaluate((targetY) => {
      window.scrollTo(0, targetY);
      if (window.core) {
        window.core.scrollTop = targetY;
        document.documentElement.style.setProperty('--scroll', `${targetY}px`);
      }
    }, s.scrollY);

    await pMobile.waitForTimeout(500);
    const dest = path.join(outDir, `mobile_${s.name}.png`);
    await pMobile.screenshot({ path: dest, fullPage: false });
    console.log(`Saved mobile screenshot: ${dest}`);
  }

  // Check console errors and horizontal overflow
  const auditChecks = await pDesktop.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      imagesBroken: Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0 && !img.hasAttribute('loading')).map(i => i.src)
    };
  });
  console.log('Desktop audit check:', auditChecks);

  const mobileAuditChecks = await pMobile.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      imagesBroken: Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0 && !img.hasAttribute('loading')).map(i => i.src)
    };
  });
  console.log('Mobile audit check:', mobileAuditChecks);

  await browser.close();
})();

