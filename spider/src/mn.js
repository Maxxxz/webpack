const puppeteer = require('puppeteer');
const srcToImg = require('./helper/srcToImg');
const { mnPath } = require('./config/default');
(async () => {
  const broswer = await puppeteer.launch();
  const page = await broswer.newPage();

  await page.goto('https://image.baidu.com/');
  console.log('go to baidu.com');

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  console.log('reset viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('狗');
  await page.click('.s_search');

  console.log('go to search list');

  page.on('load', async () => {
    console.log('page loading done, start fetch');
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src);
    });
    console.log('srcs length', srcs.length);
    srcs.forEach(async src => {
      await page.waitFor(200);
      await srcToImg(src, mnPath);
    });

    await page.close();
  });
})();
