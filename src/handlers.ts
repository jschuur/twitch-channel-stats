import { ChatClient } from '@twurple/chat';
// import { ApiClient } from '@twurple/api';
import { boolean } from 'boolean';
import pc from 'picocolors';

import isCommand from './events/command';
import { isDrop, isLanded } from './events/drop';
import isMeme from './events/meme';
import BatchProcess, { BatchCallback } from './lib/batch';
import { saveEvents } from './lib/lib';
import { log } from './lib/util';

// batch queue will save events every 10 seconds or when it reaches 50 events
const batch = new BatchProcess(saveEvents as BatchCallback, {
  maxSize: 50,
  maxTime: 10000,
});

export function setupChatHandlers(client: ChatClient) {
  client.onMessage(onMessage);
  client.onPart(onPart);
  client.onJoin(onJoin);
}

// export function setupEventSubHandlers(apiClient: ApiClient) {
// }

export async function onJoin(channel: string, username: string) {
  log('join', channel, `${username} joined ${channel}`);
}

export async function onPart(channel: string, username: string) {
  log('part', channel, `${username} left ${channel}`);
  saveEvents({ channel, username, type: 'part' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onMessage(channel: string, username: string, text: string, msg?: any) {
  if (isDrop(text)) {
    log('drop', channel, `${pc.green('Drop')} by ${username}: ${text}`);

    return saveEvents({ type: 'drop', channel, text, username });
  }

  const meme = isMeme(text);
  if (meme) {
    log('meme', channel, `${pc.magenta('Meme')} by ${username} ${text}`);

    return saveEvents({ type: 'meme', channel, text, username });
  }

  const cmd = isCommand(text);
  if (cmd) {
    const { command, args } = cmd;
    log('command', channel, `${pc.magenta('Command')} by ${username} ${text}`);

    return saveEvents({ type: 'command', channel, text, context: { command, commandArgs: args } });
  }

  const landed = isLanded(text);
  if (landed) {
    const { username, score } = landed;

    log('landed', channel, `${pc.magenta('Drop')} land by ${username} for ${score}`);

    return await saveEvents({ type: 'landed', channel, text, context: { username, score } });
  }

  // treat it as a regular chat message
  if (boolean(process.env.SAVE_MSG_LENGTHS)) {
    batch.add({ type: 'msg', channel, username, context: { msgLength: text?.length || 0 } });
  }
  log('msg', channel, `${username}: ${text}`);
}
