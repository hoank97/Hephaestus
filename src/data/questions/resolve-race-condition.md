---
question: "How do you resolve race conditions in concurrent programming?"
answer: "Use synchronization primitives to protect shared state: `sync.Mutex` for complex shared data, `sync/atomic` for simple counters/flags, channels for ownership transfer. Always detect with `go test -race` and fix data access paths, not symptoms."
tags: ["go"]
pubDatetime: 2026-04-22T11:02:00Z
featured: false
---

## Detect First

```bash
go test -race
go run -race main.go
```

If race detector reports concurrent read/write on same variable, treat as correctness bug (not just performance issue).

## Choose the Right Primitive

**`sync.Mutex`** — protect complex shared state (maps, structs).
```go
mu.Lock()
counter++
mu.Unlock()
```

**`sync/atomic`** — simple counters/flags.
```go
atomic.AddInt64(&counter, 1)
```

**Channels** — transfer ownership instead of sharing memory.
```go
jobs <- task // worker owns and mutates local state
```

## Common Pitfalls

- Reading without lock while writes are locked (still race)
- Copying struct containing mutex (undefined behavior)
- Using `RWMutex` too early (often slower under write-heavy load)
- "Fire-and-forget" goroutines updating shared state without sync

## Production Practice

- Run `-race` in CI on critical packages
- Keep lock scope minimal but correct
- Document which lock protects which field
- Prefer immutability + copy-on-write for config/state snapshots

**Rule:** Either guard all access to shared mutable state, or remove sharing entirely.
