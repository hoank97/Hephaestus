---
question: "What is the difference between buffered and unbuffered channels in Go?"
answer: "Unbuffered channels block the sender until a receiver is ready (synchronous), while buffered channels allow sends without blocking until the buffer is full (asynchronous up to capacity). Unbuffered channels provide synchronization guarantees; buffered channels improve throughput by decoupling sender and receiver timing."
tags: ["go", "channel", "concurrency", "golang", "buffered-channel"]
pubDatetime: 2026-04-22T11:06:00Z
featured: false
---

Channels are Go's primary mechanism for goroutine communication. Understanding buffered vs unbuffered channels is crucial for effective concurrent programming.

---

## Unbuffered Channels

**Creation:**
```go
ch := make(chan int)  // unbuffered (capacity 0)
```

**Behavior:**
- Send blocks until receiver is ready
- Receive blocks until sender sends
- Provides **synchronization point** between goroutines
- Guarantees sender and receiver meet at the same moment

**Example:**
```go
ch := make(chan int)

go func() {
    fmt.Println("Sending...")
    ch <- 42  // blocks until main receives
    fmt.Println("Sent!")
}()

time.Sleep(time.Second)  // goroutine waits here
value := <-ch            // unblocks sender
fmt.Println("Received:", value)

// Output:
// Sending...
// (1 second pause)
// Received: 42
// Sent!
```

**Use cases:**
- Synchronization between goroutines
- Signaling completion or events
- Ensuring sequential execution
- Handoff patterns where timing matters

---

## Buffered Channels

**Creation:**
```go
ch := make(chan int, 3)  // buffered with capacity 3
```

**Behavior:**
- Send blocks only when buffer is full
- Receive blocks only when buffer is empty
- Decouples sender and receiver timing
- Acts as a queue with fixed capacity

**Example:**
```go
ch := make(chan int, 2)  // capacity 2

ch <- 1  // doesn't block, buffer has space
ch <- 2  // doesn't block, buffer now full
// ch <- 3  // would block, buffer full

fmt.Println(<-ch)  // 1
fmt.Println(<-ch)  // 2
```

**Use cases:**
- Producer-consumer patterns with rate mismatch
- Reducing goroutine blocking
- Batching operations
- Limiting concurrent operations (semaphore pattern)

---

## Key Differences

| Aspect | Unbuffered | Buffered |
|--------|-----------|----------|
| **Capacity** | 0 | > 0 |
| **Send blocks when** | No receiver ready | Buffer full |
| **Receive blocks when** | No sender ready | Buffer empty |
| **Synchronization** | Strong (rendezvous) | Weak (async up to capacity) |
| **Throughput** | Lower (tight coupling) | Higher (decoupled) |
| **Memory** | Minimal | Proportional to capacity |
| **Use for** | Coordination, signaling | Throughput, rate smoothing |

---

## Deep Dive: Internal Mechanics

**Channel structure (simplified):**
```go
type hchan struct {
    qcount   uint           // total data in queue
    dataqsiz uint           // size of circular queue
    buf      unsafe.Pointer // points to array of dataqsiz elements
    sendx    uint           // send index
    recvx    uint           // receive index
    recvq    waitq          // list of recv waiters
    sendq    waitq          // list of send waiters
    lock     mutex
}
```

**Unbuffered (dataqsiz = 0):**
- No buffer array allocated
- Send/receive directly hand off value
- Goroutines park in sendq/recvq until matched

**Buffered (dataqsiz > 0):**
- Circular buffer allocated
- Send copies to buf[sendx], increments sendx
- Receive copies from buf[recvx], increments recvx
- Only blocks when buffer full/empty

---

## Common Patterns

**Pattern 1: Semaphore (limit concurrency)**
```go
// Limit to 10 concurrent operations
sem := make(chan struct{}, 10)

for _, task := range tasks {
    sem <- struct{}{}  // acquire
    go func(t Task) {
        defer func() { <-sem }()  // release
        process(t)
    }(task)
}
```

**Pattern 2: Worker pool**
```go
jobs := make(chan Job, 100)     // buffered for throughput
results := make(chan Result, 100)

// Workers
for w := 0; w < numWorkers; w++ {
    go func() {
        for job := range jobs {
            results <- process(job)
        }
    }()
}

// Producer
for _, job := range allJobs {
    jobs <- job
}
close(jobs)

// Consumer
for i := 0; i < len(allJobs); i++ {
    result := <-results
    handle(result)
}
```

**Pattern 3: Done signal (unbuffered)**
```go
done := make(chan struct{})

go func() {
    defer close(done)
    // do work
}()

<-done  // wait for completion
```

**Pattern 4: Timeout with buffered channel**
```go
// Buffered prevents goroutine leak if timeout occurs
ch := make(chan Result, 1)

go func() {
    ch <- expensiveOperation()
}()

select {
case result := <-ch:
    return result
case <-time.After(time.Second):
    return ErrTimeout
}
// goroutine can still send to ch without blocking
```

---

## Performance Considerations

**Unbuffered:**
- More context switches (goroutines block frequently)
- Better for low-latency, low-throughput scenarios
- Simpler reasoning about happens-before relationships

**Buffered:**
- Fewer context switches (goroutines block less)
- Better for high-throughput scenarios
- Can hide timing bugs (works in test, fails in prod)
- Memory overhead: capacity × element size

**Benchmark example:**
```go
// Unbuffered: ~500ns per send-receive pair
// Buffered (cap 100): ~50ns per send-receive pair
// (when buffer not full/empty)
```

---

## Choosing Buffer Size

**Too small:**
- Frequent blocking
- Defeats purpose of buffering

**Too large:**
- Wastes memory
- Hides backpressure issues
- Delays error detection

**Guidelines:**
1. **Start unbuffered** unless you have a reason
2. **Match expected burst size** (e.g., buffer = max concurrent requests)
3. **Use 1 for async notification** (prevents goroutine leak on timeout)
4. **Profile in production** to tune based on actual load

---

## Common Pitfalls

**Pitfall 1: Buffered channel as "fire and forget"**
```go
// WRONG - can still block if buffer fills
ch := make(chan Event, 10)
for i := 0; i < 100; i++ {
    ch <- Event{}  // blocks at i=10
}
```

**Pitfall 2: Unbuffered with no receiver**
```go
// WRONG - deadlock
ch := make(chan int)
ch <- 42  // blocks forever, no receiver
```

**Pitfall 3: Wrong buffer size causes goroutine leak**
```go
// WRONG - goroutine leaks if timeout occurs
ch := make(chan Result)  // unbuffered

go func() {
    ch <- slowOperation()  // blocks forever if no receiver
}()

select {
case r := <-ch:
    return r
case <-time.After(time.Second):
    return nil  // goroutine still blocked on send
}

// FIX: use buffered channel
ch := make(chan Result, 1)
```

---

## Advanced: Select with Multiple Channels

```go
func worker(jobs <-chan Job, results chan<- Result, done <-chan struct{}) {
    for {
        select {
        case job, ok := <-jobs:
            if !ok {
                return  // jobs closed
            }
            results <- process(job)
        case <-done:
            return  // cancellation signal
        }
    }
}
```

---

## Testing Channels

```go
func TestChannel(t *testing.T) {
    ch := make(chan int, 2)
    
    // Test non-blocking send
    select {
    case ch <- 1:
        // ok
    default:
        t.Fatal("should not block")
    }
    
    // Test receive
    select {
    case val := <-ch:
        if val != 1 {
            t.Errorf("got %d, want 1", val)
        }
    case <-time.After(time.Second):
        t.Fatal("timeout")
    }
}
```

---

## Summary

**Use unbuffered when:**
- You need synchronization guarantees
- Signaling events or completion
- Low message rate
- Simplicity matters

**Use buffered when:**
- Decoupling sender/receiver timing
- High throughput required
- Known burst patterns
- Implementing semaphores or rate limiting

**Golden rule:** Start with unbuffered. Add buffering only when profiling shows it's needed. Premature buffering can hide bugs and complicate reasoning about concurrency.
