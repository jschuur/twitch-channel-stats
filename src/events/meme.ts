import { Channel } from '../lib/types.js';

export default function isMeme(text: string, channel: Channel) {
  // memes can start with an exclamation mark or be anywhere in the message
  return channel.config?.memes?.find((m: string) =>
    m.startsWith('!')
      ? text.toLowerCase().startsWith(m.toLowerCase())
      : text.toLowerCase().includes(m.toLowerCase())
  );
}
