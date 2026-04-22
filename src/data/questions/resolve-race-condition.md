---
question: "How do you resolve race conditions in concurrent programming?"
answer: "Resolve race conditions by using synchronization primitives like mutexes, atomic operations, or channels to ensure only one goroutine accesses shared data at a time. In Go, prefer channels for communication and mutexes for protecting shared state."
tags: ["concurrency", "race-condition", "go", "synchronization", "mutex"]
pubDatetime: 2026-04-22T11:02:00Z
featured: false
---

Race conditions occur when multiple threads or goroutines access shared data concurrently, and at least one modifies it, leading to unpredictable behavior.

**Detecting race conditions:**

```bash
# Go's built-in race detector
go test -race
go run -race main.go
go build -race
```

**Common race condition example:**

```go
// WRONG - race condition
var counter int

func increment() {
    counter++  // NOT atomic: read, increment, write
}

func main() {
    for i := 0; i < 1000; i++ {
        go increment()
    }
    time.Sleep(time.Second)
    fmt.Println(counter)  // unpredictable result
}
```

---

**Solution 1: Mutex (Mutual Exclusion)**

Use when protecting shared state:

```go
import "sync"

var (
    counter int
    mu      sync.Mutex
)

func increment() {
    mu.Lock()
    counter++
    mu.Unlock()
}

// Or use defer for safety
func increment() {
    mu.Lock()
    defer mu.Unlock()
    counter++
}
```

**RWMutex for read-heavy workloads:**

```go
var (
    data map[string]int
    mu   sync.RWMutex
)

func read(key string) int {
    mu.RLock()
    defer mu.RUnlock()
    return data[key]
}

func write(key string, value int) {
    mu.Lock()
    defer mu.Unlock()
    data[key] = value
}
```

---

**Solution 2: Atomic Operations**

Use for simple counters and flags:

```go
import "sync/atomic"

var counter int64

func increment() {
    atomic.AddInt64(&counter, 1)
}

func get() int64 {
    return atomic.LoadInt64(&counter)
}

// Atomic compare-and-swap
func setIfZero(newValue int64) bool {
    return atomic.CompareAndSwapInt64(&counter, 0, newValue)
}
```

---

**Solution 3: Channels**

Use for communication and coordination:

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Start workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= 9; a++ {
        <-results
    }
}
```

---

**Solution 4: sync.Once**

Ensure initialization happens exactly once:

```go
var (
    instance *Singleton
    once     sync.Once
)

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}
```

---

**Solution 5: Context for cancellation**

Prevent race conditions during shutdown:

```go
func worker(ctx context.Context, data *shared) {
    for {
        select {
        case <-ctx.Done():
            return  // clean exit
        default:
            // do work safely
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    go worker(ctx, sharedData)
    
    // Later...
    cancel()  // signal all workers to stop
}
```

---

**Solution 6: Immutable data**

Avoid races by not sharing mutable state:

```go
// Instead of modifying shared state
type Config struct {
    mu    sync.RWMutex
    value string
}

// Use immutable updates
type Config struct {
    value atomic.Value  // stores *ConfigData
}

type ConfigData struct {
    Setting string
}

func (c *Config) Update(newData *ConfigData) {
    c.value.Store(newData)  // atomic swap
}

func (c *Config) Get() *ConfigData {
    return c.value.Load().(*ConfigData)
}
```

---

**Best practices:**

1. **Detect early:** Always run tests with `-race` flag in CI/CD
2. **Minimize shared state:** Prefer message passing over shared memory
3. **Keep critical sections small:** Lock only what's necessary
4. **Avoid nested locks:** Can lead to deadlocks
5. **Use defer with mutexes:** Ensures unlock even on panic
6. **Document locking strategy:** Comment which mutex protects which data
7. **Prefer higher-level primitives:** Use `sync.Map`, `sync.Pool` when appropriate
8. **Consider lock-free algorithms:** For performance-critical code

---

**Common patterns:**

**Pattern 1: Protecting a map:**
```go
type SafeMap struct {
    mu sync.RWMutex
    m  map[string]int
}

func (sm *SafeMap) Get(key string) (int, bool) {
    sm.mu.RLock()
    defer sm.mu.RUnlock()
    val, ok := sm.m[key]
    return val, ok
}

func (sm *SafeMap) Set(key string, value int) {
    sm.mu.Lock()
    defer sm.mu.Unlock()
    sm.m[key] = value
}
```

**Pattern 2: Worker pool with bounded concurrency:**
```go
func process(items []Item) {
    sem := make(chan struct{}, 10)  // max 10 concurrent
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            sem <- struct{}{}        // acquire
            defer func() { <-sem }() // release
            
            // process item safely
        }(item)
    }
    
    wg.Wait()
}
```

---

**Debugging tips:**

- Use `GOMAXPROCS=1` to make races more deterministic during debugging
- Add logging with goroutine IDs: `runtime.NumGoroutine()`
- Use `pprof` to detect goroutine leaks
- Check for data races in dependencies: `go list -deps -json | jq -r '.Deps[]'`

**Key principle:** "Don't communicate by sharing memory; share memory by communicating" (Go proverb)
