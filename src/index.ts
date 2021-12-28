import dotenv from 'dotenv';
dotenv.config();

import DiscordBotManager from './DiscordBotManager';
import PuppeteerManager from './PuppeteerManager';

const pm = new PuppeteerManager();
const dbm = new DiscordBotManager();

(async () => {
  await pm.initialize();

  dbm.initialize();

  dbm.onPlay = pm.playVideo;
  dbm.onResume = pm.resumeVideo;
  dbm.onPause = pm.pauseVideo;
  dbm.onStop = pm.stopVideo;  
  dbm.onBack = pm.goBack;
  dbm.onForward = pm.goForward;

  dbm.listen();
})();

