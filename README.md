# AI Purchasing Agent

A full-stack AI Purchasing Agent that reviews purchasing recommendations, checks business constraints, requests human approval, executes purchase orders, and validates the execution result.

## Features

- AI-assisted purchasing recommendation review
- Inventory and forecast analysis
- Existing purchase-order consideration
- Supplier MOQ and order-multiple validation
- Supplier availability validation
- Budget validation
- Storage-capacity validation
- Human approval before purchase-order execution
- Purchase-order creation
- Pre-execution and post-execution validation
- Action and agent-run logging
- Mock data for demonstration

## Architecture

```text
Frontend
React + Axios
    |
    v
Express REST API
    |
    +--> Purchasing Agent
    |       |
    |       +--> Inventory Tool
    |       +--> Forecast Tool
    |       +--> Supplier Tool
    |       +--> Budget Tool
    |       +--> Storage Tool
    |
    +--> Validation Service
    |
    +--> Human Approval
    |
    +--> Purchase Order Service
    |
    +--> Result Validation Service
    |
    v
MongoDB
```

## Core Principle

The AI agent is responsible for reasoning and recommendations.

The backend is responsible for:

- Validating constraints
- Enforcing approval
- Creating purchase orders
- Verifying execution results

The AI agent cannot directly create purchase orders or modify the database.

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS
- MUI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

## Project Structure

```text
ai-purchasing-agent/
├── frontend/
└── server/
    ├── src/
    │   ├── agent/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── seed/
    │   └── app.js
    └── package.json
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/pj1607/ai-pa-assignment
cd ai-pa-assignment
```

### 2. Start MongoDB

Make sure MongoDB is running locally.

### 3. Configure backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_purchasing_agent
```

### 4. Seed mock data

```bash
npm run seed
```

### 5. Start backend

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 6. Start frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## End-to-End Workflow

1. Select a purchasing recommendation.
2. Click `Review with AI`.
3. The agent gathers inventory, forecast, supplier, budget, storage, and existing PO information.
4. The agent calculates the additional requirement.
5. The backend validates the proposed quantity.
6. If a financial action is required, a human approval is created.
7. The human approves or rejects the action.
8. Only an approved action can create a purchase order.
9. The backend validates the created PO against the approved proposal.
10. The action is marked as completed.

## Decision Types

- `ACCEPTED` — recommendation satisfies the constraints
- `MODIFIED` — quantity is adjusted to satisfy constraints
- `REJECTED` — no additional purchase is required
- `INVESTIGATE` — a hard constraint prevents safe execution

## Validation Rules

The backend checks:

- Product exists
- Supplier exists
- Node exists
- Quantity is positive
- Unit price is valid
- Minimum order quantity
- Order multiple
- Supplier availability
- Node budget
- Storage capacity
- Existing open purchase orders

## Testing and Evaluation

| Test Case | Expected Result |
|---|---|
| Valid recommendation | Accepted or modified decision |
| Existing incoming stock | Additional requirement is reduced |
| Quantity below MOQ | Validation fails |
| Quantity not matching order multiple | Validation fails |
| Supplier stock insufficient | Investigate decision |
| Budget exceeded | Investigate decision |
| Storage capacity exceeded | Investigate decision |
| Human rejects action | No PO is created |
| Human approves action | Action becomes approved |
| Execute approved action | PO is created |
| Post-execution mismatch | Action fails validation |

## Mock Data

The project includes mock:

- Products
- Fulfillment nodes
- Suppliers
- Inventory
- Forecasts
- Existing purchase orders
- Purchasing recommendations

Run the seed script to populate the database:

```bash
npm run seed
```

## Safety and Control

- Financial actions require human approval.
- Purchase orders are created only by backend services.
- Validation runs before execution.
- Validation runs again after execution.
- Failed actions are recorded in the action log.
- The AI agent cannot directly write to MongoDB.

## Future Improvements

- Real LLM integration
- Supplier API integrations
- Authentication and role-based access
- More purchasing scenarios
- Advanced demand forecasting
- Notifications and audit dashboards


## Screenshots

### Purchasing Recommendations

![Recommendations](screenshots/recommendations.png)

### Agent Review

![Agent Review](screenshots/agent-review.png)

### Human Approval

![Human Approval](screenshots/human-approval.png)

### Purchase Orders

![Purchase Orders](screenshots/purchase-orders.png)
