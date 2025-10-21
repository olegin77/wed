export type TelegramMessage = { chatId: string; msg: string };

export function notify(chatId: string, msg: string): TelegramMessage {
  return { chatId, msg };
}

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "Markdown" | "HTML";
}

export function notify(message: TelegramMessage): TelegramMessage {
  return message;
}
