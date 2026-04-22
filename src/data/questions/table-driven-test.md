---
question: "What is a table-driven test in Go?"
answer: "A table-driven test is a testing pattern where you define test cases as a slice of structs containing inputs and expected outputs, then iterate through them in a loop. This approach reduces code duplication, makes it easy to add new test cases, and improves test readability."
tags: ["go", "testing", "golang", "table-driven-test", "best-practices"]
pubDatetime: 2026-04-22T10:58:00Z
featured: false
---

Table-driven testing is the idiomatic way to write tests in Go, allowing you to test multiple scenarios with minimal code duplication.

**Basic structure:**

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
                t.Errorf("Add(%d, %d) = %d; want %d", 
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

**Why use table-driven tests:**

1. **Reduces duplication:** Write test logic once, apply to many cases
2. **Easy to extend:** Add new test case = add one struct to the slice
3. **Clear intent:** Test cases are data, separated from test logic
4. **Better failure messages:** Each subtest has a descriptive name
5. **Parallel execution:** Subtests can run in parallel with `t.Parallel()`

**Testing errors:**

```go
func TestDivide(t *testing.T) {
    tests := []struct {
        name      string
        a, b      int
        expected  int
        expectErr bool
    }{
        {"valid division", 10, 2, 5, false},
        {"division by zero", 10, 0, 0, true},
        {"negative result", -10, 2, -5, false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := Divide(tt.a, tt.b)
            
            if tt.expectErr {
                if err == nil {
                    t.Error("expected error, got nil")
                }
                return
            }
            
            if err != nil {
                t.Errorf("unexpected error: %v", err)
            }
            
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

**Complex scenarios with setup/teardown:**

```go
func TestUserService(t *testing.T) {
    tests := []struct {
        name      string
        userID    string
        mockData  map[string]User
        expected  User
        expectErr bool
    }{
        {
            name:   "existing user",
            userID: "123",
            mockData: map[string]User{
                "123": {ID: "123", Name: "Alice"},
            },
            expected:  User{ID: "123", Name: "Alice"},
            expectErr: false,
        },
        {
            name:      "non-existing user",
            userID:    "999",
            mockData:  map[string]User{},
            expected:  User{},
            expectErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Setup
            mockDB := NewMockDB(tt.mockData)
            service := NewUserService(mockDB)
            
            // Execute
            result, err := service.GetUser(tt.userID)
            
            // Assert
            if tt.expectErr {
                if err == nil {
                    t.Fatal("expected error, got nil")
                }
                return
            }
            
            if err != nil {
                t.Fatalf("unexpected error: %v", err)
            }
            
            if result != tt.expected {
                t.Errorf("got %+v, want %+v", result, tt.expected)
            }
        })
    }
}
```

**Parallel execution:**

```go
func TestConcurrent(t *testing.T) {
    tests := []struct {
        name  string
        input int
    }{
        {"case 1", 1},
        {"case 2", 2},
        {"case 3", 3},
    }

    for _, tt := range tests {
        tt := tt  // capture range variable (Go < 1.22)
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()  // run subtests in parallel
            // test logic
        })
    }
}
```

**Anonymous struct vs named struct:**

```go
// Anonymous (inline) - good for simple tests
tests := []struct {
    name string
    in   int
    out  int
}{
    {"case1", 1, 2},
}

// Named struct - better for complex tests or reuse
type testCase struct {
    name      string
    input     Request
    mockSetup func(*MockDB)
    expected  Response
    expectErr bool
}

tests := []testCase{
    {
        name:  "success case",
        input: Request{ID: "123"},
        mockSetup: func(m *MockDB) {
            m.SetUser("123", User{Name: "Alice"})
        },
        expected:  Response{Status: "ok"},
        expectErr: false,
    },
}
```

**Best practices:**

1. **Use descriptive names:** Each test case should have a clear `name` field
2. **Keep test data close:** Define test cases near the test logic
3. **One assertion per subtest:** Focus each case on one behavior
4. **Use t.Run():** Always wrap iterations in `t.Run()` for better output
5. **Capture loop variables:** In Go < 1.22, use `tt := tt` before `t.Run()`
6. **Test edge cases:** Include boundary values, empty inputs, error cases
7. **Separate success and error tests:** Consider separate tables for clarity
8. **Use helper functions:** Extract common assertion logic

**When NOT to use table-driven tests:**

- Single test case (just write a simple test)
- Tests require complex, unique setup per case
- Test logic varies significantly between cases
- Integration tests with heavy external dependencies
