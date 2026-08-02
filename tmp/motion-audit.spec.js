const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const targets = [
  ['e-agent', 'https://corporate.e-agent.co.jp/'],
  ['counter', 'https://counter-digital.jp/'],
  ['local-home', 'file:///D:/claude/tsukumo99-live/index.html'],
  ['local-profile', 'file:///D:/claude/tsukumo99-live/profile.html'],
];

test('audit hero motion references', async ({ page }) => {
  test.setTimeout(180000);
  const outDir = path.resolve('tmp/motion-audit');
  fs.mkdirSync(outDir, { recursive: true });
  const report = {};

  for (const [name, url] of targets) {
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);

    const snapshots = [];
    for (const ms of [0, 1500, 3000, 5000]) {
      if (ms) await page.waitForTimeout(ms === 1500 ? 1500 : ms - snapshots.at(-1).ms);
      const file = path.join(outDir, `${name}-${ms}.png`);
      await page.screenshot({ path: file, fullPage: false });
      snapshots.push({ ms, file });
    }

    const before = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
    await page.mouse.move(120, 140);
    await page.waitForTimeout(500);
    await page.mouse.move(1180, 650, { steps: 20 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(outDir, `${name}-mouse.png`) });
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `${name}-scroll.png`) });

    report[name] = await page.evaluate(() => {
      const animated = [...document.querySelectorAll('*')].map(el => {
        const s = getComputedStyle(el);
        if (s.animationName === 'none' && s.transitionDuration === '0s' && s.transform === 'none') return null;
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return null;
        return {
          tag: el.tagName, id: el.id, cls: String(el.className).slice(0, 180),
          animationName: s.animationName, animationDuration: s.animationDuration,
          animationTimingFunction: s.animationTimingFunction,
          transition: s.transition, transform: s.transform, opacity: s.opacity,
          position: s.position, zIndex: s.zIndex,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height }
        };
      }).filter(Boolean).slice(0, 250);
      const scripts = [...document.scripts].map(s => s.src || '[inline]').slice(0, 100);
      const canvases = [...document.querySelectorAll('canvas')].map(c => ({
        id: c.id, cls: c.className, width: c.width, height: c.height,
        rect: c.getBoundingClientRect().toJSON()
      }));
      const videos = [...document.querySelectorAll('video')].map(v => ({
        src: v.currentSrc || v.src, autoplay: v.autoplay, loop: v.loop,
        muted: v.muted, paused: v.paused, duration: v.duration
      }));
      return {
        title: document.title, url: location.href,
        bodyClasses: document.body.className,
        scroll: { x: scrollX, y: scrollY },
        canvases, videos, animated, scripts,
        htmlClasses: document.documentElement.className,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    });
    report[name].initialScroll = before;
    report[name].consoleErrors = consoleErrors.slice(0, 30);
    report[name].snapshots = snapshots;
  }

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
});
