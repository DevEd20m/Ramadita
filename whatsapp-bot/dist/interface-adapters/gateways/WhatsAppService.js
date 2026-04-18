"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const axios_1 = __importDefault(require("axios"));
class WhatsAppService {
    apiUrl;
    token;
    constructor() {
        this.apiUrl = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
        this.token = process.env.WHATSAPP_ACCESS_TOKEN || '';
    }
    async sendTextMessage(to, text) {
        try {
            await axios_1.default.post(this.apiUrl, {
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: { body: text },
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            console.error('Error sending WhatsApp message:', error?.response?.data || error.message);
            throw error;
        }
    }
    async sendPdfMessage(to, documentUrl, filename) {
        try {
            await axios_1.default.post(this.apiUrl, {
                messaging_product: 'whatsapp',
                to,
                type: 'document',
                document: {
                    link: documentUrl,
                    filename: filename,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            console.error('Error sending WhatsApp PDF:', error?.response?.data || error.message);
            throw error;
        }
    }
}
exports.WhatsAppService = WhatsAppService;
