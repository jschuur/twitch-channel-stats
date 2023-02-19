import { ChatClient } from '@twurple/chat';
// import { ApiClient } from '@twurple/api';
import { boolean } from 'boolean';
import pc from 'picocolors';
import { Channel } from './lib/types.js';

import isCommand from './events/command.js';
import { isDrop, isLanded } from './events/drop.js';
import isMeme from './events/meme.js';
import BatchProcess, { BatchCallback } from './lib/batch.js';
import { saveEvents } from './lib/lib.js';
import { log } from './lib/util.js';
// batch queue will save events every 10 seconds or when it reaches 50 events
const batch = new BatchProcess(saveEvents as BatchCallback, {
  maxSize: 50,
  maxTime: 10000,
});

let connectedChannels: Channel[];

const channelMatch = (channelname: string) =>
  connectedChannels?.find((c) => c.channelname.toLowerCase() === channelname.toLowerCase());

export function setupChatHandlers(client: ChatClient, channels: Channel[]) {
  client.onMessage(onMessage);
  client.onPart(onPart);
  client.onJoin(onJoin);

  connectedChannels = channels;
}

// export function setupEventSubHandlers(apiClient: ApiClient) {
// }

export async function onJoin(channelname: string, username: string) {
  channelname = channelname.replace(/^#/, '');

  log('join', channelname, `${username} joined ${channelname}`);
}

export async function onPart(channelname: string, username: string) {
  channelname = channelname.replace(/^#/, '');

  log('part', channelname, `${username} left ${channelname}`);
  saveEvents({ channel: channelname, username, type: 'part' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onMessage(channelname: string, username: string, text: string, msg?: any) {
  channelname = channelname.replace(/^#/, '');
  const channel = channelMatch(channelname);

  if (!channel) {
    console.log(`${pc.yellow('Warning')}: Unknown channel in event: ${channelname}`);

    return;
  }

  if (isDrop(text)) {
    log('drop', channelname, `${pc.green('Drop')} by ${username}: ${text}`);

    return saveEvents({ type: 'drop', channel: channelname, text, username });
  }

  const meme = isMeme(text, channel);
  if (meme) {
    log('meme', channelname, `${pc.magenta('Meme')} by ${username} ${text}`);

    return saveEvents({ type: 'meme', channel: channelname, text, username });
  }

  const cmd = isCommand(text);
  if (cmd) {
    const { command, args } = cmd;
    log('command', channelname, `${pc.magenta('Command')} by ${username} ${text}`);

    return saveEvents({
      type: 'command',
      channel: channelname,
      text,
      context: { command, commandArgs: args },
    });
  }

  const landed = isLanded(text);
  if (landed) {
    const { username, score } = landed;

    log('landed', channelname, `${pc.magenta('Drop')} land by ${username} for ${score}`);

    return await saveEvents({
      type: 'landed',
      channel: channelname,
      text,
      context: { username, score },
    });
  }

  // treat it as a regular chat message
  if (boolean(process.env.SAVE_MSG_LENGTHS)) {
    batch.add({
      type: 'msg',
      channel: channelname,
      username,
      context: { msgLength: text?.length || 0 },
    });
  }
  log('msg', channelname, `${username}: ${text}`);
}
