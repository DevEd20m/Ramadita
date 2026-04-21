## Context

El sistema actual utiliza una arquitectura serverless con Firebase Cloud Functions, pero el estado de la conversación se mantiene en memoria. Esto causa que el bot "olvide" el contexto si la función se recicla. Para implementar la ventana de modificación de pedidos de 5 minutos, necesitamos persistencia fiable que sobreviva a los reinicios de la instancia. Además, el bot debe servir un archivo estático (`menu.pdf`) de forma consistente.

## Goals / Non-Goals

**Goals:**
- Implementar persistencia de sesiones en Firestore.
- Servir el PDF del menú desde una URL pública estable (`Firebase Hosting`).
- Restringir cambios en pedidos confirmados a una ventana temporal configurable.

**Non-Goals:**
- Implementar un panel de administración para ver pedidos (se mantiene por logs/WhatsApp por ahora).
- Cambiar la lógica de procesamiento de lenguaje natural de OpenAI.

## Decisions

### 1. Migración a Firestore para SessionStore
- **Decisión**: Reemplazar `Map<string, ConversationMessage[]>` por una colección de Firestore llamada `sessions`.
- **Razón**: Firestore permite persistencia entre invocaciones de Cloud Functions y ofrece escalabilidad automática. Es ideal para almacenar el historial y metadatos del pedido (como `lastOrderConfirmedAt`).
- **Alternativa**: Redis (Upstash), pero añade una dependencia externa más allá del ecosistema Firebase.

### 2. Hosting del Menú en Firebase Hosting
- **Decisión**: Mover `assets/menu.pdf` a `public/menu.pdf`.
- **Razón**: Firebase Hosting ya está configurado para las Cloud Functions y ofrece una CDN rápida para servir archivos estáticos sin costo adicional por petición de API.

### 3. Configuración de Tiempo Límite vía Envar
- **Decisión**: Usar `process.env.ORDER_MODIFICATION_LIMIT_MINUTES`.
- **Razón**: Facilita ajustes rápidos en producción sin necesidad de modificar y recompilar el código.

## Risks / Trade-offs

- **[Riesgo] Costo de Lectura/Escritura en Firestore** → **Mitigación**: Se usará una estructura simple de documento por usuario y se limitará el tamaño del historial de conversación.
- **[Riesgo] Latencia de Red** → **Mitigación**: Firestore y Cloud Functions están en la misma región (`us-central1`), minimizando el impacto.
