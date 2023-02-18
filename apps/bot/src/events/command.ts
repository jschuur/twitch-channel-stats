import { knownCommands } from '../config/config.js';

export default function isCommand(text: string) {
  const [firstWord, ...rest] = text.split(' ');
  const command = knownCommands.find((c) => c === firstWord);

  if (command) return { command, args: rest.join(' ') };
}
