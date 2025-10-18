export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "Markdown" | "HTML";
}

export function notify(message: TelegramMessage): TelegramMessage {
  return message;
}
