## 1. Infraestructura y Assets

- [ ] 1.1 Copiar `assets/menu.pdf` a `public/menu.pdf` para que sea servido por Firebase Hosting.
- [ ] 1.2 Añadir `ORDER_MODIFICATION_LIMIT_MINUTES=5` al archivo `.env` y configurar para el despliegue de Firebase.

## 2. Persistencia en Firestore

- [ ] 2.1 Verificar/Instalar la dependencia `firebase-admin`.
- [ ] 2.2 Reemplazar la implementación de `SessionStore` por una versión que use Firestore.
- [ ] 2.3 Inicializar Firebase Admin en `src/index.ts` para conectar con el proyecto `bot-ia-3b90b`.

## 3. Lógica de Envío de PDF

- [ ] 3.1 Actualizar el método `sendPdfMessage` en `WhatsAppService` para aceptar una URL pública (Hosting).
- [ ] 3.2 Modificar `ProcessIncomingMessageUseCase` para enviar el PDF de forma proactiva al inicio o bajo demanda.

## 4. Ventana de Modificación (5 min)

- [ ] 4.1 Modificar la estructura de la sesión en Firestore para incluir `lastOrderConfirmedAt`.
- [ ] 4.2 Lógica en `ProcessIncomingMessageUseCase` para validar el tiempo transcurrido desde la última confirmación antes de permitir cambios.
- [ ] 4.3 Actualizar el `System Prompt` en `OpenAIService` para informar al bot sobre la regla de los 5 minutos.
