const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra');
const os = require('os');
const robotjs = require('robotjs');

// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin())

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    userDataDir: `${os.homedir()}/.config/google-chrome`,
    defaultViewport: null,
    // args: [`--window-size=800,800`],
  });

  const [youtube] = await browser.pages();
  youtube.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
    waitUntil: 'networkidle2'
  });

  const discord = await browser.newPage();
  await discord.goto('https://discord.com/app', {
    waitUntil: 'networkidle2',
  });
  await discord.bringToFront();

  const waitAndClick = async (selector) => {
    try {
      await discord.waitForSelector(selector)
      await discord.waitForNetworkIdle({ idleTime: 1000 });
      await discord.click(selector)
    } catch (e) {}
  }

  // Login
  try {
    await discord.type('input[name=email]', process.env.DISCORD_EMAIL);
    await discord.type('input[name=password]', process.env.DISCORD_PASSWORD);
    await discord.click('button[type=submit]');
  } catch (e) {}

  // CLOSE POPUP
  await discord.waitForSelector(`div[data-dnd-name="${process.env.DISCORD_CHANNEL}"]`);
  await discord.waitForTimeout(1000);
  try {
    const [okayButton] = await discord.$x(`//div[contains(text(), 'Okay')]`);
    await okayButton.click();
  } catch(e) {}

  // Open channel
  await waitAndClick(`div[data-dnd-name="${process.env.DISCORD_CHANNEL}"]`);

  // Join voice channel
  const channelNames = await discord.$x(`//div[contains(@class, 'channelName') and contains(text(), '${process.env.DISCORD_DEFAULT_VOICE_CHANNEL}')]`);
  if (channelNames.length) {
    await channelNames[0].click();
  } else {
    console.log(`Couldn't find channel`);
  }

  // Share screen
  await waitAndClick(`button[aria-label="Share Your Screen"]`);

  // Share youtube
  robotjs.keyTap('tab');
  robotjs.keyTap('right');
  robotjs.keyTap('right');
  robotjs.keyTap('tab');
  robotjs.keyTap('down');
  robotjs.keyTap('down');
  robotjs.keyTap('tab');
  robotjs.keyTap('tab');
  robotjs.keyTap('tab');
  robotjs.keyTap('enter');

  await youtube.waitForSelector('.ytp-fullscreen-button.ytp-button');
  await youtube.keyboard.press('f');

  // await browser.close();
})();