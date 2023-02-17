import knownMemes from '../../config/memes.json';

export default function isMeme(text: string) {
  return knownMemes.find((m) =>
    m.startsWith('!')
      ? text.toLowerCase().startsWith(m.toLowerCase())
      : text.toLowerCase().includes(m.toLowerCase())
  );
}
