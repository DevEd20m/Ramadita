import axios from 'axios';
import { ConfigurationError, WhatsAppError } from '../../errors/AppError';
import { logger } from '../../utils/logger';

export class WhatsAppService {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor() {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId) {
      throw new ConfigurationError('Missing WhatsApp phone number ID', {
        envVar: 'WHATSAPP_PHONE_NUMBER_ID',
      });
    }

    if (!accessToken) {
      throw new ConfigurationError('Missing WhatsApp access token', {
        envVar: 'WHATSAPP_ACCESS_TOKEN',
      });
    }

    this.apiUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
    this.token = accessToken;
  }

  async sendTextMessage(to: string, text: string): Promise<void> {
    try {
      logger.debug('Sending WhatsApp text message', {
        to,
        apiUrl: this.apiUrl,
      });
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
      logger.error('Error sending WhatsApp text message', error, {
        to,
        apiUrl: this.apiUrl,
        status: error?.response?.status,
        responseData: error?.response?.data,
      });
      throw new WhatsAppError('Failed to send WhatsApp text message', {
        to,
        status: error?.response?.status,
        responseData: error?.response?.data,
      });
    }
  }

  async sendPdfMessage(to: string, documentUrl: string, filename: string): Promise<void> {
    try {
      logger.debug('Sending WhatsApp PDF message', {
        to,
        filename,
        apiUrl: this.apiUrl,
      });
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
      logger.error('Error sending WhatsApp PDF message', error, {
        to,
        filename,
        apiUrl: this.apiUrl,
        status: error?.response?.status,
        responseData: error?.response?.data,
      });
      throw new WhatsAppError('Failed to send WhatsApp PDF message', {
        to,
        filename,
        status: error?.response?.status,
        responseData: error?.response?.data,
      });
    }
  }
}
