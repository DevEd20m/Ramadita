## Why

El bot actual solo entrega el menú en formato texto, lo cual puede ser difícil de leer y menos atractivo visualmente que el diseño original de la marca. Además, no existe un mecanismo formal para que los clientes corrijan errores en su pedido inmediatamente después de confirmarlo, lo que genera fricción operativa si el cliente se arrepiente un minuto después.

## What Changes

- **Envío Proactivo de PDF**: El bot detectará el inicio de una conversación o solicitudes de menú para enviar el archivo `menu.pdf` alojado en Firebase Hosting.
- **Ventana de Modificación de Pedido**: Se implementará un límite de tiempo (configurable, por defecto 5 minutos) en el que el bot aceptará cambios a un pedido ya finalizado.
- **Persistencia de Sesión con Firestore**: Cambiaremos el almacenamiento de sesiones de memoria local a Firestore para rastrear el timestamp de confirmación de forma fiable.
- **Configuración Dinámica**: El tiempo límite será configurable vía variables de entorno.

## Capabilities

### New Capabilities
- `pdf-menu-delivery`: Gestión y entrega automática del menú visual en formato PDF a través de la WhatsApp Cloud API.
- `order-modification-window`: Lógica de validación temporal que permite reabrir un pedido recién finalizado para aplicar correcciones.

### Modified Capabilities
- Ninguna.

## Impact

- **WhatsAppService**: Se optimizará para usar URLs públicas de Firebase Hosting.
- **SessionStore**: Refactorización completa para usar Firestore.
- **ProcessIncomingMessageUseCase**: Integración de la lógica de chequeo temporal y envío proactivo.
- **Firebase Infrastructure**: Uso de Firestore y Hosting para archivos estáticos.
