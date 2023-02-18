import knownMemes from '../config/memes.js';

export default function isMeme(text: string) {
  return knownMemes.find((m) =>
    m.startsWith('!')
      ? text.toLowerCase().startsWith(m.toLowerCase())
      : text.toLowerCase().includes(m.toLowerCase())
  );
}
