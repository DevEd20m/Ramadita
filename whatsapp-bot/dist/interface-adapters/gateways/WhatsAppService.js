"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../../errors/AppError");
const logger_1 = require("../../utils/logger");
class WhatsAppService {
    apiUrl;
    token;
    constructor() {
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        if (!phoneNumberId) {
            throw new AppError_1.ConfigurationError('Missing WhatsApp phone number ID', {
                envVar: 'WHATSAPP_PHONE_NUMBER_ID',
            });
        }
        if (!accessToken) {
            throw new AppError_1.ConfigurationError('Missing WhatsApp access token', {
                envVar: 'WHATSAPP_ACCESS_TOKEN',
            });
        }
        this.apiUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
        this.token = accessToken;
    }
    async sendTextMessage(to, text) {
        try {
            logger_1.logger.debug('Sending WhatsApp text message', {
                to,
                apiUrl: this.apiUrl,
            });
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
            logger_1.logger.error('Error sending WhatsApp text message', error, {
                to,
                apiUrl: this.apiUrl,
                status: error?.response?.status,
                responseData: error?.response?.data,
            });
            throw new AppError_1.WhatsAppError('Failed to send WhatsApp text message', {
                to,
                status: error?.response?.status,
                responseData: error?.response?.data,
            });
        }
    }
    async sendPdfMessage(to, documentUrl, filename) {
        try {
            logger_1.logger.debug('Sending WhatsApp PDF message', {
                to,
                filename,
                apiUrl: this.apiUrl,
            });
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
            logger_1.logger.error('Error sending WhatsApp PDF message', error, {
                to,
                filename,
                apiUrl: this.apiUrl,
                status: error?.response?.status,
                responseData: error?.response?.data,
            });
            throw new AppError_1.WhatsAppError('Failed to send WhatsApp PDF message', {
                to,
                filename,
                status: error?.response?.status,
                responseData: error?.response?.data,
            });
        }
    }
}
exports.WhatsAppService = WhatsAppService;
