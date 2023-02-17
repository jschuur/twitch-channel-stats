import { ChatEvent } from '../lib/types';

import { debug } from '../lib/util';

export default async function saveToTinyBird(events: ChatEvent[]) {
  const headers = {
    Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
  };
  const url = process.env.TINYBIRD_API_URL || 'https://api.tinybird.co/';

  const timestamp = new Date().toISOString();
  const timestampedEvents = events.map((event) => ({ ...event, timestamp }));

  const rawResponse = await fetch(`${url}v0/events?name=${global.options.datasource}`, {
    method: 'POST',
    body: timestampedEvents.map((e) => JSON.stringify(e)).join('\n'),
    headers: headers,
  });

  const response = await rawResponse.json();

  debug(`Tinybird response: ${response}`);
}
