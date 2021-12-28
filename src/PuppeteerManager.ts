import puppeteer from 'puppeteer';
// const puppeteer = require('puppeteer-extra');
import robotjs from 'robotjs';

// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin())

export default class PuppeteerManager {
  browser: puppeteer.Browser = null;
  discord: puppeteer.Page = null;
  youtube: puppeteer.Page = null;

  waitAndClick = async (selector: string) => {
    if (!this.discord) {
      return;
    }

    try {
      await this.discord.waitForSelector(selector);
      await this.discord.waitForNetworkIdle({ idleTime: 1000 });
      await this.discord.click(selector);
    } catch (e) {
      //
    }
  };

  initialize = async () => {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        executablePath: process.env.PUPPETEER_EXEC_PATH || null,
        userDataDir: `./google-chrome`,
        defaultViewport: null,
        args: ['--no-sandbox'],
      });
    }

    await this.setupDiscord();
  };

  showDiscord = async () => {
    await this.discord?.bringToFront();
  };

  showYoutube = async () => {
    await this.youtube?.bringToFront();
  };

  setupDiscord = async () => {
    if (this.discord) {
      return;
    }

    [this.discord] = (await this.browser?.pages()) || [];
    if (!this.discord) {
      return;
    }
    await this.discord.goto('https://discord.com/app', {
      waitUntil: 'networkidle2',
    });
    await this.showDiscord();

    // Login
    try {
      await this.discord.type('input[name=email]', process.env.DISCORD_EMAIL);
      await this.discord.type(
        'input[name=password]',
        process.env.DISCORD_PASSWORD
      );
      await this.discord.click('button[type=submit]');
    } catch (e) {
      //
    }

    // CLOSE POPUP
    await this.discord.waitForSelector(
      `div[data-dnd-name="${process.env.DISCORD_CHANNEL}"]`
    );
    await this.discord.waitForTimeout(1000);
    try {
      const [okayButton] = await this.discord.$x(
        `//div[contains(text(), 'Okay')]`
      );
      await okayButton.click();
    } catch (e) {
      //
    }

    // Open channel
    await this.waitAndClick(
      `div[data-dnd-name="${process.env.DISCORD_CHANNEL}"]`
    );

    // Join voice channel
    const channelNames = await this.discord.$x(
      `//div[contains(@class, 'channelName') and contains(text(), '${process.env.DISCORD_DEFAULT_VOICE_CHANNEL}')]`
    );
    if (channelNames.length) {
      await channelNames[0].click();
    } else {
      console.log(`Couldn't find channel`);
    }
  };

  shareYoutube = async () => {
    await this.showDiscord();
    await this.waitAndClick(`button[aria-label="Share Your Screen"]`);

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

    await this.youtube?.waitForSelector('.ytp-fullscreen-button.ytp-button');
    await this.youtube?.keyboard.press('f');
  };

  resumeVideo = async () => {
    if (!this.youtube) {
      return;
    }

    await this.youtube.keyboard.press('Space')
  };

  playVideo = async (url: string) => {
    if (this.youtube || !this.browser) {
      return;
    }

    this.youtube = await this.browser?.newPage();
    await this.youtube.goto(url, {
      waitUntil: 'networkidle2',
    });

    await this.shareYoutube();
  };

  pauseVideo = async () => {
    if (!this.youtube) {
      return;
    }

    await this.youtube.keyboard.press('Space');
  }

  stopVideo = async () => {
    if (!this.youtube) {
      return;
    }

    await this.youtube.close();
    this.youtube = null;
  }

  // TODO Implement 'goback'
  // TODO Implement 'goforward'
}
