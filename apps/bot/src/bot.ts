// import { ApiClient } from '@twurple/api';
// import { EventSubWsListener } from '@twurple/eventsub-ws';
import 'dotenv/config';
import minimost from 'minimost';

import { startupMessages, validateOptions } from './lib/lib.js';
import { CliOptions } from './lib/types.js';
import { authenticateTwitch, connectChat } from './twitch.js';
declare global {
  // eslint-disable-next-line no-var
  var options: CliOptions;
}

const options = minimost(process.argv.slice(2), {
  string: ['channels', 'datasource'],
  alias: { c: 'channels', d: 'datasource' },
  default: {
    channels: process.env.DEFAULT_TWITCH_CHANNELS,
    datasource: process.env.TINYBIRD_DATASOURCE,
  },
}).flags as CliOptions;

(async () => {
  validateOptions(options);
  startupMessages();

  global.options = options;

  const authProvider = authenticateTwitch();
  await connectChat(authProvider, options.channels);
})();
