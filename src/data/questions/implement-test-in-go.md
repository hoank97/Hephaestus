---
question: "How do you implement tests in Go?"
answer: "Go tests live in `*_test.go` files with functions named `TestXxx(t *testing.T)`. Run them with `go test`. Use table-driven tests for multiple cases, subtests for organization, and the testing package's assertion methods for validation."
tags: ["go", "testing", "golang", "unit-test"]
pubDatetime: 2026-04-22T10:56:00Z
featured: false
---

Go has built-in testing support through the `testing` package, making it straightforward to write and run tests.

**Basic test structure:**

```go
// math.go
package math

func Add(a, b int) int {
    return a + b
}
```

```go
// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}
```

**Table-driven tests (idiomatic Go):**

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -1, -2},
        {"zero", 0, 0, 0},
        {"mixed", -5, 10, 5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

**Running tests:**

```bash
go test                    # run tests in current package
go test ./...              # run all tests recursively
go test -v                 # verbose output
go test -run TestAdd       # run specific test
go test -cover             # show coverage
go test -race              # detect race conditions
go test -bench .           # run benchmarks
```

**Test helpers:**

```go
func TestDivide(t *testing.T) {
    t.Helper()  // marks function as helper
    result, err := Divide(10, 0)
    if err == nil {
        t.Fatal("expected error for division by zero")
    }
}
```

**Benchmarks:**

```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}
```

**Testing with mocks:**

```go
// Use interfaces for dependency injection
type Database interface {
    Get(key string) (string, error)
}

// Mock implementation
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

func TestService(t *testing.T) {
    mockDB := &MockDB{data: map[string]string{"key": "value"}}
    service := NewService(mockDB)
    // test service with mock
}
```

**Testing HTTP handlers:**

```go
func TestHandler(t *testing.T) {
    req := httptest.NewRequest("GET", "/api/users", nil)
    w := httptest.NewRecorder()
    
    handler(w, req)
    
    if w.Code != http.StatusOK {
        t.Errorf("got status %d, want %d", w.Code, http.StatusOK)
    }
}
```

**Common assertions:**

```go
t.Error("message")           // log error, continue test
t.Errorf("format %s", arg)   // formatted error
t.Fatal("message")           // log error, stop test immediately
t.Fatalf("format %s", arg)   // formatted fatal
t.Skip("reason")             // skip test
t.Parallel()                 // run test in parallel
```

**Test coverage:**

```bash
go test -coverprofile=coverage.out
go tool cover -html=coverage.out  # view in browser
```

**Best practices:**
- One `*_test.go` file per source file
- Use table-driven tests for multiple scenarios
- Test both success and error cases
- Keep tests simple and readable
- Use `t.Helper()` for test utility functions
- Avoid testing implementation details, focus on behavior
- Use `testdata/` directory for test fixtures
- Run tests with `-race` flag in CI/CD
- Aim for meaningful coverage, not 100%
- Use subtests (`t.Run`) for better organization and parallel execution
