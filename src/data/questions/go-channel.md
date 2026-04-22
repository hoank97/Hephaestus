---
question: "What is a Go channel and when should you use it?"
answer: "Channel is Go's typed conduit for goroutine communication. Use for passing data between workers, signaling events, or coordinating concurrency. Prefer channels over shared memory when communication pattern is clear."
tags: ["go"]
pubDatetime: 2026-04-22T10:50:00Z
featured: false
---

## Core Concept

`ch <- v` sends, `v := <-ch` receives. Type-safe (`chan int`, `chan string`). Blocks until counterpart ready (unbuffered) or buffer full/empty (buffered).

## When to Use

**Use channels for:**
- Worker pools (distribute jobs across goroutines)
- Event signaling (`done` channel, close to broadcast)
- Pipeline patterns (fan-out/fan-in)
- Rate limiting (buffered channel as semaphore)

**Don't use when:**
- Simple counter/flag (use `sync/atomic` instead)
- Protecting complex state (use `sync.Mutex` instead)
- No actual communication needed (just synchronization → `sync.WaitGroup`)

## Common Pitfalls

**Deadlock:** Send/receive on same goroutine without buffer.  
**Goroutine leak:** Sender blocked forever after receiver exits (timeout case).  
**Fix:** Use buffered channel (size 1) for async send, or `select` with `default`/timeout.

**Forgotten close:** `range ch` blocks forever if sender never closes.  
**Fix:** Always close from sender side. Never close from receiver (panic if sender still writing).

## Production Pattern

```go
// Worker pool with graceful shutdown
jobs := make(chan Job, 100)
results := make(chan Result, 100)
ctx, cancel := context.WithCancel(context.Background())

for w := 0; w < 10; w++ {
    go func() {
        for {
            select {
            case job := <-jobs:
                results <- process(job)
            case <-ctx.Done():
                return
            }
        }
    }()
}
```

**Rule:** Prefer `context.Context` for cancellation over custom `done chan struct{}`.
