import { Request, Response } from 'express';
import { ProcessIncomingMessageUseCase } from '../use-cases/ProcessIncomingMessageUseCase';

export class WebhookController {
  constructor(
    private readonly verifyToken: string,
    private readonly processMessageUseCase: ProcessIncomingMessageUseCase
  ) {}

  verifyWebhook = (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  };

  handleMessage = (req: Request, res: Response): void => {
    // Immediate 200 OK
    res.sendStatus(200);

    // Deferred background work
    try {
      const body = req.body;
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
        const phoneNumber = body.entry[0].changes[0].value.messages[0].from;
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

        this.processMessageUseCase.execute(phoneNumber, msgBody).catch(console.error);
      }
    } catch (err) {
      console.error('Error handling webhook payload', err);
    }
  };
}
