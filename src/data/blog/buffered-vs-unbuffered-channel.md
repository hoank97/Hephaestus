---
title: "What is the difference between buffered and unbuffered channels in Go?"
description: "Unbuffered channel (`make(chan T)`) blocks sender until receiver is ready (synchronous handoff). Buffered channel (`make(chan T, n)`) allows sends until buffer is full (asynchronous up to capacity). Unbuffered gives strict synchronization; buffered gives higher throughput but weaker timing guarantees."
tags: ["go"]
pubDatetime: 2026-04-22T11:06:00Z
featured: false
draft: true
---

## Core Difference

**Unbuffered (capacity 0):** send/receive rendezvous at same moment.  
**Buffered (capacity n):** sender proceeds until queue full.

| Aspect | Unbuffered | Buffered |
|---|---|---|
| Send blocks when | no receiver ready | buffer full |
| Receive blocks when | no sender ready | buffer empty |
| Best for | synchronization | throughput smoothing |

## When to Use

**Unbuffered:**
- Strict handoff semantics needed
- Coordination/signaling (`done`, request-response)
- Simpler concurrency reasoning

**Buffered:**
- Producer faster than consumer
- Worker queues
- Semaphore/rate limiting (`chan struct{}, n`)
- Prevent goroutine leak in timeout pattern (`cap=1`)

## Pitfalls

**Unbuffered deadlock:**
```go
ch := make(chan int)
ch <- 1 // blocks forever if no receiver
```

**Buffered false safety:**
```go
ch := make(chan int, 10)
for i := 0; i < 100; i++ { ch <- i } // still blocks at 11th send
```

**Oversized buffer:** hides backpressure, increases memory, delays failure signals.

## Rule of Thumb

- Start unbuffered for correctness.
- Add buffer only when profiling shows contention/throughput bottleneck.
- Prefer small, intentional buffer sizes tied to real capacity (workers, queue depth)."
