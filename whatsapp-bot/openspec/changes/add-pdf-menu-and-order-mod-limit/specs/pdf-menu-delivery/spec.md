## ADDED Requirements

### Requirement: Envío de PDF en bienvenida
El sistema DEBÉ enviar automáticamente el archivo `menu.pdf` al detectar el inicio de una sesión o el primer mensaje de un usuario nuevo.

#### Scenario: Usuario nuevo saluda
- **WHEN** un usuario envía un mensaje por primera vez
- **THEN** el sistema envía una respuesta de texto seguida del archivo PDF del menú

### Requirement: Envío de PDF bajo demanda
El sistema DEBÉ enviar el archivo `menu.pdf` cuando el usuario lo solicite explícitamente mediante palabras clave como "menú", "pdf" o "carta".

#### Scenario: Usuario pide el PDF
- **WHEN** el usuario escribe "¿me pasas el pdf del menú?"
- **THEN** el sistema envía el archivo PDF del menú
