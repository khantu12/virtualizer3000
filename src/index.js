const dotenv = require('dotenv');
const puppeteer = require('puppeteer');

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto('https://discord.com/app', {
    waitUntil: 'load',
  });

  await page.type('input[name=email]', process.env.DISCORD_EMAIL);
  await page.type('input[name=password]', process.env.DISCORD_PASSWORD);
  await page.click('button[type=submit]');



  // await browser.close();
})();