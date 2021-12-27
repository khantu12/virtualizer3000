import dotenv from 'dotenv';
dotenv.config();

import DiscordBotManager from './DiscordBotManager';
import PuppeteerManager from './PuppeteerManager';

const pm = new PuppeteerManager();
const dbm = new DiscordBotManager();

(async () => {
  await pm.initialize();
  // await pm.playVideo('https://www.youtube.com/watch?v=t1kBjCEJVto');

  dbm.initialize();
  dbm.onPlay = (url: string) => {
    pm.playVideo(url);
  }
  dbm.onResume = () => {
    pm.resumeVideo();
  }
  dbm.onPause = () => {
    pm.pauseVideo();
  }
  dbm.onStop = () => {
    pm.stopVideo();
  }
  // TODO Implement 'goback'
  // TODO Implement 'goforward'
  dbm.listen();
})();

