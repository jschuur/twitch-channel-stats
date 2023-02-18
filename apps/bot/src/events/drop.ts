export function isDrop(text: string) {
  return text.startsWith('!drop');
}

export function isLanded(text: string) {
  const landedRegexp = new RegExp(/^(\w+) landed for (\d+(\.\d+))!$/);
  const match = text.match(landedRegexp);

  if (match) return { username: match[1], score: Number(match[2]) };
}
