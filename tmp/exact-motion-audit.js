const { chromium } = require('C:/Users/lzl2lzl/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const targets = [
  { name: 'e-agent', url: 'https://corporate.e-agent.co.jp/' },
  { name: 'counter', url: 'https://counter-digital.jp/' },
  { name: 'redandgreen', url: 'https://redandgreen.jp/' },
];

(async () => {
  const out = path.resolve('docs/research/exact-motion-audit');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = {};

  for (const target of targets) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const samples = [];
    let elapsed = 0;
    for (const at of [1000, 5000, 10000]) {
      await page.waitForTimeout(at - elapsed); elapsed = at;
      const file = path.join(out, `${target.name}-${at}.png`);
      await page.screenshot({ path: file });
      samples.push({ at, file });
    }

    const stateBeforeMouse = await page.evaluate(capture);
    await page.mouse.move(60, 80);
    await page.waitForTimeout(800);
    await page.mouse.move(1320, 760, { steps: 40 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(out, `${target.name}-mouse.png`) });
    const stateAfterMouse = await page.evaluate(capture);

    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(out, `${target.name}-scroll.png`) });
    const stateAfterScroll = await page.evaluate(capture);

    report[target.name] = { target, samples, stateBeforeMouse, stateAfterMouse, stateAfterScroll, errors: errors.slice(0, 30) };
    await context.close();
  }

  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
})();

function capture() {
  const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x,y:r.y,w:r.width,h:r.height }; };
  const style = el => { const s=getComputedStyle(el); return { position:s.position,zIndex:s.zIndex,opacity:s.opacity,transform:s.transform,filter:s.filter,mixBlendMode:s.mixBlendMode,clipPath:s.clipPath,background:s.background,animation:s.animation,transition:s.transition }; };
  const visible = el => { const r=el.getBoundingClientRect(),s=getComputedStyle(el); return r.bottom>-100&&r.top<innerHeight+100&&r.right>-100&&r.left<innerWidth+100&&s.display!=='none'&&s.visibility!=='hidden'; };
  return {
    url: location.href, title: document.title, scroll: { x:scrollX,y:scrollY },
    canvases: [...document.querySelectorAll('canvas')].map(el => ({ tag:'canvas', id:el.id, cls:String(el.className), width:el.width,height:el.height,rect:rect(el),style:style(el) })),
    videos: [...document.querySelectorAll('video')].map(el => ({ src:el.currentSrc||el.src,autoplay:el.autoplay,loop:el.loop,muted:el.muted,paused:el.paused,rect:rect(el),style:style(el) })),
    visibleStyled: [...document.querySelectorAll('body *')].filter(visible).map(el => ({ tag:el.tagName,id:el.id,cls:String(el.className).slice(0,180),rect:rect(el),style:style(el) })).filter(x => x.style.animation!=='none 0s ease 0s 1 normal none running' || x.style.transform!=='none' || x.style.mixBlendMode!=='normal' || x.tag==='CANVAS').slice(0,350),
    scripts: [...document.scripts].map(s=>s.src||'[inline]'),
    bodyClass: document.body.className,
    htmlClass: document.documentElement.className,
  };
}
