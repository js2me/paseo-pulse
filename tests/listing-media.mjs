import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import puppeteer from 'puppeteer-core';
const root = fileURLToPath(new URL('../', import.meta.url));
const assets = join(root, 'assets');
const writeMedia = !process.argv.includes('--verify');
const temp = await mkdtemp(join(tmpdir(), 'paseo-pulse-media-'));
let browser, server;
try {
  await mkdir(assets, { recursive: true });
  const bundle = join(temp, 'client.js');
  await build({ entryPoints: [join(root, 'tests/listing/client.jsx')], outfile: bundle, bundle: true, platform: 'browser',
    format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' },
    alias: { 'react-native': 'react-native-web', '@getpaseo/plugin/client': join(root, 'tests/listing/host.jsx'),
      '@getpaseo/plugin/client/ui': join(root, 'tests/listing/host.jsx') } });
  const html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Paseo Pulse sample data</title><style>html,body,#root{margin:0;width:100%;height:100%;overflow:hidden}#root{display:flex}*{box-sizing:border-box}body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#191e1b}svg{display:block}</style><div id="root"></div><script src="/client.js"></script></html>';
  server = createServer(async (request, response) => {
    try {
      if (request.url === '/client.js') { response.setHeader('content-type', 'text/javascript'); response.end(await readFile(bundle)); }
      else if (request.url === '/icon.svg') { response.setHeader('content-type', 'image/svg+xml'); response.end(await readFile(join(assets, 'icon.svg'))); }
      else if (request.url === '/icon') { response.setHeader('content-type', 'text/html'); response.end('<style>html,body{margin:0;width:512px;height:512px;background:transparent}</style><img src="/icon.svg" width="512" height="512">'); }
      else { response.setHeader('content-type', 'text/html'); response.end(html); }
    } catch { response.statusCode = 500; response.end('Media fixture failed'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await puppeteer.launch({ executablePath: process.env.PASEO_CHROME_BINARY ?? '/usr/bin/google-chrome', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'], userDataDir: join(temp, 'profile') });
  for (const [name, width, height, scale] of [['desktop', 1360, 900, 1], ['mobile', 390, 844, 2]]) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error(error.stack ?? error.message); });
    await page.setViewport({ width, height, deviceScaleFactor: scale });
    await page.goto(origin, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => globalThis.__pulseDemo?.renderBudgetExceeded || document.body.innerText.includes('Labels are consistent on desktop and mobile.'));
    assert.equal(await page.evaluate(() => !!globalThis.__pulseDemo?.renderBudgetExceeded), false, 'SDK settings must not trigger a React/MobX feedback loop');
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth,
      tabs: [...document.querySelectorAll('[role="tab"]')].map(element => element.textContent),
      readRows: document.querySelectorAll('[aria-label*="Read, Recent"]').length,
      running: document.querySelectorAll('[aria-label$=", Working"]').length }));
    assert.equal(errors.length, 0, errors.join('\n'));
    assert.equal(result.overflow, false, `${name} overflows`);
    assert.ok(result.tabs.some(text => text.includes('Attention') && text.includes('9')), `${name} attention count`);
    assert.ok(result.readRows >= 3, `${name} read styling`);
    assert.equal(result.running, 2, `${name} running indicators`);
    const idle = await page.evaluate(async () => {
      const before = globalThis.__pulseDemo.settingsRenders;
      await new Promise(resolve => setTimeout(resolve, 1200));
      return globalThis.__pulseDemo.settingsRenders - before;
    });
    assert.ok(idle <= 4, `${name} idle render count: ${idle}`);
    const churn = await page.evaluate(async () => {
      const before = globalThis.__pulseDemo.settingsRenders;
      for (let i = 0; i < 40; i++) {
        globalThis.__pulseDemo.updateHost();
        await new Promise(requestAnimationFrame);
      }
      return globalThis.__pulseDemo.settingsRenders - before;
    });
    assert.ok(churn < 500, `${name} host updates must settle: ${churn}`);
    if (writeMedia) await page.screenshot({ path: join(assets, `${name}.png`) });
    // Exercise the actual buttons against the fixture API, never a live daemon.
    const projectPlus = '[aria-label="New workspace in Horizon API"]';
    await page.waitForSelector(projectPlus);
    await page.$eval(projectPlus, button => { button.click(); button.click(); });
    await page.waitForFunction(() => globalThis.__pulseDemo.opened.length === 1);
    const projectDraft = await page.evaluate(() => globalThis.__pulseDemo.opened[0]);
    assert.deepEqual(projectDraft, { serverId: 'sample-host', projectId: 'horizon',
      sourceDirectory: '/projects/horizon-api', displayName: 'Horizon API' });
    assert.equal(await page.evaluate(() => globalThis.__pulseDemo.created.length), 0, `${name} plus must not create agents`);
    await page.click('[aria-label="New workspace"]');
    await page.waitForFunction(() => globalThis.__pulseDemo.opened.length === 2);
    assert.deepEqual(await page.evaluate(() => globalThis.__pulseDemo.opened[1]), { serverId: 'sample-host' });
    await page.evaluate(() => { globalThis.__pulseDemo.fail = true; });
    await page.click('[aria-label="New workspace"]');
    await page.waitForFunction(() => document.body.innerText.includes('Sample creation error'));
    assert.equal(await page.evaluate(() => globalThis.__pulseDemo.opened.length), 2, `${name} failed creation must not navigate`);
    assert.notEqual(await page.$eval('[aria-label="New workspace"]', button => button.getAttribute('aria-disabled')), 'true');
    await page.click('[aria-label="Find a session"]');
    await page.type('[aria-label="Search sessions"]', 'Horizon');
    await page.waitForFunction(() => !document.body.innerText.includes('Atlas Studio'));
    await page.click('[aria-label="Close search"]');
    await page.waitForFunction(() => document.body.innerText.includes('Atlas Studio'));
    await page.$eval('[aria-label="Atlas Studio, 4 sessions"]', button => button.click());
    await page.waitForFunction(() => !document.body.innerText.includes('Approve the navigation plan'));
    await page.$eval('[aria-label="Atlas Studio, 4 sessions"]', button => button.click());
    await page.waitForFunction(() => document.body.innerText.includes('Approve the navigation plan'));
    const reads = await page.evaluate(() => [globalThis.__pulseDemo.directoryReads, globalThis.__pulseDemo.subscriptions]);
    await page.evaluate(() => globalThis.__pulseDemo.setVisible(false));
    await page.waitForFunction(() => !document.querySelector('[aria-label="New workspace"]'));
    const closedIdle = await page.evaluate(async () => {
      const before = globalThis.__pulseDemo.settingsRenders;
      await new Promise(resolve => setTimeout(resolve, 1200));
      return globalThis.__pulseDemo.settingsRenders - before;
    });
    assert.ok(closedIdle <= 4, `${name} closed-screen/sidebar render count: ${closedIdle}`);
    await page.evaluate(() => globalThis.__pulseDemo.setVisible(true));
    await page.waitForSelector('[aria-label="New workspace"]');
    const reopened = await page.evaluate(() => ({ text: document.body.innerText,
      reads: [globalThis.__pulseDemo.directoryReads, globalThis.__pulseDemo.subscriptions] }));
    assert.deepEqual(reopened.reads, reads, `${name} reopening must keep the owned directory`);
    assert.ok(reopened.text.includes('Labels are consistent on desktop and mobile.'), `${name} immediate cached previews`);
    assert.equal(reopened.text.includes('Loading…'), false, `${name} no repeat loading screen`);
    console.log(`${name}: idle renders=${idle}, 40 host updates=${churn}, closed-screen idle renders=${closedIdle}`);
    assert.equal(errors.length, 0, errors.join('\n'));
    await page.close();
  }
  const icon = await browser.newPage();
  await icon.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  await icon.goto(`${origin}/icon`, { waitUntil: 'networkidle0' });
  if (writeMedia) await icon.screenshot({ path: join(assets, 'icon.png'), omitBackground: true });
  await icon.close();
  console.log(writeMedia ? 'Captured actual session components with sample data: assets/desktop.png, assets/mobile.png and assets/icon.png.'
    : 'UI regression checks passed with fresh SDK settings snapshots and bounded render counts.');
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  await rm(temp, { recursive: true, force: true });
}
