"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
const AppError_1 = require("../../errors/AppError");
const logger_1 = require("../../utils/logger");
class OpenAIService {
    openai;
    systemPrompt;
    constructor(menuText) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new AppError_1.ConfigurationError('Missing OpenAI API key', {
                envVar: 'OPENAI_API_KEY',
            });
        }
        this.openai = new openai_1.default({ apiKey });
        this.systemPrompt = `
      Eres el recepcionista virtual de 'La Ramadita del GRINGO - Marisqueria'. Tu tono es súper amable, alegre y usas emojis (🐟🦀🍱😋🫡🙌🫶). Tu objetivo es tomar pedidos de delivery.
      Reglas:
      1. Siempre saluda usando el mensaje oficial y acompaña tu primer mensaje indicando que les envías el PDF del menú.
      2. Usa el siguiente menú en texto plano para responder dudas y calcular el total a pagar:
      === MENU ===
      ${menuText}
      === FIN MENU ===
      3. Cuando el cliente pida, calcula la suma de los precios y muéstrale el 'Monto a cobrar'. No inventes precios.
      4. Pídele los datos de envío: Nombre, Celular, Paga con, Dirección, Referencia.
      5. Si el cliente tiene una queja o pide hablar con un humano, indícale amablemente que por favor llame directamente al restaurante.
      6. IMPORTANTE: Respeta AL PIE DE LA LETRA las REGLAS específicas que se encuentran escritas dentro del texto del Menú (Ej: reglas de Combos, Makis, Salsas y modificaciones sugeridas).
      7. VENTANA DE CAMBIOS: Una vez que el pedido sea "Confirmado", el cliente solo tiene 10 minutos para solicitar cambios o cancelaciones. Si el sistema te indica que han pasado más de 10 minutos, informa al cliente amable pero firmemente que el pedido ya entró a cocina y no puede modificarse.
    `;
    }
    async getCompletion(history) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...history
            ];
            logger_1.logger.debug('Invoking OpenAI completion', {
                historyLength: history.length,
            });
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.1,
            });
            return response.choices[0]?.message?.content || '';
        }
        catch (error) {
            logger_1.logger.error('Error invoking OpenAI', error, {
                historyLength: history.length,
            });
            throw new AppError_1.OpenAIError('Failed to generate OpenAI completion', {
                historyLength: history.length,
            });
        }
    }
}
exports.OpenAIService = OpenAIService;
