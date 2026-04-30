---
title: "What is the N+1 query problem and how do you fix it?"
description: "N+1 happens when you fetch a list with 1 query, then execute N extra queries for related data (one per row). Fix with eager loading, JOIN, or batched `IN (...)` query to collapse round trips from O(N) to O(1)."
tags: ["database"]
pubDatetime: 2026-04-22T11:04:00Z
featured: false
draft: false
---

## Why It Hurts

Example: 100 posts + author per post → 101 queries instead of 1-2.  
Latency and DB load grow linearly with result size.

## Fix Strategies

1. **Eager loading (ORM):** `include`, `preload`, `select_related`  
2. **JOIN:** fetch parent + related in one query  
3. **Batch load:** `SELECT * FROM users WHERE id IN (...)` (DataLoader pattern)

## Trade-offs

- **JOIN:** fastest for small-medium datasets, but can duplicate rows on one-to-many
- **Batch (`IN`)**: avoids row explosion, better for nested relations
- **Eager load everything:** may over-fetch and waste memory

## Detection in Production

- Track query count per request (APM)
- Log slow endpoints with SQL count
- Rule: query count should not scale linearly with returned rows

**Rule:** Design repository methods to return exactly the read model endpoint needs. Never rely on lazy loading inside loops.
