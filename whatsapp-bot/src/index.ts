import 'dotenv/config';
import express from 'express';
import { WebhookController } from './webhook/webhookController';
import { WebhookRouter } from './webhook/webhookRouter';
import { OpenAIService } from './interface-adapters/gateways/OpenAIService';
import { WhatsAppService } from './interface-adapters/gateways/WhatsAppService';
import { SessionStore } from './interface-adapters/gateways/SessionStore';
import { ProcessIncomingMessageUseCase } from './use-cases/ProcessIncomingMessageUseCase';

import * as fs from 'fs';
import * as path from 'path';

const app = express();
app.use(express.json());

const menuPath = path.join(__dirname, '../assets/menu.txt');
const menuText = fs.existsSync(menuPath) ? fs.readFileSync(menuPath, 'utf8') : 'Menú no encontrado.';

const sessionStore = new SessionStore();
const openaiService = new OpenAIService(menuText);
const whatsappService = new WhatsAppService();
const processUseCase = new ProcessIncomingMessageUseCase(openaiService, whatsappService, sessionStore);

import { onRequest } from "firebase-functions/v2/https";

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_verify_token';
const webhookController = new WebhookController(verifyToken, processUseCase);
const webhookRouter = WebhookRouter(webhookController);

app.use('/webhook', webhookRouter);

// Exportamos "api" que será la Cloud Function encargada de recibir las peticiones
export const api = onRequest(app);
