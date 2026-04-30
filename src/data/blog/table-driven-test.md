---
title: "What is a table-driven test in Go?"
description: "Table-driven test = define test cases as slice of structs (input + expected output), iterate with t.Run(). Reduces duplication, easy to add cases, improves readability. Idiomatic Go testing pattern."
tags: ["testing"]
pubDatetime: 2026-04-22T10:58:00Z
featured: false
draft: false
---

## Basic Pattern

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

## Why Use It

1. Write test logic once, apply to many cases
2. Add new case = add one struct (no code duplication)
3. Clear separation: data vs logic
4. Better failure messages (subtest names)
5. Parallel execution with `t.Parallel()`

## Testing Errors

```go
tests := []struct {
    name      string
    a, b      int
    expected  int
    expectErr bool
}{
    {"valid", 10, 2, 5, false},
    {"div by zero", 10, 0, 0, true},
}

for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        result, err := Divide(tt.a, tt.b)
        if (err != nil) != tt.expectErr {
            t.Errorf("error = %v, expectErr %v", err, tt.expectErr)
        }
        if !tt.expectErr && result != tt.expected {
            t.Errorf("got %d, want %d", result, tt.expected)
        }
    })
}
```

## Parallel Execution

```go
for _, tt := range tests {
    tt := tt  // capture (Go <1.22)
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()  // run in parallel
        // test logic
    })
}
```

## When NOT to Use

- Single test case (just write simple test)
- Complex unique setup per case (separate test functions better)
- Test logic varies significantly between cases

**Rule:** If adding a test case requires changing test logic, table-driven isn't the right pattern.
