import { ApiClient } from '@twurple/api';
import { AuthProvider, StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import _ from 'lodash';
import ora from 'ora';
import pc from 'picocolors';
import pluralize from 'pluralize';

const { map } = _;
let apiClient: ApiClient;

import { Channel } from './lib/types.js';

import { setupChatHandlers } from './handlers.js';
import { saveEvents } from './lib/lib.js';
import { saveUpdatedChannels } from './stores/db.js';

export function authenticateTwitch(): AuthProvider {
  const clientId = process.env.TWITCH_CLIENT_ID as string;
  const accessToken = process.env.TWITCH_ACCESS_TOKEN as string;

  if (!clientId || !accessToken) {
    console.log(`${pc.red('Error')}: Missing Twitch credentials in environment. Exiting.`);

    process.exit(1);
  }

  const authProvider = new StaticAuthProvider(clientId, accessToken);

  return authProvider;
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

export async function updateChannelInfo(authProvider: AuthProvider, channels: Channel[]) {
  let spinner;

  if (!apiClient) apiClient = new ApiClient({ authProvider });

  try {
    spinner = ora(`Updating info for all channels via Twitch API`).start();

    // TODO: paginate through list if more than 100 channels
    const results = await apiClient.users.getUsersByIds(map(channels, 'twitchId'));
    await saveUpdatedChannels(results);
    spinner.succeed(
      `${pluralize('channel', channels.length, true)} checked for updates via Twitch API`
    );
  } catch (error: any) {
    spinner?.fail(`Failed to update channel info (${pc.dim(error.message as string)})`);
  }
}

export async function showOnlineChannels(authProvider: AuthProvider, channels: Channel[]) {
  let spinner;

  try {
    spinner = ora(`Looking up online status...`).start();
    if (!apiClient) apiClient = new ApiClient({ authProvider });

    // TODO: paginate through list if more than 100 channels
    const results = await apiClient.streams.getStreamsByUserIds(map(channels, 'twitchId'));
    spinner.succeed(
      `${pluralize('channel', results.length, true)} online: ${map(results, 'userDisplayName').join(
        ', '
      )}')}}`
    );
  } catch (error: any) {
    spinner?.fail(`Failed to get online channel status (${pc.dim(error.message as string)})`);
  }
}
