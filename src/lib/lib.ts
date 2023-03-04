import { boolean } from 'boolean';
import _ from 'lodash';
import pc from 'picocolors';
import pluralize from 'pluralize';
const { pick } = _;

import { savedContextFields } from '../config/config.js';
import { getActiveChannels } from '../stores/db.js';
import { Channel, ChatEvents } from './types.js';

import saveToTinyBird from '../stores/tinybird.js';

// wrapper to saver channel events to Tinybird
export function saveEvents(payload: ChatEvents) {
  if (boolean(process.env.DISABLE_EVENT_SAVING) || !process.env.TINYBIRD_API_KEY) return;

  const events = Array.isArray(payload) ? payload : [payload];

  events.forEach((event) => {
    event.context = trimContext(event.context);
  });

  return saveToTinyBird(events);
}

// we don't want to save all the Twitch context, just the fields we care about
export const trimContext = (context: Record<string, any> | undefined) => {
  return pick(context, savedContextFields);
};

export function startupMessages(channels: Channel[]) {
  const envVars = [
    ['TINYBIRD_API_KEY', 'TinyBird API key', 8],
    ['TWITCH_CLIENT_ID', 'Twitch Client ID', 8],
    ['DATABASE_URL', 'Database URL', 25],
  ] as const;

  const labelLength = Math.max(...envVars.map(([, label]) => label.length));

  // partially preview some key env vars
  envVars.forEach(([envVar, label, sliceLength]) => {
    if (!process.env[envVar]) throw new Error(`${envVar} undefined. Exiting.`);

    console.log(
      `${label.padEnd(labelLength)} ${`${pc.green(
        process.env[envVar]?.slice(0, sliceLength as number)
      )}...`}`
    );
  });

  const chatActiveCount = channels.filter((channel) => channel.activeChat)?.length || 0;
  const eventSubActiveCount = channels.filter((channel) => channel.activeEvents)?.length || 0;

  console.log(
    `\nUsing ${pluralize('channel', channels.length, true)} (${pc.cyan(
      chatActiveCount
    )} activeChat, ${pc.cyan(eventSubActiveCount)} activeEvents)`
  );

  if (boolean(process.env.DISABLE_EVENT_SAVING))
    console.log(`\n${pc.yellow('Notice')}: Event saving is disabled based on DISABLE_EVENT_SAVING`);

  console.log();
}

export async function getChannels() {
  const channels = await getActiveChannels();

  if (!channels.length) {
    console.log(`${pc.red('Error')}: No channels to connect to. Exiting.`);

    process.exit(0);
  }

  return channels;
}
