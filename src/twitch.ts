import { Channel } from './lib/types.js';
import { RefreshingAuthProvider, StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
// import { ApiClient } from '@twurple/api';
// import { EventSubWsListener } from '@twurple/eventsub-ws';
import { AuthProvider } from '@twurple/auth';
import _ from 'lodash';
import ora from 'ora';
import pc from 'picocolors';

const { map } = _;

import { setupChatHandlers } from './handlers.js';
import { saveEvents } from './lib/lib.js';

export function authenticateTwitch(): AuthProvider {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const accessToken = process.env.TWITCH_ACCESS_TOKEN;
  const refreshToken = process.env.TWITCH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !accessToken || !refreshToken) {
    console.log(`${pc.red('Error')}: Missing Twitch credentials in environment. Exiting.`);

    process.exit(1);
  }
  if (refreshToken)
    return new RefreshingAuthProvider(
      { clientId, clientSecret },
      { accessToken, refreshToken, expiresIn: 0, obtainmentTimestamp: 0 }
    );
  else return new StaticAuthProvider(clientId, accessToken);
}

export async function connectChat(
  authProvider: AuthProvider,
  channels: Channel[]
): Promise<ChatClient> {
  let spinner;
  let chatClient: ChatClient;
  const channelNames = map(channels, 'channelname');
  const channelList = channelNames.join(',');
  console.log(channelNames);

  try {
    spinner = ora(`Connecting to chat (${pc.cyan(channelList)})`).start();

    chatClient = new ChatClient({ authProvider, channels: channelNames });
    setupChatHandlers(chatClient, channels);
    await chatClient.connect();

    spinner.succeed(`Connected to chat (${pc.cyan(channelList)})`);
    console.log();

    for (const channel of channels)
      await saveEvents({
        type: 'channel_join',
        channel: channel?.displayName || channel.channelname,
      });
  } catch (error: any) {
    spinner?.fail(`Failed to connect to chat (${pc.dim(error.message as string)})`);

    process.exit(1);
  }

  return chatClient;
}

// export async function connectEventSub() {
// }
