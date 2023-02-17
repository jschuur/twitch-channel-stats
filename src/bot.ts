// import { ApiClient } from '@twurple/api';
// import { EventSubWsListener } from '@twurple/eventsub-ws';
import { boolean } from 'boolean';
import 'dotenv/config';
import minimost from 'minimost';

import { CliOptions } from './lib/types';

import { validateOptions } from './lib/lib';
import { authenticateTwitch, connectChat } from './twitch';

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

  if (boolean(process.env.DISABLE_EVENT_SAVING))
    console.log(`{pc.yellow('Notice')}: Event saving is disabled based on DISABLE_EVENT_SAVING`);

  global.options = options;

  const authProvider = authenticateTwitch();
  await connectChat(authProvider, options.channels);
})();
