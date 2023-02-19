import { boolean } from 'boolean';
import _ from 'lodash';
import pc from 'picocolors';
const { pick } = _;

import { savedContextFields } from '../config/config.js';
import { ChatEvents, CliOptions } from './types.js';

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

export function validateOptions(options: CliOptions) {
  if (!boolean(process.env.DISABLE_EVENT_SAVING)) {
    if (!options.datasource) {
      console.error('No TinyBird datasource specified');

      process.exit(1);
    }
  }
}

export function startupMessages() {
  const envVars = [
    ['TINYBIRD_API_KEY', 'TinyBird API key', 8],
    ['TWITCH_CLIENT_ID', 'Twitch Client ID', 8],
    ['DATABASE_URL', 'Database URL', 25],
  ] as const;

  const labelLength = Math.max(...envVars.map(([, label]) => label.length));

  // partially preview some key env vars
  envVars.forEach(([envVar, label, sliceLength]) => {
    console.log(
      `${label.padEnd(labelLength)} ${
        process.env[envVar]
          ? `${pc.green(process.env[envVar]?.slice(0, sliceLength as number))}...`
          : pc.red('Not set')
      }`
    );
  });

  if (boolean(process.env.DISABLE_EVENT_SAVING))
    console.log(`\n${pc.yellow('Notice')}: Event saving is disabled based on DISABLE_EVENT_SAVING`);

  console.log();
}
