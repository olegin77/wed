export interface EskizConfig {
  apiUrl: string;
  token: string;
  sender: string;
}

export interface EskizSendResult {
  ok: boolean;
  status: number;
  messageId?: string;
  error?: string;
}

function resolveEndpoint(apiUrl: string): string {
  const url = new URL("/api/message/sms/send", apiUrl);
  return url.toString();
}

export function createEskizAdapter(config: EskizConfig) {
  const endpoint = resolveEndpoint(config.apiUrl);

  return {
    async send(to: string, text: string): Promise<EskizSendResult> {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_phone: to,
          message: text,
          from: config.sender,
        }),
      });

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: await response.text(),
        };
      }

      const payload = (await response.json().catch(() => ({}))) as {
        message?: { id?: string };
      };

      return {
        ok: true,
        status: response.status,
        messageId: payload.message?.id,
      };
    },
  };
}
