"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const webhookController_1 = require("./webhook/webhookController");
const webhookRouter_1 = require("./webhook/webhookRouter");
const OpenAIService_1 = require("./interface-adapters/gateways/OpenAIService");
const WhatsAppService_1 = require("./interface-adapters/gateways/WhatsAppService");
const SessionStore_1 = require("./interface-adapters/gateways/SessionStore");
const ProcessIncomingMessageUseCase_1 = require("./use-cases/ProcessIncomingMessageUseCase");
const AppError_1 = require("./errors/AppError");
const logger_1 = require("./utils/logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const admin = __importStar(require("firebase-admin"));
// Inicialización de Firebase Admin para acceso a Firestore
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, _res, next) => {
    logger_1.logger.info('Incoming request', {
        method: req.method,
        path: req.path,
    });
    next();
});
const menuPath = path.join(__dirname, '../assets/menu.txt');
const menuText = fs.existsSync(menuPath) ? fs.readFileSync(menuPath, 'utf8') : 'Menú no encontrado.';
const sessionStore = new SessionStore_1.SessionStore();
const openaiService = new OpenAIService_1.OpenAIService(menuText);
const whatsappService = new WhatsAppService_1.WhatsAppService();
const processUseCase = new ProcessIncomingMessageUseCase_1.ProcessIncomingMessageUseCase(openaiService, whatsappService, sessionStore);
const https_1 = require("firebase-functions/v2/https");
const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
if (!verifyToken) {
    throw new AppError_1.ConfigurationError('Missing WhatsApp verify token', {
        envVar: 'WHATSAPP_VERIFY_TOKEN',
    });
}
const webhookController = new webhookController_1.WebhookController(verifyToken, processUseCase);
const webhookRouter = (0, webhookRouter_1.WebhookRouter)(webhookController);
app.use('/webhook', webhookRouter);
app.use((error, req, res, next) => {
    logger_1.logger.error('Unhandled Express error', error, {
        method: req.method,
        path: req.path,
    });
    if (res.headersSent) {
        next(error);
        return;
    }
    res.status(500).json({
        error: 'Internal server error',
    });
});
// Exportamos "api" que será la Cloud Function encargada de recibir las peticiones
exports.api = (0, https_1.onRequest)(app);
