---
title: "Monolith, Modular Monolith, or Microservices?"
description: "Start with a monolith. Split into a modular monolith as the codebase grows. Move to microservices only when you have proven team scaling needs, independent deployability requirements, and the operational maturity to support distributed systems."
tags: ["system-design", "architecture"]
pubDatetime: 2026-04-30T00:00:00Z
featured: false
draft: false
---

## Decision Framework: Monolith vs Modular Monolith vs Microservices

Choosing an architecture is not about which is "better" — it's about which fits your team, product stage, and scaling requirements. The general recommendation is **start simple, evolve as needed**.

### 1. Monolith

All functionality lives in a single codebase and deploys as one unit.

**When to choose:**
- Early-stage startup or new product
- Small team (1–10 developers)
- Unclear domain boundaries
- Need for rapid iteration and validation
- Limited operational infrastructure

**Pros:**
- Simple to develop, test, and deploy
- No network latency between components
- Easy debugging with single process
- Straightforward transactions and consistency
- Minimal infrastructure overhead

**Cons:**
- Becomes hard to maintain as it grows
- Tight coupling between features
- Single technology stack for the entire app
- One component's crash can bring down the whole system
- Scaling requires duplicating the entire app

### 2. Modular Monolith

Single deployable unit, but internally organized into well-defined modules with clear boundaries and interfaces.

**When to choose:**
- Growing team (10–30 developers)
- Codebase complexity increasing
- Want to experiment with boundaries before committing to distributed systems
- Need better code organization without operational overhead

**Pros:**
- Clear separation of concerns
- Easier to reason about and maintain
- Can evolve modules into microservices later
- No distributed system complexity
- Single database simplifies transactions

**Cons:**
- Still limited to single deployment unit
- Module boundaries can be hard to get right
- Scaling still limited by monolith deployment
- Requires discipline to maintain module boundaries
- Build times can grow with codebase size

### 3. Microservices

Each service owns a specific business capability, has its own database, and deploys independently.

**When to choose:**
- Large team (30+ developers) with multiple squads
- Proven need for independent scaling of components
- Clear domain boundaries established (usually from modular monolith experience)
- Mature DevOps and operational infrastructure
- Different technology requirements per service

**Pros:**
- Independent deployment and scaling
- Technology diversity per service
- Fault isolation (one service down ≠ system down)
- Clear ownership boundaries aligned with team structure
- Easier to replace individual components

**Cons:**
- Significant operational complexity
- Distributed transactions are hard
- Network latency between services
- Requires sophisticated monitoring and observability
- Higher infrastructure costs
- Debugging spans multiple services

## Decision Matrix

| Factor | Monolith | Modular Monolith | Microservices |
|--------|----------|-----------------|---------------|
| Team size | 1–10 | 10–30 | 30+ |
| Product stage | Early/Validation | Growing | Mature |
| Domain clarity | Low | Medium | High |
| Operational maturity | Low | Medium | High |
| Deployment frequency | Low–Medium | Medium | High |
| Scaling needs | Vertical | Vertical + Horizontal | Per-service |
| Technology diversity | Single stack | Single stack | Multiple stacks |

## Recommended Evolution Path

### Phase 1: Start with Monolith
```
Team: 1-5 devs
Goal: Validate product-market fit
Focus: Ship features fast
```

### Phase 2: Refactor to Modular Monolith
```
Team: 5-20 devs
Goal: Manage growing complexity
Focus: Establish module boundaries, improve code organization
```

### Phase 3: Extract Microservices (if needed)
```
Team: 20+ devs, multiple squads
Goal: Independent scaling and deployment
Focus: Extract modules with clear boundaries into services
```

## Key Questions to Ask Before Choosing

1. **How large is the team?** — Microservices require multiple coordinated teams to justify the overhead.
2. **What's the product stage?** — Early products need speed, not distributed complexity.
3. **Do you have DevOps maturity?** — Microservices need CI/CD, monitoring, observability, and incident response.
4. **Are domain boundaries clear?** — If you can't define bounded contexts, you'll get distributed monoliths.
5. **What's the scaling bottleneck?** — If it's one component, microservices might help. If it's everything, a monolith scales fine.

## Common Pitfalls

- **Premature microservices**: Adopting microservices before understanding domain boundaries leads to distributed monoliths that are harder to manage than a monolith.
- **Ignoring team structure**: Conway's Law applies — your architecture should mirror your team organization.
- **Underestimating operational costs**: Each microservice needs its own monitoring, logging, deployment pipeline, and incident response procedures.
- **Not starting simple**: The best architecture for most teams at most stages is simpler than they think.

## Summary

The default choice should always be the simplest architecture that meets your current needs. Most teams should start with a **monolith**, evolve to a **modular monolith** as complexity grows, and only adopt **microservices** when the team size, product maturity, and operational capabilities justify the significant additional complexity.

> You should start with a monolith, and split it when you have a good reason to, not a bad one. — Martin Fowler
