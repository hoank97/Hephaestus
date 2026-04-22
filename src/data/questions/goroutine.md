---
question: "What is a Goroutine and how does it differ from threads?"
answer: "A goroutine is a lightweight, independently executing function managed by the Go runtime. Unlike OS threads, goroutines have smaller stack sizes (starting at ~2KB vs 1-2MB), are multiplexed onto fewer OS threads by the Go scheduler, and have much lower creation and context-switching overhead."
tags: ["go", "goroutine", "concurrency", "golang", "threading"]
pubDatetime: 2026-04-22T10:52:00Z
featured: false
---

Goroutines are Go's fundamental unit of concurrency, enabling thousands or millions of concurrent tasks efficiently.

**Key characteristics:**
- Launched with `go functionName()` or `go func() { ... }()`
- Managed by Go runtime scheduler, not OS
- Start with ~2KB stack that grows/shrinks dynamically
- Cheap to create (thousands cost less than dozens of OS threads)

**Goroutine vs OS Thread:**
- **Goroutines:** lightweight, runtime-scheduled, cooperative multitasking
- **OS Threads:** heavyweight, kernel-scheduled, preemptive multitasking
- Go multiplexes many goroutines onto a small pool of OS threads (M:N scheduling)

**How the scheduler works:**
- Uses work-stealing algorithm across processor cores
- Goroutines yield at function calls, channel ops, blocking syscalls
- No manual thread management needed

**Common patterns:**
- Fire-and-forget: `go doWork()`
- Wait for completion: use `sync.WaitGroup` or channels
- Bounded concurrency: worker pools with semaphore or buffered channels

**Pitfalls to avoid:**
- Goroutine leaks (goroutines blocked forever on channels)
- Race conditions (use `go run -race` to detect)
- Forgetting to wait for goroutines before `main()` exits
- Capturing loop variables incorrectly in closures

**Best practices:**
- Always have a clear lifecycle and exit condition
- Use `context.Context` for cancellation propagation
- Limit goroutine count for resource-intensive tasks
- Profile with `pprof` to detect leaks and bottlenecks
