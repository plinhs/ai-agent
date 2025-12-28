# AI Agent Billing Assistant

This project implements an AI-based billing assistant that allows users to interact with a billing system using natural language. The assistant can check bills, view detailed bill information, and pay outstanding balances.
The project is designed to run locally and does not require deployment to a cloud hosting service.

---

## Project Goals

The goal of this project is to demonstrate:
- AI agent design
- Natural language intent parsing
- API orchestration via a gateway
- Stateful conversational behavior

The assistant acts as an intermediary between the user and an existing billing system.

---

## Supported User Actions

The assistant supports the following actions:

- **Check bill**  
  Returns a summary of the bill (total amount and status).

- **View bill details**  
  Returns full bill information including paid amount and remaining balance.

- **Pay bill**  
  Automatically pays the remaining unpaid balance for a selected month.

Example user inputs:
- “Check my October bill”
- “View bill details for January 2024”
- “Pay my March bill”

---

## Architecture Overview
React Frontend
↓
Firestore (chat messages)
↓
Firebase Cloud Function (AI Agent)
↓
API Gateway
↓
Billing Backend Services

---

## Component Responsibilities

### Frontend (React)
- Provides a chat-based user interface
- Sends user messages to Firestore
- Displays assistant responses in real time

### AI Agent (Firebase Cloud Function)
- Listens for new user messages
- Detects user intent from natural language
- Extracts parameters such as month
- Calls backend APIs via the gateway
- Generates human-readable responses

### API Gateway
- Acts as a single entry point to billing services
- Handles authentication and routing
- Applies rate limiting where required

### Billing Backend
- Stores bill and payment data
- Returns bill summaries and details
- Processes bill payments

--

## Design Assumptions

- The system assumes a single active subscriber (subscriber_no = 10) for demo purposes.
- User identity and authentication are out of scope for this assignment.
- The AI agent supports a limited set of billing intents (check bill, view details, pay bill).
- Month parsing supports both ISO format (YYYY-MM) and natural language month names.
- Payments always settle the remaining unpaid amount.

--

## Limitations and Issues Encountered

- Query bill endpoint is rate-limited (3 requests/day), which may affect repeated testing.
- Detailed bill structure depends on backend data availability.
- Natural language understanding is rule-based; no external LLM is used.
- Payment errors may occur if a bill does not exist for the selected month.



