// SMS adapter for Eskiz
export interface SmsMessage {
  to: string;
  text: string;
  from?: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EskizSmsAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://notify.eskiz.uz/api') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async send(message: SmsMessage): Promise<SmsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/message/sms/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_phone: message.to,
          message: message.text,
          from: message.from || '4546',
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        return {
          success: true,
          messageId: data.data?.message_id,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Unknown error',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/get-balance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        return {
          balance: data.data?.balance || 0,
          currency: 'UZS',
        };
      } else {
        throw new Error(data.message || 'Failed to get balance');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }
}

// Default instance
export const eskiz = new EskizSmsAdapter(process.env.ESKIZ_API_KEY || '');