## ADDED Requirements

### Requirement: Ventana de modificación permitida
El sistema DEBÉ permitir que un usuario modifique o cancele un pedido si la solicitud se realiza dentro de los primeros N minutos (configurable) después de la confirmación del pedido original.

#### Scenario: Modificación dentro del tiempo límite
- **WHEN** un usuario confirma un pedido a las 12:00
- **AND** el usuario solicita cambiar un plato a las 12:03 (límite de 5 mins)
- **THEN** el sistema permite reabrir el pedido y procesar el cambio

### Requirement: Rechazo de modificación fuera de tiempo
El sistema DEBÉ informar proactivamente al usuario que no es posible realizar cambios si el tiempo transcurrido desde la confirmación supera el límite configurado.

#### Scenario: Modificación fuera del tiempo límite
- **WHEN** un usuario confirma un pedido a las 12:00
- **AND** el usuario solicita cambiar un plato a las 12:06 (límite de 5 mins)
- **THEN** el sistema responde que el pedido ya entró a cocina y no puede ser modificado
