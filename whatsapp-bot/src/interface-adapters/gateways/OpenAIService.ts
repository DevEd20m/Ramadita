import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;
  private readonly systemPrompt: string;

  constructor(menuText: string) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    `;
  }

  async getCompletion(history: { role: 'system' | 'user' | 'assistant', content: string }[]): Promise<string> {
    try {
      const messages: any[] = [
        { role: 'system', content: this.systemPrompt },
        ...history
      ];
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.1,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Error invoking OpenAI:', error?.message);
      throw error;
    }
  }
}
