const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://www.flyplatoon.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  // Inspect page scripts and libraries
  const libInfo = await page.evaluate(() => {
    return {
      hasGsap: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasCore: typeof window.core !== 'undefined',
      coreKeys: window.core ? Object.keys(window.core) : null,
      scrollCustom: window.core ? window.core.scrollCustom : null,
      customProps: {
        scroll: getComputedStyle(document.documentElement).getPropertyValue('--scroll'),
        winHeight: getComputedStyle(document.documentElement).getPropertyValue('--win-height')
      }
    };
  });
  console.log('Original Site Tech / Global State:', JSON.stringify(libInfo, null, 2));

  // Sample scroll positions
  const testScrolls = [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3500, 4000, 4500, 5000, 5500];

  console.log('\n--- SCROLL BEHAVIOR SAMPLES ON ORIGINAL SITE ---');
  for (const s of testScrolls) {
    await page.evaluate((targetY) => {
      // Simulate wheel event
      const evt = new WheelEvent('wheel', { deltaY: targetY - (window.core ? window.core.scrollTop : window.scrollY), bubbles: true });
      document.dispatchEvent(evt);
      if (window.core) {
        window.core.scrollTop = targetY;
        const scrollable = document.querySelector('#scrollable') || document.querySelector('.scroll__scrollable');
        if (scrollable) scrollable.style.transform = `translate3d(0, -${targetY}px, 0)`;
        document.documentElement.style.setProperty('--scroll', `${targetY}px`);
      } else {
        window.scrollTo(0, targetY);
      }
    }, s);

    await page.waitForTimeout(400);

    const frameData = await page.evaluate(() => {
      const getInline = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return {
          className: el.className,
          style: el.getAttribute('style'),
          transform: window.getComputedStyle(el).transform,
          opacity: window.getComputedStyle(el).opacity,
          rectTop: Math.round(el.getBoundingClientRect().top)
        };
      };

      return {
        htmlScrollVar: document.documentElement.style.getPropertyValue('--scroll'),
        scrollableTransform: document.querySelector('#scrollable')?.style.transform,
        header: getInline('.header'),
        headerTitle: getInline('.header__title'),
        missionInner: getInline('.mission__inner'),
        missionCopy: getInline('.mission__copy'),
        textImage: getInline('.text-image'),
        textImageAsset: getInline('.text-image__asset'),
        contentBlock: getInline('.content-block'),
        quote: getInline('.quote'),
        quoteFirstImg: getInline('.quote__image-container.is-quote-first'),
        quoteSecondImg: getInline('.quote__image-container.is-quote-second'),
        magazine: getInline('.magazine'),
        magazineAsset: getInline('.magazine__asset')
      };
    });

    console.log(`Scroll ${s}px:`, JSON.stringify(frameData));
  }

  await browser.close();
})();

