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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const readline = __importStar(require("readline"));
const OpenAIService_1 = require("./interface-adapters/gateways/OpenAIService");
const SessionStore_1 = require("./interface-adapters/gateways/SessionStore");
const ProcessIncomingMessageUseCase_1 = require("./use-cases/ProcessIncomingMessageUseCase");
const WhatsAppService_1 = require("./interface-adapters/gateways/WhatsAppService");
// Mock WhatsAppService para imprimir en consola en lugar de enviar peticiones HTTP
class LocalTerminalWhatsAppService extends WhatsAppService_1.WhatsAppService {
    async sendTextMessage(to, text) {
        console.log(`\n🤖 [Bot]: ${text}\n`);
    }
    async sendPdfMessage(to, documentUrl, filename) {
        console.log(`\n📎 [Bot adjuntó archivo]: ${filename} (${documentUrl})\n`);
    }
}
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const menuPath = path.join(__dirname, '../assets/menu.txt');
const menuText = fs.existsSync(menuPath) ? fs.readFileSync(menuPath, 'utf8') : 'Menú no encontrado.';
const sessionStore = new SessionStore_1.SessionStore();
const openaiService = new OpenAIService_1.OpenAIService(menuText);
const localWhatsappService = new LocalTerminalWhatsAppService();
const processUseCase = new ProcessIncomingMessageUseCase_1.ProcessIncomingMessageUseCase(openaiService, localWhatsappService, sessionStore);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const DEMO_PHONE_NUMBER = '51999999999'; // Teléfono ficticio para la prueba
console.log('====================================================');
console.log('🐟 RAMADITA DEL GRINGO - TEST LOCAL DEL BOT 🐟');
console.log('Escribe tu mensaje y presiona Enter.');
console.log('(Escribe "salir" para terminar la simulación)');
console.log('====================================================\n');
const promptUser = () => {
    rl.question('👤 [Tú]: ', async (input) => {
        if (input.toLowerCase() === 'salir') {
            console.log('Saliendo del simulador...');
            rl.close();
            return;
        }
        try {
            await processUseCase.execute(DEMO_PHONE_NUMBER, input);
        }
        catch (error) {
            console.error('\n❌ Hubo un error procesando el mensaje:', error.message);
        }
        promptUser();
    });
};
promptUser();
