---
title: "What is a Goroutine and how does it differ from threads?"
description: "Goroutine is a lightweight function managed by Go runtime (~2KB stack vs 1-2MB for OS threads). Go multiplexes thousands of goroutines onto few OS threads (M:N scheduling). Cheaper to create, faster context switch, but requires explicit coordination to avoid leaks."
tags: ["go"]
pubDatetime: 2026-04-22T10:52:00Z
featured: false
draft: true
---

## Core Difference

**Goroutine:** Runtime-scheduled, cooperative (yields at function calls/channel ops), ~2KB initial stack.  
**OS Thread:** Kernel-scheduled, preemptive, 1-2MB fixed stack.

**Cost:** Creating 10k goroutines ≈ 20MB. Creating 10k threads ≈ 10-20GB + kernel overhead.

## When to Use

**Use goroutines for:**
- I/O-bound tasks (HTTP requests, DB queries)
- Event handlers (one goroutine per connection)
- Background workers (async processing)

**Don't spawn unlimited goroutines:**
- CPU-bound tasks → limit to `runtime.NumCPU()`
- Resource-intensive ops → use worker pool with bounded concurrency

## Common Pitfalls

**Goroutine leak:** Launched but never exits (blocked on channel, waiting forever).  
**Detection:** `runtime.NumGoroutine()` keeps growing. Use `pprof` goroutine profile.  
**Fix:** Always provide exit path via `context.Context` or `done` channel.

**Race condition:** Multiple goroutines access shared variable without sync.  
**Detection:** `go test -race` (always run in CI).  
**Fix:** Use `sync.Mutex`, `sync/atomic`, or channels.

**Loop variable capture (Go <1.22):**
```go
// WRONG
for _, item := range items {
    go func() { process(item) }() // all see last item
}
// FIX
for _, item := range items {
    item := item // capture
    go func() { process(item) }()
}
```

## Production Pattern

```go
// Bounded worker pool
sem := make(chan struct{}, 100) // max 100 concurrent
var wg sync.WaitGroup

for _, task := range tasks {
    wg.Add(1)
    sem <- struct{}{} // acquire
    go func(t Task) {
        defer wg.Done()
        defer func() { <-sem }() // release
        process(t)
    }(task)
}
wg.Wait()
```

**Rule:** If goroutine count unbounded, you have a resource leak waiting to happen.
