import request from 'supertest';
import express from 'express';
import { WebhookController } from '../../src/webhook/webhookController';
import { WebhookRouter } from '../../src/webhook/webhookRouter';
import { ProcessIncomingMessageUseCase } from '../../src/use-cases/ProcessIncomingMessageUseCase';
import { OpenAIService } from '../../src/interface-adapters/gateways/OpenAIService';
import { WhatsAppService } from '../../src/interface-adapters/gateways/WhatsAppService';
import { SessionStore } from '../../src/interface-adapters/gateways/SessionStore';

// Mock dependencies
jest.mock('../../src/interface-adapters/gateways/OpenAIService');
jest.mock('../../src/interface-adapters/gateways/WhatsAppService');

describe('Webhook Integration', () => {
  let app: express.Express;
  let whatsappServiceMock: jest.Mocked<WhatsAppService>;
  let openaiServiceMock: jest.Mocked<OpenAIService>;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    whatsappServiceMock = new WhatsAppService() as jest.Mocked<WhatsAppService>;
    openaiServiceMock = new OpenAIService('menu') as jest.Mocked<OpenAIService>;
    
    openaiServiceMock.getCompletion.mockResolvedValue('Mocked AI response');
    whatsappServiceMock.sendTextMessage.mockResolvedValue();
    whatsappServiceMock.sendPdfMessage.mockResolvedValue();

    const sessionStore = new SessionStore();
    const useCase = new ProcessIncomingMessageUseCase(openaiServiceMock, whatsappServiceMock, sessionStore);
    const controller = new WebhookController('test_token', useCase);

    app.use('/webhook', WebhookRouter(controller));
  });

  it('should verify webhook challenge', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test_token',
      'hub.challenge': 'CHALLENGE_ACCEPTED'
    });

    expect(res.status).toBe(200);
    expect(res.text).toBe('CHALLENGE_ACCEPTED');
  });

  it('should return 200 OK for incoming messages and process them', async () => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [{
        id: '12345',
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '123', phone_number_id: '456' },
            contacts: [{ profile: { name: 'Test' }, wa_id: '999999999' }],
            messages: [{
              from: '999999999',
              id: 'wamid',
              timestamp: '1600000',
              text: { body: 'Hola bot' },
              type: 'text'
            }]
          },
          field: 'messages'
        }]
      }]
    };

    const res = await request(app).post('/webhook').send(payload);

    expect(res.status).toBe(200);

    // Give it a tiny bit of time for the delegated async work to finish
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(openaiServiceMock.getCompletion).toHaveBeenCalled();
    expect(whatsappServiceMock.sendTextMessage).toHaveBeenCalledWith('999999999', 'Mocked AI response');
  });
});
