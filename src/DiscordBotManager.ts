import { Client, Intents } from 'discord.js';

export default class DiscordBotManager {
  client: Client;
  onPlay: (url: string) => void;
  onResume: () => void;
  onStop: () => void;
  onPause: () => void;
  onBack: () => void;
  onForward: () => void;

  initialize = () => {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    this.client.once('ready', () => {
      console.log('Ready!');
    });
  };

  listen = () => {
    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) {
        return;
      }

      const command = message.content.split(" ")[0].toString();

      if (command[0] !== process.env.DISCORD_BOT_PREFIX) {
        return;
      }

      const commandsList = {
        '=play': this.onPlay,
        '=pl': this.onPlay,

        '=resume': this.onResume,
        '=r': this.onResume,

        '=pause': this.onPause,
        '=pa': this.onPause,

        '=stop': this.onStop,
        '=s': this.onStop,

        '=goback': this.onBack,
        '=gb': this.onBack,
        '=skipback': this.onBack,
        '=sb': this.onBack,

        '=goforward': this.onForward,
        '=gf': this.onForward,
        '=skipfroward': this.onForward,
        '=sf': this.onForward,
      };

      const func = commandsList[command] || null;

      if (func) {
        if (func === this.onPlay) {
          func(message.content.split(' ').slice(1).toString());
        } else {
          func();
        }
      } else {
        message.channel.send('You need to enter a valid command!');
      }
    });

    this.client.login(process.env.DISCORD_BOT_TOKEN);
  };
}
