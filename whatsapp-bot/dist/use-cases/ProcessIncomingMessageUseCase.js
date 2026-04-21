"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessIncomingMessageUseCase = void 0;
const logger_1 = require("../utils/logger");
class ProcessIncomingMessageUseCase {
    openaiService;
    whatsappService;
    sessionStore;
    MODIFICATION_LIMIT_MS;
    PDF_URL = 'https://bot-ia-3b90b.web.app/menu.pdf';
    constructor(openaiService, whatsappService, sessionStore) {
        this.openaiService = openaiService;
        this.whatsappService = whatsappService;
        this.sessionStore = sessionStore;
        const limitMinutes = parseInt(process.env.ORDER_MODIFICATION_LIMIT_MINUTES || '10', 10);
        this.MODIFICATION_LIMIT_MS = limitMinutes * 60 * 1000;
    }
    async execute(phoneNumber, incomingText) {
        try {
            logger_1.logger.info('Processing incoming message', {
                phoneNumber,
            });
            const history = await this.sessionStore.getHistory(phoneNumber);
            const isFirstTime = history.length === 0;
            logger_1.logger.debug('Loaded conversation history', {
                phoneNumber,
                historyLength: history.length,
            });
            // Check for modification window
            const lastConfirmedAt = await this.sessionStore.getLastOrderConfirmedAt(phoneNumber);
            const now = Date.now();
            let contextualHistory = [...history];
            if (lastConfirmedAt) {
                const diff = now - lastConfirmedAt;
                if (diff > this.MODIFICATION_LIMIT_MS) {
                    // Window closed: Tell the AI it's too late to modify
                    contextualHistory.push({
                        role: 'system',
                        content: 'IMPORTANTE: Han pasado más de 10 minutos desde que el cliente confirmó su pedido. El pedido ya entró a cocina y NO puede ser modificado ni cancelado. Informa amable pero firmemente al cliente si intenta hacerlo.'
                    });
                }
            }
            // Add User Message
            await this.sessionStore.addMessage(phoneNumber, { role: 'user', content: incomingText });
            logger_1.logger.debug('Stored incoming user message', {
                phoneNumber,
                incomingTextLength: incomingText.length,
            });
            // Process with OpenAI
            const aiResponse = await this.openaiService.getCompletion([...contextualHistory, { role: 'user', content: incomingText }]);
            logger_1.logger.info('Generated OpenAI response', {
                phoneNumber,
                responseLength: aiResponse.length,
            });
            // Send Message back to WhatsApp
            await this.whatsappService.sendTextMessage(phoneNumber, aiResponse);
            logger_1.logger.info('Sent WhatsApp text response', {
                phoneNumber,
            });
            // Proactive PDF: Send on first message (Hello)
            if (isFirstTime) {
                await this.whatsappService.sendPdfMessage(phoneNumber, this.PDF_URL, 'Menu_La_Ramadita.pdf');
                logger_1.logger.info('Sent proactive menu PDF', {
                    phoneNumber,
                });
            }
            // Detect Order Confirmation to start the 10-minute timer
            if (aiResponse.includes('¡Pedido Confirmado!') || aiResponse.includes('Pedido Confirmado')) {
                await this.sessionStore.setOrderConfirmedAt(phoneNumber, now);
                logger_1.logger.info('Stored order confirmation timestamp', {
                    phoneNumber,
                });
            }
            // Add Bot message to History
            await this.sessionStore.addMessage(phoneNumber, { role: 'assistant', content: aiResponse });
            logger_1.logger.debug('Stored assistant response', {
                phoneNumber,
                responseLength: aiResponse.length,
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to process incoming message', error, {
                phoneNumber,
            });
            throw error;
        }
    }
}
exports.ProcessIncomingMessageUseCase = ProcessIncomingMessageUseCase;
