---
question: "What causes deadlock in Go channels and how do you avoid it?"
answer: "Deadlock = all goroutines blocked on channels with no way forward. Causes: unbuffered send with no receiver, circular wait, forgotten close. Fix: balance senders/receivers, close from sender, use buffered channels, or select with timeout/default."
tags: ["go"]
pubDatetime: 2026-04-22T10:54:00Z
featured: false
---

## Common Causes

**1. Unbuffered send, no receiver:**
```go
ch := make(chan int)
ch <- 42  // blocks forever
```

**2. Circular wait:**
```go
ch1, ch2 := make(chan int), make(chan int)
go func() { ch1 <- <-ch2 }()
go func() { ch2 <- <-ch1 }()
// Each waits for the other
```

**3. Forgotten close:**
```go
for val := range ch {  // blocks forever if ch never closes
    process(val)
}
```

## Prevention

**Balance senders/receivers:**
```go
ch := make(chan int)
go func() { ch <- 42 }()  // sender in goroutine
val := <-ch                // receiver in main
```

**Use buffered channel:**
```go
ch := make(chan int, 1)
ch <- 42  // doesn't block
```

**Always close from sender:**
```go
go func() {
    for i := 0; i < 10; i++ {
        ch <- i
    }
    close(ch)  // signals done
}()
for val := range ch {  // exits when closed
    process(val)
}
```

**Select with timeout:**
```go
select {
case ch <- value:
    // sent
case <-time.After(time.Second):
    return ErrTimeout
case <-ctx.Done():
    return ctx.Err()
}
```

## Detection

Go runtime panics: `fatal error: all goroutines are asleep - deadlock!`

**Debug:** Enable `GODEBUG=schedtrace=1000` to see goroutine states. Use `pprof` goroutine profile to find blocked goroutines.

**Rule:** Document channel ownership (who sends, who receives, who closes). Prefer `context.Context` for cancellation over custom done channels.
