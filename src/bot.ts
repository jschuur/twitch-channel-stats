// import { ApiClient } from '@twurple/api';
// import { EventSubWsListener } from '@twurple/eventsub-ws';
import 'dotenv/config';
import pc from 'picocolors';

import { startupMessages } from './lib/lib.js';
import { errorMessage } from './lib/util.js';
import { getActiveChannels } from './stores/db.js';
import { authenticateTwitch, connectChat } from './twitch.js';

(async () => {
  try {
    startupMessages();

    const channels = await getActiveChannels();
    const authProvider = authenticateTwitch();
    await connectChat(authProvider, channels);
  } catch (error) {
    console.error(`${pc.red('Error')}: ${errorMessage(error)}`);
  }
})();
