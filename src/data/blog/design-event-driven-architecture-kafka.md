---
title: "System Design: Event-Driven Architecture with Kafka + Outbox"
pubDatetime: 2026-04-22T00:00:00Z
description: "Design practical event-driven architecture with Outbox pattern, schema evolution, idempotency, and DLQ on Kafka."
author: "Hoan K"
tags:
  - "system-design"
  - "event-driven"
  - "kafka"
  - "microservices"
featured: true
draft: false
---

Event-driven architecture reduces coupling between services, but poor design creates systems that are hard to debug and inconsistent.

## 1) Problem Statement
Transition from monolith/sync microservices to async event bus to:
- Increase throughput
- Separate domains more clearly
- Allow multiple independent consumers

## 2) Core Architecture
```mermaid
flowchart LR
SVC[Order Service] --> DB[(Order DB)]
DB --> OUT[(Outbox)]
OUT --> CDC[CDC Connector]
CDC --> K[(Kafka)]
K --> INV[Inventory]
K --> BILL[Billing]
K --> NOTI[Notification]
K --> ANA[Analytics]
ANA --> DLQ[(DLQ)]
```

## 3) Why Outbox?
If the app both `updates DB` and `publishes event` directly, there's a dual-write risk:
- DB commits successfully, publish fails → lost event
- Publish succeeds, DB rolls back → event reflects wrong truth

**Outbox pattern**: write event to DB in same transaction, CDC publishes to Kafka afterward.

## 4) Topic & Schema Design
- Topics by domain: `order.created`, `payment.completed`
- Partition key by `order_id` to maintain local ordering
- Use schema registry to evolve schemas without breaking old consumers

## 5) Idempotency
Consumers always assume events can be redelivered.
- Store processed `event_id`
- Upsert instead of pure insert
- Side effects (email, payment) need dedupe key

## 6) Failure Modes
- Consumer lag increases: autoscale + tune batch size
- Poison message: send to DLQ + manual replay
- Broker outage: retry + backpressure upstream

```mermaid
sequenceDiagram
participant P as Producer
participant K as Kafka
participant C as Consumer
participant D as Dedupe Store

P->>K: publish(event_id=123)
K->>C: deliver event
C->>D: check event_id
D-->>C: not processed
C->>C: process business logic
C->>D: mark processed
```

## 7) Checklist
- [ ] Outbox + CDC enabled
- [ ] Consumer idempotent
- [ ] DLQ + replay tool
- [ ] Schema compatibility policy
- [ ] Lag/error dashboard

## Conclusion
Event-driven isn't just "use Kafka". Success depends on: **Outbox, idempotency, schema governance, DLQ operations**.
