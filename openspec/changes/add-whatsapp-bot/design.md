## Context

La cevichería "La Ramadita del GRINGO - Marisqueria" maneja sus pedidos de delivery de forma manual a través de WhatsApp. Se propone automatizar esta interacción con un bot amigable e inteligente en Node.js que utilice WhatsApp Cloud API para la mensajería y la API de OpenAI para entender el lenguaje natural, gestionar el menú en texto plano, tomar la orden, calcular montos y recolectar los datos de envío, informando finalmente al staff dentro de la misma conversación de WhatsApp.

## Goals / Non-Goals

**Goals:**
- Construir la aplicación en Node.js estructurada bajo los principios de **Clean Architecture** (Separación de Domain, UseCases, Interface Adapters, y Frameworks).
- Construir un Webhook de alto rendimiento para interactuar con WhatsApp Cloud API (recepción y envío de mensajes).
- Implementar la inyección "System Prompt" en OpenAI con texto plano del menú para evitar respuestas fuera de contexto (hallucinations) y calcular gastos.
- Desplegar una suite de testing con foco en Tests Unitarios y de Integración extensivos (miles de casuísticas emulando comportamientos extraños de usuarios).
- Funcionar como copiloto; si la solicitud se sale del alcance, se recomendará amablemente hablar por llamada.

**Non-Goals:**
- Crear tableros/dashboards, web panels o bases de datos complejas para los cocineros (el cocinero leerá el resumen directo en el hilo del chat del bot/cliente).
- Pasarelas de pago automatizadas o procesamiento de tarjetas (el método de pago simplemente figura como un campo de texto consultado, ej: Yape/Efectivo).
- Una app móvil. Todo ocurre en la app de mensajería del celular del usuario (WhatsApp).

## Decisions

- **Core & Frameworks**: Node.js + TypeScript (sugerido para robustez en Clean Code) con Express (para exponer la API Rest del Webhook).
- **Inyección en IA**: Usaremos OpenAI (gpt-4o-mini o modelo equivalente para un balance de rapidez y entendimiento contextual largo). 
- **Asincronía en el Webhook**: Dado que las invocaciones a OpenAI pueden tomar > 3 segundos y WhatsApp exige acuses de recibo rápidos al webhook (200 OK en ms), el servicio guardará/entregará el evento a un handler asíncrono o Worker mientras se retorna inmediatamente la respuesta exitosa al Gateway de Meta.
- **Prompt Isolation**: El menú será abstraído en un layer de `ConfigurationManager` y se inyectará dinámicamente al Service de OpenAI, para poder alterarlo fácilmente en el futuro mediante archivos `.txt` o JSON.

## Risks / Trade-offs

- **Tiempo de latencia vs Inteligencia**: La dependencia de OpenAI puede inyectar demoras (3 a 5 segs) por mensaje para interpretar intención vs botoneo tradicional (100ms). Se comunicará la naturaleza conversacional (al usar isTyping actions) para mejorar la UX.
- **Riesgo de "Prompt Injection" o mal cálculo**: Un cliente hábil podría intentar ordenarle a la IA un descuento no autorizado. **Atenuación:** Establecer *Temperature: 0.1*, restricciones en el system prompt y la estricta limitación sobre la habilidad de otorgar descuentos.
