import { OpenAIService } from '../interface-adapters/gateways/OpenAIService';
import { WhatsAppService } from '../interface-adapters/gateways/WhatsAppService';
import { SessionStore, ConversationMessage } from '../interface-adapters/gateways/SessionStore';

export class ProcessIncomingMessageUseCase {
  constructor(
    private openaiService: OpenAIService,
    private whatsappService: WhatsAppService,
    private sessionStore: SessionStore
  ) {}

  async execute(phoneNumber: string, incomingText: string): Promise<void> {
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
