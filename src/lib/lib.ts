import { boolean } from 'boolean';
import _ from 'lodash';
const { pick } = _;

import { ChatEvents, CliOptions } from './types';

import { savedContextFields } from '../config';

import saveToDB from '../stores/db';
import saveToTinyBird from '../stores/tinybird';

export async function saveEvents(payload: ChatEvents) {
  if (boolean(process.env.DISABLE_EVENT_SAVING)) return;

  const events = Array.isArray(payload) ? payload : [payload];

  events.forEach((event) => {
    event.context = trimContext(event.context);
  });

  // save to data sources if defined
  if (process.env.TINYBIRD_API_KEY) await saveToTinyBird(events);
  if (process.env.DATABASE_URL) await saveToDB(events);
}

// we don't want to save all the Twitch context, just the fields we care about
export const trimContext = (context: Record<string, any> | undefined) => {
  return pick(context, savedContextFields);
};

export function validateOptions(options: CliOptions) {
  if (!options.channels) {
    console.error('No Twitch channels specified');

    process.exit(1);
  }

  if (!options.datasource) {
    console.error('No TinyBird datasource specified');

    process.exit(1);
  }
}
