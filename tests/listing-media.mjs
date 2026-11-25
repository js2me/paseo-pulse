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
    format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"', global: "globalThis" },
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
    if (name === 'desktop') {
      assert.equal(await page.$eval('[aria-label="Sessions in progress: 2"]', badge => badge.textContent), '2');
      assert.equal(await page.$eval('[aria-label="New completed replies: 1"]', badge => badge.textContent), '1');
      const badgeColors = await page.evaluate(() => [
        getComputedStyle(document.querySelector('[aria-label="Sessions in progress: 2"]')).backgroundColor,
        getComputedStyle(document.querySelector('[aria-label="New completed replies: 1"]')).backgroundColor,
      ]);
      assert.notEqual(badgeColors[0], badgeColors[1]);
    }
    const textOffsets = await page.evaluate(() => [
      document.querySelector('[aria-label$=", Working"]'),
      document.querySelector('[aria-label^="Align settings labels,"]'),
    ].map(row => row.children[1].getBoundingClientRect().left - row.getBoundingClientRect().left));
    assert.equal(textOffsets[0], textOffsets[1], `${name} running and idle text must align`);
    assert.equal(await page.$eval('[aria-label="Session tokens, input and output including cache: 12345"]', text => text.textContent), "≈12.3K ◈");
    // Exercise real query updates through both animated row fields.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.evaluate(() => globalThis.__pulseDemo.updateReply('checkout', {
      text: 'New streamed preview', totalTokens: 25000,
    }));
    await page.waitForFunction(() => {
      const tokens = document.querySelector('[aria-label="Session tokens, input and output including cache: 25000"]');
      return tokens && Number(getComputedStyle(tokens).opacity) < 0.99;
    }, { polling: 'raf' });
    await page.waitForFunction(() => [...document.querySelectorAll('div')].some(element =>
      element.textContent === 'New streamed preview' && Number(getComputedStyle(element).opacity) < 0.99), { polling: 'raf' });
    await page.waitForFunction(() => {
      const tokens = document.querySelector('[aria-label="Session tokens, input and output including cache: 25000"]');
      return tokens && Number(getComputedStyle(tokens).opacity) === 1;
    }, { polling: 'raf' });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 50)));
    await page.evaluate(() => globalThis.__pulseDemo.updateReply('checkout', {
      text: 'Reduced motion preview', totalTokens: 30000,
    }));
    await page.waitForSelector('[aria-label="Session tokens, input and output including cache: 30000"]');
    assert.equal(await page.$eval('[aria-label="Session tokens, input and output including cache: 30000"]',
      element => Number(getComputedStyle(element).opacity)), 1, `${name} reduced motion disables animation`);
    await page.evaluate(() => globalThis.__pulseDemo.updateReply('checkout', {
      text: 'Updating responsive states and keyboard navigation.', totalTokens: 12345,
    }));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
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
    const grouped = '[role="radio"][aria-checked="true"]';
    assert.equal(await page.$eval(grouped, element => element.textContent), 'By workspace');
    const planIcon = '[aria-label^="Approve the navigation plan,"] [aria-label="Atlas Studio"]';
    const integrationIcon = '[aria-label^="Investigate an integration failure,"] [aria-label="Horizon API"]';
    assert.equal(await page.$(planIcon), null, `${name} grouped rows do not repeat workspace icons`);
    await page.$eval('[role="radio"][aria-label="None"]', button => button.click());
    await page.waitForFunction(() => !document.querySelector('[aria-label="Atlas Studio, 4 sessions"]'));
    assert.equal(await page.$eval(grouped, element => element.textContent), 'None');
    assert.ok(await page.$('[aria-label^="Approve the navigation plan,"]'), `${name} flat sessions remain visible`);
    await page.waitForSelector(planIcon);
    await page.waitForSelector(integrationIcon);
    assert.equal(await page.$eval(planIcon, icon => icon.title), 'Atlas Studio');
    assert.equal(await page.$eval(integrationIcon, icon => icon.title), 'Horizon API');
    const iconPlacement = await page.$eval(planIcon, icon => {
      const title = icon.previousElementSibling.getBoundingClientRect();
      const bounds = icon.getBoundingClientRect();
      return { gap: bounds.left - title.right, aligned: Math.abs(bounds.top - title.top) < 2 };
    });
    assert.equal(iconPlacement.gap, 6, `${name} workspace icon follows the title immediately`);
    assert.equal(iconPlacement.aligned, true, `${name} workspace icon stays on the title line`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name} grouping control overflows`);
    await page.click('[role="radio"][aria-label="By status"]');
    await page.waitForFunction(() => document.body.innerText.includes('Needs action'));
    assert.equal(await page.$eval(grouped, element => element.textContent), 'By status');
    await page.waitForSelector(planIcon);
    await page.waitForSelector(integrationIcon);
    assert.deepEqual(await page.$$eval('[role="heading"]', headers => headers.map(header => header.textContent)),
      ['Needs action', 'In progress', 'Reply ready', 'Other']);
    const runningColors = await page.evaluate(() => {
      const heading = [...document.querySelectorAll('[role="heading"]')].find(element => element.textContent === 'In progress');
      const row = document.querySelector('[aria-label$=", Working"]');
      return [getComputedStyle(heading.parentElement).borderLeftColor, getComputedStyle(row).borderLeftColor];
    });
    assert.equal(runningColors[0], runningColors[1], `${name} running group and session use the same blue`);
    assert.equal(await page.$('[aria-label="New workspace in Horizon API"]'), null, `${name} status groups have no project actions`);
    assert.ok(await page.$('[aria-label^="Approve the navigation plan,"]'), `${name} status sessions remain visible`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name} status control overflows`);
    await page.click('[aria-label="Find a session"]');
    await page.type('[aria-label="Search sessions"]', 'Approve the navigation');
    await page.waitForFunction(() => document.querySelectorAll('[role="heading"]').length === 1);
    assert.equal(await page.$eval('[role="heading"]', header => header.textContent), 'Needs action');
    await page.click('[aria-label="Close search"]');
    await page.waitForFunction(() => document.querySelectorAll('[role="heading"]').length === 4);
    await page.click('[role="radio"][aria-label="By workspace"]');
    await page.waitForSelector('[aria-label="Atlas Studio, 4 sessions"]');
    assert.equal(await page.$(planIcon), null, `${name} workspace grouping hides inline icons again`);
    await page.evaluate(() => { globalThis.__pulseDemo.failPreferences = true; });
    await page.click('[role="radio"][aria-label="None"]');
    await page.waitForFunction(() => document.body.innerText.includes('Could not save or load the display preferences.'));
    assert.equal(await page.$eval('[role="radio"][aria-checked="true"]', element => element.textContent), 'By workspace', `${name} failed save restores the persisted mode`);
    await page.evaluate(() => { globalThis.__pulseDemo.failPreferences = false; });
    await page.click('[role="tab"][aria-label="All"]');
    await page.waitForSelector('[role="tab"][aria-label="All"][aria-selected="true"]');
    // Keep non-default filter and grouping while unmounting and reopening the whole inbox.
    await page.click('[role="radio"][aria-label="By status"]');
    await page.waitForFunction(() => document.querySelector('[role="radio"][aria-label="By status"]')?.getAttribute('aria-checked') === 'true');
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
    assert.equal(await page.$eval('[role="radio"][aria-checked="true"]', element => element.textContent), 'By status', `${name} reopening restores the saved grouping`);
    assert.equal(await page.$('[aria-label="Atlas Studio, 4 sessions"]'), null, `${name} restored status mode has no project headers`);
    assert.equal(await page.$eval('[role="tab"][aria-selected="true"]', element => element.getAttribute('aria-label')), 'All', `${name} reopening restores All`);

    assert.ok(reopened.text.includes('Labels are consistent on desktop and mobile.'), `${name} immediate cached previews`);
    assert.equal(reopened.text.includes('Loading…'), false, `${name} no repeat loading screen`);
    await page.click('[aria-label="Cards"]');
    const cardSelector = '[role="button"]';
    const cardByPreview = async text => page.evaluateHandle(text =>
      [...document.querySelectorAll('[role="button"]')].find(button => button.innerText.includes(text)), text);
    const statusCard = await cardByPreview('Labels are consistent on desktop and mobile.');
    await statusCard.asElement().click();
    assert.equal(await page.evaluate(() => globalThis.__pulseDemo.opened.at(-1).agentId), 'labels');
    await page.click('[role="radio"][aria-label="None"]');
    const cardColumns = await page.$$eval(cardSelector, buttons => {
      const cards = buttons.filter(button => button.innerText.includes('Atlas Studio') && button.innerText.includes('\n'));
      return new Set(cards.map(card => card.getBoundingClientRect().left)).size;
    });
    assert.equal(cardColumns > 1, name === 'desktop', `${name} card columns`);
    await page.click('[role="radio"][aria-label="By workspace"]');
    await page.evaluate(() => globalThis.__pulseDemo.setVisible(false));
    await page.waitForFunction(() => !document.querySelector('[aria-label="Cards"]'));
    await page.evaluate(() => globalThis.__pulseDemo.setVisible(true));
    await page.waitForSelector('[aria-label="Cards"][aria-pressed="true"]');

    await page.goto(origin + '/switcher', { waitUntil: 'networkidle0' });
    const openSwitcher = () => page.click('button');
    const shortcut = async () => {
      await page.keyboard.down('Control');
      await page.keyboard.down('Shift');
      await page.keyboard.press('Space');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Control');
      const search = '[aria-label="Search sessions"]';
      await page.waitForSelector(search);
      assert.equal(await page.$eval(search, input => document.activeElement === input), name === 'desktop');
      if (name === 'mobile') await page.click(search);
    };
    await shortcut();
    await page.keyboard.type('Horizon');
    await page.waitForFunction(() => document.body.innerText.includes('Check webhook retry handling'));
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.body.innerText.startsWith('webhooks\n'));
    await shortcut();
    await page.keyboard.type('Approve the navigation plan');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.body.innerText.startsWith('plan\n'));
    // Reset demo visit history before exercising first-launch suggestions.
    await page.goto(origin + '/switcher', { waitUntil: 'networkidle0' });
    await openSwitcher();
    await page.waitForFunction(() => document.body.innerText.includes('Labels are consistent on desktop and mobile.'));
    assert.equal(await page.$$eval('[aria-label="Search sessions"]', inputs => inputs.length), 1);
    for (const search of ['', 'Horizon']) {
      if (search) await page.type('[aria-label="Search sessions"]', search);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.body.innerText.startsWith('plan\n') && !document.querySelector('[aria-label="Search sessions"]'));
      await openSwitcher();
      await page.waitForFunction(() => document.body.innerText.includes('Labels are consistent on desktop and mobile.'));
    }
    const projectCard = await cardByPreview('Labels are consistent on desktop and mobile.');
    assert.ok(await projectCard.evaluate(el => el.innerText.split('\n').includes('A')), 'project initial on a switcher card');
    const initial = await page.evaluate(() => document.body.innerText);
    assert.equal(initial.includes('Quick switch'), true);
    assert.ok(initial.includes('Investigate an integration failure'), 'suggest an actionable session across projects without visits');
    const runningCard = await cardByPreview('Updating responsive states');
    const runningStyle = await runningCard.evaluate(el => [getComputedStyle(el).borderLeftColor, getComputedStyle(el).backgroundColor]);
    assert.equal(runningStyle[0], 'rgb(96, 165, 250)');
    assert.notEqual(runningStyle[1], await projectCard.evaluate(el => getComputedStyle(el).backgroundColor));
    assert.equal(initial.includes('Approve the navigation plan'), false);
    assert.equal(initial.split('\n').filter(line => line === 'Review').length, 2);
    const originalOrder = await page.$$eval('[role="button"]', buttons => buttons.map(b => b.innerText));
    await page.evaluate(() => globalThis.__pulseDemo.updateReply('checkout', { text: 'Revised checkout preview' }));
    await page.waitForFunction(() => document.body.innerText.includes('Revised checkout preview'));
    const updatedOrder = await page.$$eval('[role="button"]', buttons => buttons.map(b => b.innerText));
    assert.deepEqual(updatedOrder, originalOrder.map(text => text.replace('Updating responsive states and keyboard navigation.', 'Revised checkout preview')));
    await (await cardByPreview('Labels are consistent on desktop and mobile.')).asElement().click();
    await page.waitForFunction(() => document.body.innerText.startsWith('labels\n'));
    await openSwitcher();
    await page.type('[aria-label="Search sessions"]', 'Horizon');
    await page.waitForFunction(() => document.body.innerText.includes('Check webhook retry handling'));
    await (await cardByPreview('Checking retry timing')).asElement().click();
    await page.waitForFunction(() => document.body.innerText.startsWith('webhooks\n'));
    await openSwitcher();
    await page.waitForFunction(() => document.body.innerText.includes('Quick switch') && document.body.innerText.includes('Labels are consistent on desktop and mobile.'));
    await (await cardByPreview('Labels are consistent on desktop and mobile.')).asElement().click();
    await page.waitForFunction(() => document.body.innerText.startsWith('labels\n'));
    await openSwitcher();
    await (await cardByPreview('All sessions')).asElement().click();
    await page.waitForSelector('[aria-label="Cards"]');
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
