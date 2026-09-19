# QueueLess

### Intelligent Campus Visit Decision Assistant

> **Should I go now?**

QueueLess is an intelligent campus service visit decision assistant built to help students decide whether visiting a campus office **right now** is worth it.

Instead of looking only at a queue number, QueueLess considers the complete visit:

- Required documents
- Current queue
- Estimated waiting time
- Travel time
- Average service duration
- Office closing time

It then gives a clear **GO / WAIT / DON'T GO** decision and recommends when the student should leave.

## Live Demo

**Website:** https://main.d2m6s3asyhpjj9.amplifyapp.com

**Backend API:** https://cn4f7pe60d.execute-api.us-east-1.amazonaws.com/Prod

**GitHub:** https://github.com/shayangonchoudhury-svg/QueueLess

---

## The Problem

Students frequently visit campus offices without knowing:

- How long the queue will take
- Whether they have all required documents
- Whether they will reach the office in time
- Whether the visit can actually be completed before closing

This can lead to unnecessary travel, long waiting periods, and failed visits.

QueueLess turns that uncertainty into a simple decision.

---

## How QueueLess Works

```text
Select Campus Service
        ↓
Check Required Documents
        ↓
Read Current Queue
        ↓
Estimate Waiting + Travel + Service Time
        ↓
Compare With Office Closing Time
        ↓
       Decision
   ┌────┼──────┐
   ↓    ↓      ↓
  GO   WAIT  DON'T GO
   ↓    ↓      ↓
Recommended Departure
        ↓
Live Queue Tracking
        ↓
Staff Counter Updates
```

---

## Decision Engine

The decision engine is deterministic and authoritative.

### GO

Returned when the student is ready and the estimated visit can be completed before the office closes.

### WAIT

Returned when the queue or estimated waiting time is too high.

QueueLess can recommend a later departure time so the student does not arrive unnecessarily early and spend extra time waiting.

### DON'T GO

Returned when:

- Required documents are missing, or
- The estimated visit cannot be completed before closing time.

This keeps the core decision predictable and reproducible.

---

## Main Features

### Smart Visit Decision

QueueLess evaluates multiple factors together instead of treating the queue as the only input.

### Requirement Checking

Students can see which documents are required before deciding to travel.

### Live Queue

Students can track:

- Currently serving token
- Their own token
- People ahead
- Queue progress

### Staff Counter Portal

Staff can advance the queue using **Serve Next**.

### Persistent Queue State

Queue updates are stored in DynamoDB so the state is not limited to one browser session.

### Recommended Departure

For WAIT decisions, QueueLess calculates a more useful departure window rather than simply telling the student to wait.

---

## AWS Architecture

```text
                        ┌──────────────────────┐
                        │   React + TypeScript  │
                        │      Frontend         │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   AWS Amplify        │
                        │   Hosting            │
                        └──────────┬───────────┘
                                   │ HTTPS
                                   ▼
                        ┌──────────────────────┐
                        │   Amazon API Gateway │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │      AWS Lambda      │
                        │  QueueLess Backend   │
                        └──────────┬───────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
                     ▼                           ▼
          ┌────────────────────┐      ┌────────────────────┐
          │  Amazon DynamoDB   │      │ Deterministic      │
          │ Services + Queue   │      │ Decision Engine    │
          └────────────────────┘      └────────────────────┘
```

### AWS Services Used

**AWS Amplify Hosting**
- Hosts the production React frontend.

**Amazon API Gateway**
- Exposes the backend API.

**AWS Lambda**
- Runs the QueueLess backend and decision/queue logic.

**Amazon DynamoDB**
- Stores campus services and persistent queue state.

**AWS SAM**
- Defines and deploys the serverless infrastructure.

**AWS Secrets Manager**
- Used during development for securely storing the Gemini API credential.

---

## API Endpoints

Base URL:

```text
https://cn4f7pe60d.execute-api.us-east-1.amazonaws.com/Prod
```

### Health

```http
GET /health
```

### Services

```http
GET /api/services
GET /api/services/{serviceId}
```

### Decision

```http
POST /api/decision
```

### Queue

```http
GET /api/queue/{serviceId}
POST /api/queue/{serviceId}
```

---

## Example Decision Request

```json
{
  "serviceId": "migration-cert",
  "documents": [
    "Student ID",
    "Application Form",
    "Fee Receipt",
    "Passport Photograph"
  ],
  "simulatedTime": 840
}
```

The backend evaluates readiness, queue conditions, travel time, service duration, and closing time before returning the decision.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Responsive UI

### Backend

- Node.js
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS SAM

### AI / Agent Exploration

- Strands Agents SDK
- Google Gemini

The AI layer was explored for natural-language explanations, while the actual GO / WAIT / DON'T GO decision remains deterministic and authoritative.

---

## Project Structure

```text
QueueLess/
├── src/
│   ├── components/
│   ├── context/
│   └── services/
│
├── backend/
│   └── src/
│       ├── agent.ts
│       ├── campusData.ts
│       ├── decisionEngine.ts
│       ├── server.ts
│       └── tools/
│
├── queueless-aws/
│   ├── src/
│   │   └── handlers/
│   │       └── queueless-api.mjs
│   ├── template.yaml
│   └── samconfig.toml
│
└── README.md
```

---

## Running the Frontend Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Building for Production

```bash
npm run build
```

The production build is generated in:

```text
dist/
```

---

## Deploying the AWS Backend

The serverless backend is defined in:

```text
queueless-aws/template.yaml
```

Build with:

```bash
sam build --no-cached
```

Deploy with:

```bash
sam deploy
```

The production API is exposed through API Gateway.

---

## Individual Project

QueueLess was designed, built, tested, and deployed as a **solo project**.

The work included:

- Problem identification
- Product and UX design
- Frontend development
- Decision engine implementation
- Queue management
- AWS architecture
- Lambda/API implementation
- DynamoDB integration
- Amplify deployment
- Testing and debugging
- Documentation and demo preparation

---

## Hackathon

Built for **First Commit — AWS / WeMakeDevs**.

The project focuses on solving a practical campus problem using AWS serverless infrastructure.

---

## Future Scope

Potential extensions include:

- Real campus service integrations
- Real-time queue sensors
- Notifications when the recommended departure window begins
- Personalized travel estimates
- Demand forecasting
- Multiple campus support
- Alternative counter recommendations
- Natural-language assistance for students

---

## License

This project is intended as a hackathon project and demonstration.
