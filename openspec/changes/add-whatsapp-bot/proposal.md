## Why

Esta iniciativa soluciona la necesidad de automatizar la recepción de pedidos de delivery para la cevichería "La Ramadita del GRINGO - Marisqueria" a través de WhatsApp. Se busca reducir el tiempo de respuesta, evitar errores manuales en los pedidos y estandarizar la atención al cliente, ofreciendo una experiencia rápida pero que mantenga un tono humano, amigable y personalizado, sin requerir que los operadores calculen manualmente cada ticket.

## What Changes

- Implementación de un servicio en Node.js utilizando Clean Architecture.
- Integración con WhatsApp Cloud API para enviar y recibir mensajes directamente desde WhatsApp.
- Integración con OpenAI API para dotar al bot de capacidad de entendimiento del texto plano del menú (precios, productos) e interactuar usando emojis y amabilidad.
- Generación automática de presupuesto ("Monto a cobrar") basado en los productos solicitados.
- Recolección autónoma de datos del cliente (Nombre, Celular, Pago, Dirección, etc.).
- Elaboración de un resumen final de pedido depositado en el propio chat para que el equipo humano proceda a prepararlo.

## Capabilities

### New Capabilities
- `whatsapp-ordering-bot`: Control de flujo conversacional mediante IA y WhatsApp, inyección de contexto de menú en texto plano, y extracción de intención de compra e información del cliente.

### Modified Capabilities
- Ninguna.

## Impact

- **Sistemas**: Creación de un nuevo proyecto/módulo en Node.js para servir como webhook transaccional.
- **Externos**: Dependencia de plataformas de Meta (WhatsApp Business Platform) y OpenAI.
- **Operaciones**: El personal pasará de tomar el pedido iterativamente a solo leer resúmenes confirmados para preparar en cocina.
