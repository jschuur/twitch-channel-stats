import { boolean } from 'boolean';
import pc from 'picocolors';
export function log(type, channel, msg) {
    const date = new Date();
    const time = date.toLocaleTimeString('en-GB');
    const body = type === 'msg' ? pc.dim(msg) : msg;
    console.log(`[${pc.yellow(time)} ${type}#${channel}]: ${body}`);
}
export const debug = (msg) => boolean(process.env.DEBUG) && console.log(pc.yellow(msg));
