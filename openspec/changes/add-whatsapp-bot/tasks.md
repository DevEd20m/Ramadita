## 1. Project Setup
- [x] 1.1 Initialize Node.js project using Express and TypeScript
- [x] 1.2 Setup Clean Architecture folder structure (Domain, UseCases, InterfaceAdapters, Infrastructure)
- [x] 1.3 Configure Jest and supertest for unit and integration testing

## 2. Infrastructure & Adapters
- [x] 2.1 Implement `WhatsAppService` adapter to send Text messages and Media (PDF) via Meta Cloud API
- [x] 2.2 Implement `OpenAIService` adapter to process chat history, parse system directives, and extract intent securely
- [x] 2.3 Setup an In-Memory OR Redis session store to keep track of user conversation states

## 3. Core Domain & Use Cases
- [x] 3.1 Define Entities (`Order`, `CustomerDetails`, `ConversationState`)
- [x] 3.2 Implement `ProcessIncomingMessageUseCase` (determines if it's new user, ordering, or providing missing info)
- [x] 3.3 Implement `EvaluateOrderTotalUseCase` (cross-references asked items with plaintext menu and calculates amount to charge)
- [x] 3.4 Implement `IdentifyMissingInformationUseCase` (checks if Name, Phone, Payment, Address, Ref are fulfilled)
- [x] 3.5 Implement `FinalizeOrderUseCase` (Generates the final Summary string and dispatches it into the thread)

## 4. API Layer
- [x] 4.1 Create GET `/webhook` for WhatsApp Hub Challenge verification
- [x] 4.2 Create POST `/webhook` for incoming messages, guaranteeing immediate 200 OK return and delegating work to a deferred background handler

## 5. Testing Pipeline
- [x] 5.1 Write unit tests for `EvaluateOrderTotalUseCase` making sure it doesn't hallucinate prices
- [x] 5.2 Write unit tests for the missing information validation algorithm
- [x] 5.3 Write Integration tests simulating the complete payload flow from Meta to Webhook, to OpenAI, back to Meta for thousands of edge cases (e.g. user changing order mid-way, answering randomly, etc)
