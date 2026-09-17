# QueueLess

### Intelligent Campus Visit Decision Assistant

QueueLess answers one simple question:

> **"Should I go now?"**

Students often waste time travelling to campus offices only to discover a long queue, missing documents, or insufficient time before the office closes.

QueueLess combines service requirements, live queue state, estimated waiting time, travel time, service duration, and office closing time to recommend:

- **GO** — leave now
- **WAIT** — leave later when the queue is more favorable
- **DON'T GO** — the visit cannot be completed successfully right now

---

## The Problem

Campus services such as certificates, records, fee payments, and ID services are often unpredictable.

A student may:

1. Travel to the office
2. Discover a long queue
3. Wait unnecessarily
4. Realize a required document is missing
5. Reach the counter too late

QueueLess turns this into a decision-making problem instead of a guessing game.

---

## How QueueLess Works

```text
Student selects a service
        ↓
Check required documents
        ↓
Read current queue state
        ↓
Estimate waiting + travel + service time
        ↓
Compare with office closing time
        ↓
GO / WAIT / DON'T GO
        ↓
Recommended departure time
        ↓
Live queue tracking