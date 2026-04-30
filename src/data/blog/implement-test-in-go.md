---
title: "How do you implement tests in Go?"
description: "Tests live in `*_test.go` files with `TestXxx(t *testing.T)` functions. Run with `go test`. Use table-driven tests for multiple cases, `t.Run()` for subtests, and `-race` flag to detect concurrency bugs."
tags: ["testing"]
pubDatetime: 2026-04-22T10:56:00Z
featured: false
draft: true
---

## Basic Structure

```go
// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}
```

## Table-Driven (Idiomatic)

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.expected {
                t.Errorf("got %d, want %d", got, tt.expected)
            }
        })
    }
}
```

## Common Commands

```bash
go test              # current package
go test ./...        # all packages
go test -v           # verbose
go test -run TestAdd # specific test
go test -cover       # coverage
go test -race        # race detector (always use in CI)
```

## Testing Errors

```go
result, err := Divide(10, 0)
if err == nil {
    t.Fatal("expected error for division by zero")
}
```

## Mocking with Interfaces

```go
type Database interface {
    Get(key string) (string, error)
}

type MockDB struct {
    data map[string]string
}

func (m *MockDB) Get(key string) (string, error) {
    val, ok := m.data[key]
    if !ok {
        return "", errors.New("not found")
    }
    return val, nil
}
```

## HTTP Testing

```go
req := httptest.NewRequest("GET", "/api/users", nil)
w := httptest.NewRecorder()
handler(w, req)

if w.Code != http.StatusOK {
    t.Errorf("got status %d, want %d", w.Code, http.StatusOK)
}
```

## Best Practices

- One `*_test.go` per source file
- Use table-driven tests for multiple scenarios
- Test both success and error cases
- Use `t.Helper()` for test utilities
- Run with `-race` in CI/CD
- Aim for meaningful coverage, not 100%

**Rule:** If you can't test it easily, your design is probably too coupled.
