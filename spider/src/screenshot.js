const puppeteer = require('puppeteer');
const { screenshotPath } = require('./config/default');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
  await page.screenshot({
    path: `${screenshotPath}/${Date.now()}.png`
  });
  await browser.close();
})();
