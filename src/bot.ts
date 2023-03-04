import 'dotenv/config';
import minimost from 'minimost';
import pc from 'picocolors';

import { startupMessages } from './lib/lib.js';
import { Channel, CliOptions } from './lib/types.js';
import { errorMessage } from './lib/util.js';
import { getChannels } from './stores/db.js';
import {
  authenticateTwitch,
  connectChat,
  showOnlineChannels,
  updateChannelInfo,
} from './twitch.js';

const options = minimost(process.argv.slice(2), {
  boolean: ['update-only'],
  alias: {
    u: 'update-only',
  },
}).flags as CliOptions;

(async () => {
  try {
    const channels = await getChannels();

    startupMessages(channels);

    const authProvider = authenticateTwitch();

    await updateChannelInfo(authProvider, channels);
    await showOnlineChannels(authProvider, channels);

    // -u exits here
    if (options.updateOnly) process.exit(0);

    // connect to just active channels
    await connectChat(
      authProvider,
      channels.filter((c: Channel) => c.activeChat)
    );
  } catch (error) {
    console.error(`${pc.red('Error')}: ${errorMessage(error)}`);
  }
})();
