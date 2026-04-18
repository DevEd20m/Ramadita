"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessIncomingMessageUseCase = void 0;
class ProcessIncomingMessageUseCase {
    openaiService;
    whatsappService;
    sessionStore;
    constructor(openaiService, whatsappService, sessionStore) {
        this.openaiService = openaiService;
        this.whatsappService = whatsappService;
        this.sessionStore = sessionStore;
    }
    async execute(phoneNumber, incomingText) {
        const isFirstTime = this.sessionStore.getHistory(phoneNumber).length === 0;
        // Add User Message to History
        this.sessionStore.addMessage(phoneNumber, { role: 'user', content: incomingText });
        // Get Complete History
        const history = this.sessionStore.getHistory(phoneNumber);
        // Process with OpenAI
        const aiResponse = await this.openaiService.getCompletion(history);
        // Send Message back to WhatsApp
        await this.whatsappService.sendTextMessage(phoneNumber, aiResponse);
        // If it's first time, send PDF right after
        if (isFirstTime) {
            await this.whatsappService.sendPdfMessage(phoneNumber, 'https://example.com/menu.pdf', 'Menu_La_Ramadita.pdf');
        }
        // Add Bot message to History
        this.sessionStore.addMessage(phoneNumber, { role: 'assistant', content: aiResponse });
    }
}
exports.ProcessIncomingMessageUseCase = ProcessIncomingMessageUseCase;
