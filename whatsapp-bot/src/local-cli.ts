import 'dotenv/config';
import * as readline from 'readline';
import { OpenAIService } from './interface-adapters/gateways/OpenAIService';
import { SessionStore } from './interface-adapters/gateways/SessionStore';
import { ProcessIncomingMessageUseCase } from './use-cases/ProcessIncomingMessageUseCase';
import { WhatsAppService } from './interface-adapters/gateways/WhatsAppService';

// Mock WhatsAppService para imprimir en consola en lugar de enviar peticiones HTTP
class LocalTerminalWhatsAppService extends WhatsAppService {
  async sendTextMessage(to: string, text: string): Promise<void> {
    console.log(`\n🤖 [Bot]: ${text}\n`);
  }

  async sendPdfMessage(to: string, documentUrl: string, filename: string): Promise<void> {
    console.log(`\n📎 [Bot adjuntó archivo]: ${filename} (${documentUrl})\n`);
  }
}

import * as fs from 'fs';
import * as path from 'path';

const menuPath = path.join(__dirname, '../assets/menu.txt');
const menuText = fs.existsSync(menuPath) ? fs.readFileSync(menuPath, 'utf8') : 'Menú no encontrado.';

const sessionStore = new SessionStore();
const openaiService = new OpenAIService(menuText);
const localWhatsappService = new LocalTerminalWhatsAppService();
const processUseCase = new ProcessIncomingMessageUseCase(openaiService, localWhatsappService as any, sessionStore);

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
    } catch (error: any) {
      console.error('\n❌ Hubo un error procesando el mensaje:', error.message);
    }

    promptUser();
  });
};

promptUser();
