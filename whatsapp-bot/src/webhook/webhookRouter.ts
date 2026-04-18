import { Router } from 'express';
import { WebhookController } from './webhookController';

export function WebhookRouter(controller: WebhookController): Router {
  const router = Router();
  router.get('/', controller.verifyWebhook);
  router.post('/', controller.handleMessage);
  return router;
}
