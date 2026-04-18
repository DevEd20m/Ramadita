import axios from 'axios';

export class WhatsAppService {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor() {
    this.apiUrl = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    this.token = process.env.WHATSAPP_ACCESS_TOKEN || '';
  }

  async sendTextMessage(to: string, text: string): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error?.response?.data || error.message);
      throw error;
    }
  }

  async sendPdfMessage(to: string, documentUrl: string, filename: string): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'document',
          document: {
            link: documentUrl,
            filename: filename,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending WhatsApp PDF:', error?.response?.data || error.message);
      throw error;
    }
  }
}
