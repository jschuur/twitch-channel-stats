import { boolean } from 'boolean';
import pc from 'picocolors';

import { ChatEventType } from './types.js';
export function log(type: ChatEventType, channel: string, msg: string) {
  const date = new Date();
  const time = date.toLocaleTimeString('en-GB');

  const body = type === 'msg' ? pc.dim(msg) : msg;

  console.log(`[${pc.yellow(time)} ${type}#${channel}]: ${body}`);
}

export const debug = (msg: string) => boolean(process.env.DEBUG) && console.log(pc.yellow(msg));

// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return String(error);
}
