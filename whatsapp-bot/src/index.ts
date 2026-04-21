import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { WebhookController } from './webhook/webhookController';
import { WebhookRouter } from './webhook/webhookRouter';
import { OpenAIService } from './interface-adapters/gateways/OpenAIService';
import { WhatsAppService } from './interface-adapters/gateways/WhatsAppService';
import { SessionStore } from './interface-adapters/gateways/SessionStore';
import { ProcessIncomingMessageUseCase } from './use-cases/ProcessIncomingMessageUseCase';
import { ConfigurationError } from './errors/AppError';
import { logger } from './utils/logger';

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

// Inicialización de Firebase Admin para acceso a Firestore
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
  });
  next();
});

const menuPath = path.join(__dirname, '../assets/menu.txt');
const menuText = fs.existsSync(menuPath) ? fs.readFileSync(menuPath, 'utf8') : 'Menú no encontrado.';

const sessionStore = new SessionStore();
const openaiService = new OpenAIService(menuText);
const whatsappService = new WhatsAppService();
const processUseCase = new ProcessIncomingMessageUseCase(openaiService, whatsappService, sessionStore);

import { onRequest } from "firebase-functions/v2/https";

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

if (!verifyToken) {
  throw new ConfigurationError('Missing WhatsApp verify token', {
    envVar: 'WHATSAPP_VERIFY_TOKEN',
  });
}

const webhookController = new WebhookController(verifyToken, processUseCase);
const webhookRouter = WebhookRouter(webhookController);

app.use('/webhook', webhookRouter);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Express error', error, {
    method: req.method,
    path: req.path,
  });

  if (res.headersSent) {
    next(error as Error);
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
  });
});

// Exportamos "api" que será la Cloud Function encargada de recibir las peticiones
export const api = onRequest(app);
