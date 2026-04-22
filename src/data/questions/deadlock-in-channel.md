---
question: "What causes deadlock in Go channels and how do you avoid it?"
answer: "Deadlock occurs when all goroutines are blocked waiting on channels with no way to proceed. Avoid it by ensuring senders and receivers are balanced, closing channels when done, using buffered channels or select with timeouts, and never sending/receiving on the same goroutine without concurrency."
tags: ["go", "channel", "deadlock", "concurrency", "golang"]
pubDatetime: 2026-04-22T10:54:00Z
featured: false
---

Channel deadlocks are one of the most common concurrency bugs in Go. Understanding the causes and prevention strategies is essential.

**Common deadlock scenarios:**

1. **Unbuffered channel with no receiver:**
```go
ch := make(chan int)
ch <- 42  // blocks forever, no receiver
```

2. **All goroutines waiting:**
```go
ch := make(chan int)
go func() { <-ch }()
go func() { <-ch }()
// No sender, both goroutines block forever
```

3. **Circular wait:**
```go
ch1, ch2 := make(chan int), make(chan int)
go func() { ch1 <- <-ch2 }()
go func() { ch2 <- <-ch1 }()
// Each waits for the other
```

4. **Forgotten close:**
```go
for val := range ch {  // blocks forever if ch never closes
    process(val)
}
```

**Detection:**
- Go runtime detects deadlock when all goroutines are blocked
- Panics with: `fatal error: all goroutines are asleep - deadlock!`
- Use `go run -race` to catch race conditions that can lead to deadlock

**Prevention strategies:**

**1. Balance senders and receivers:**
```go
ch := make(chan int)
go func() { ch <- 42 }()  // sender in goroutine
val := <-ch                // receiver in main
```

**2. Use buffered channels:**
```go
ch := make(chan int, 1)
ch <- 42  // doesn't block, buffer has space
val := <-ch
```

**3. Always close channels from sender:**
```go
go func() {
    for i := 0; i < 10; i++ {
        ch <- i
    }
    close(ch)  // signals no more values
}()
for val := range ch {  // exits when closed
    process(val)
}
```

**4. Use select with timeout/default:**
```go
select {
case ch <- value:
    // sent successfully
case <-time.After(time.Second):
    // timeout, avoid blocking forever
default:
    // non-blocking alternative
}
```

**5. Use context for cancellation:**
```go
select {
case ch <- value:
    // sent
case <-ctx.Done():
    return ctx.Err()  // exit on cancellation
}
```

**6. WaitGroup for coordination:**
```go
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        // work
    }()
}
wg.Wait()  // wait for all to finish
```

**Debugging tips:**
- Add logging before channel operations
- Use `GODEBUG=schedtrace=1000` to see goroutine states
- Profile with `pprof` goroutine profile: `go tool pprof http://localhost:6060/debug/pprof/goroutine`
- Check for goroutine leaks with runtime metrics

**Best practices:**
- Document channel ownership (who sends, who receives, who closes)
- Prefer `context.Context` for cancellation over custom done channels
- Keep channel operations simple and visible
- Test concurrent code thoroughly with race detector
- Consider using higher-level primitives (`sync.WaitGroup`, `errgroup.Group`) when appropriate
