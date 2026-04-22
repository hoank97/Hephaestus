---
question: "What is the N+1 query problem and how do you fix it?"
answer: "The N+1 query problem happens when an application runs 1 query to fetch a list of records, then runs N additional queries (one per record) to fetch related data. Fix it with eager loading, joins, batching, or caching to reduce round trips to the database."
tags: ["database", "n-plus-one", "performance", "sql", "backend"]
pubDatetime: 2026-04-22T11:04:00Z
featured: false
---

The N+1 query problem is a common database performance issue in ORMs and data-access layers.

**How it happens:**
- Query 1: fetch N parent records (e.g., posts)
- Queries 2..N+1: fetch related record(s) for each parent (e.g., author for each post)

Example:
- `SELECT * FROM posts LIMIT 100;` (1 query)
- then 100 times: `SELECT * FROM users WHERE id = ?;` (100 queries)
- Total: **101 queries** instead of 1–2

**Why it is bad:**
- High latency from many DB round trips
- Increased DB load and connection pressure
- Poor scalability under traffic

**How to fix it:**

1. **Eager loading (ORM include/preload):**
- Load related data in the same operation
- Example patterns: `include`, `preload`, `select_related`, `prefetch_related`

2. **SQL JOINs:**
- Fetch parent + related data in one query
- Use `LEFT JOIN` when related data may be missing

3. **Batch loading (IN query):**
- Fetch all related rows at once
- Example: `SELECT * FROM users WHERE id IN (...)`
- Common in GraphQL via DataLoader pattern

4. **Caching:**
- Cache frequently used related entities
- Useful when many parents reference the same child

5. **Pagination + projection:**
- Limit records per request
- Select only required columns to reduce payload

**How to detect N+1:**
- Enable SQL query logs in development
- Use APM/profiling tools (New Relic, Datadog, etc.)
- Count queries per endpoint/request in tests

**Rule of thumb:**
If query count grows linearly with number of returned records, you likely have N+1.

**Best practice:**
Design repository/service methods to return fully-needed read models for each endpoint, so callers do not trigger lazy-loading loops accidentally.
