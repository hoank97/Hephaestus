---
question: "What are the key considerations for Microservices Architecture & Scaling?"
answer: "Service decomposition by business domain, independent deployment/scaling per service, distributed data management (database-per-service), async communication (message queues), observability (tracing/logging), and fault isolation (circuit breakers). Trade-off: operational complexity vs team autonomy."
tags: ["microservices"]
pubDatetime: 2026-04-22T10:45:00Z
featured: false
---

## Core Principles

1. **Decompose by domain** (DDD) — not by technical layer
2. **Database per service** — avoid shared DB (bottleneck + coupling)
3. **Independent deploy** — each service has own CI/CD pipeline
4. **Scale independently** — only scale bottleneck services

## Scaling Strategies

**Horizontal scaling:**
- Add instances behind load balancer
- Stateless services (session in Redis/DB)
- Auto-scale based on CPU/memory/queue depth

**Data scaling:**
- Read replicas for read-heavy services
- Sharding for write-heavy (partition by user ID, region)
- CQRS for complex read patterns

## Communication Patterns

**Sync (REST/gRPC):** Simple but creates tight coupling. Use for low-latency reads.  
**Async (Kafka/RabbitMQ):** Decouples services, handles backpressure. Use for events/commands.  
**Saga pattern:** Distributed transactions via compensating actions (not 2PC).

## Production Gotchas

**Cascading failures:** Service A down → Service B retries → overloads Service C.  
**Fix:** Circuit breaker (fail fast after N errors), timeout (kill slow calls), bulkhead (isolate thread pools).

**Distributed tracing:** Single request spans 5+ services. Without trace ID, debugging is impossible.  
**Fix:** OpenTelemetry, Jaeger. Inject trace ID in all logs.

**Data consistency:** No ACID across services. Eventual consistency via events.  
**Fix:** Idempotent handlers (dedupe by message ID), outbox pattern (atomic DB write + event publish).

## When NOT to Use

- Team <10 people (coordination overhead > benefit)
- Simple domain (CRUD app doesn't need microservices)
- No DevOps expertise (will drown in operational complexity)

**Rule:** Start monolith. Extract microservices when team/domain/scaling demands it.
