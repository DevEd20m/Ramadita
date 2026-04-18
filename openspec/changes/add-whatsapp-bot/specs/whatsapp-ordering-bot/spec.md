## ADDED Requirements

### Requirement: Send welcome message and menu
The system SHALL reply to any initial incoming message from an unknown or reset session with a welcome greeting and the PDF menu link or payload.

#### Scenario: First interaction
- **WHEN** a user sends "Hola" or any first message
- **THEN** the bot replies with the standardized welcome message with emojis
- **THEN** the bot sends the menu PDF

### Requirement: Calculate total order amount
The system SHALL understand what products the user wants, cross-reference them with the plaintext menu prices, and calculate the total amount correctly.

#### Scenario: Valid order with known products
- **WHEN** a user orders "1 Ceviche Mixto y 1 Jalea"
- **THEN** the bot replies acknowledging the items and indicating the correct total price based on the menu

### Requirement: Extrapolate missing information conversations
The system SHALL ask for missing required delivery information.

#### Scenario: Missing details are requested
- **WHEN** the order amount is calculated
- **THEN** the bot asks for the Name, Phone, Payment method, Address, and Reference in a friendly way

### Requirement: Print final summary
The system SHALL print a final summary of the confirmed order in the chat for the staff to read.

#### Scenario: Order is complete
- **WHEN** the user provides all requested delivery details
- **THEN** the bot sends a goodbye message and prints the final summary "Pedido Confirmado" containing all user details, ordered items, and order total in the chat
