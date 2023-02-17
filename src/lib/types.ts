export type CliOptions = {
  channels: string;
  datasource: string;
};

export type ChatEventType =
  | 'drop'
  | 'landed'
  | 'meme'
  | 'command'
  | 'msg'
  | 'join'
  | 'part'
  | 'channel_join';

export type ChatEvent = {
  type: ChatEventType;
  channel: string;
  username?: string;
  context?: Record<string, any>;
  text?: string;
};

export type ChatEvents = ChatEvent[] | ChatEvent;
