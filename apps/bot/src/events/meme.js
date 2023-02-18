import knownMemes from '../config/memes.js';
export default function isMeme(text, channel) {
    // memes are channel specific
    const channelMatch = Object.keys(knownMemes)?.find((c) => c.toLowerCase() === channel.toLowerCase());
    if (!channelMatch)
        return false;
    // memes can start with an exclamation mark or be anywhere in the message
    return knownMemes[channelMatch].find((m) => m.startsWith('!')
        ? text.toLowerCase().startsWith(m.toLowerCase())
        : text.toLowerCase().includes(m.toLowerCase()));
}
