---
question: "What is a Go channel and when should you use it?"
answer: "A Go channel is a typed conduit that lets goroutines communicate safely by sending and receiving values, and it should be used to coordinate concurrent work, pass data between workers, and control synchronization without shared-memory locks where possible."
tags: ["go", "channel", "concurrency", "golang"]
pubDatetime: 2026-04-22T10:50:00Z
featured: false
---

A channel in Go is a built-in concurrency primitive used for communication between goroutines.

**Core idea:**
- `ch <- v` sends value `v` to channel `ch`
- `v := <-ch` receives a value from channel `ch`
- Channels are type-safe (`chan int`, `chan string`, etc.)

**Why channels matter:**
- Avoids direct shared-memory coordination in many cases
- Makes producer/consumer flows explicit
- Helps synchronize goroutines naturally

**Buffered vs unbuffered:**
- **Unbuffered channel:** send blocks until a receiver is ready
- **Buffered channel:** send blocks only when buffer is full

**Common patterns:**
- Worker pools
- Fan-out / fan-in pipelines
- Timeout and cancellation with `select`
- Signaling completion via `done` channels or `context.Context`

**Best practices:**
- Close channels only from the sender side
- Use `select` for non-blocking or multi-channel coordination
- Prefer `context.Context` for cancellation across APIs
- Keep channel ownership and lifecycle clear to avoid leaks/deadlocks
