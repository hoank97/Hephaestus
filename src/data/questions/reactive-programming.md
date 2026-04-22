---
question: "What is Reactive Programming and when should you use it?"
answer: "Reactive Programming is a declarative programming paradigm focused on asynchronous data streams and the propagation of change. Use it for event-driven systems, real-time data processing, UI interactions, and scenarios requiring backpressure handling and composable asynchronous operations."
tags: ["reactive-programming", "async", "streams", "architecture"]
pubDatetime: 2026-04-22T15:15:00Z
featured: false
---

## What is Reactive Programming?

Reactive Programming is a programming paradigm oriented around **data streams** and the **propagation of change**. It treats asynchronous events as streams that can be observed, transformed, and composed.

### Core Concepts

#### 1. Observable Streams
- Everything is a stream: user inputs, HTTP requests, database queries
- Streams emit values over time
- Observers subscribe to streams and react to emitted values

#### 2. Operators
- Transform, filter, combine, and manipulate streams
- Examples: `map`, `filter`, `merge`, `debounce`, `retry`

#### 3. Backpressure
- Handle situations where producer emits faster than consumer can process
- Strategies: buffer, drop, throttle

#### 4. Declarative Style
- Describe **what** should happen, not **how**
- Compose complex async logic from simple operators

## Popular Reactive Libraries

### JavaScript/TypeScript
- **RxJS**: Most popular, used in Angular
- **Bacon.js**: Functional reactive programming
- **Most.js**: High-performance streams

### Java
- **Project Reactor**: Spring WebFlux foundation
- **RxJava**: Netflix's reactive extensions
- **Akka Streams**: Actor-based streaming

### Other Languages
- **Rx.NET**: C# reactive extensions
- **RxSwift**: iOS reactive programming
- **RxPY**: Python reactive extensions

## When to Use Reactive Programming

### ✅ Good Use Cases

#### 1. Real-Time Data Processing
```typescript
// Stock price updates
stockPriceStream$
  .pipe(
    filter(price => price > threshold),
    debounceTime(1000),
    distinctUntilChanged()
  )
  .subscribe(price => notifyUser(price));
```

#### 2. Complex UI Interactions
```typescript
// Search with debounce and cancellation
searchInput$
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => searchAPI(query))
  )
  .subscribe(results => displayResults(results));
```

#### 3. Event-Driven Systems
- WebSocket connections
- Server-Sent Events (SSE)
- IoT sensor data
- Message queue consumers

#### 4. Composing Multiple Async Operations
```typescript
// Parallel API calls with error handling
forkJoin([
  getUserProfile(userId),
  getUserPosts(userId),
  getUserFollowers(userId)
])
  .pipe(
    retry(3),
    catchError(err => of(defaultData))
  )
  .subscribe(([profile, posts, followers]) => {
    renderUserPage(profile, posts, followers);
  });
```

#### 5. Backpressure Scenarios
- High-frequency data streams
- Rate limiting API calls
- Buffering and batching operations

### ❌ When NOT to Use

#### 1. Simple CRUD Operations
```typescript
// Overkill for simple operations
// Bad:
of(userId).pipe(
  switchMap(id => getUserById(id))
).subscribe(user => console.log(user));

// Good:
const user = await getUserById(userId);
console.log(user);
```

#### 2. One-Time Async Operations
- Single HTTP request without composition
- Simple Promise-based flows
- Basic async/await is clearer

#### 3. Team Unfamiliarity
- Steep learning curve
- Debugging can be challenging
- Requires team buy-in and training

#### 4. Performance-Critical Synchronous Code
- Reactive overhead not justified
- Direct imperative code is faster

## Reactive Programming Patterns

### 1. Hot vs Cold Observables
```typescript
// Cold: starts emitting when subscribed
const cold$ = interval(1000);

// Hot: emits regardless of subscribers
const hot$ = fromEvent(button, 'click').pipe(share());
```

### 2. Error Handling
```typescript
stream$
  .pipe(
    catchError(err => {
      logError(err);
      return of(fallbackValue);
    }),
    retry(3),
    timeout(5000)
  );
```

### 3. Combining Streams
```typescript
// Merge: emit from any source
merge(stream1$, stream2$)

// CombineLatest: emit when any updates
combineLatest([stream1$, stream2$])

// Zip: pair emissions
zip(stream1$, stream2$)

// SwitchMap: cancel previous, switch to new
input$.pipe(switchMap(val => apiCall(val)))
```

### 4. Multicasting
```typescript
// Share single subscription among multiple observers
const shared$ = expensiveOperation$.pipe(
  shareReplay(1) // Cache last value
);
```

## Example: Real-World Reactive System

```typescript
// Auto-save document with debounce and conflict resolution
const documentChanges$ = fromEvent(editor, 'change');

documentChanges$
  .pipe(
    // Wait for user to stop typing
    debounceTime(2000),
    
    // Only save if content changed
    distinctUntilChanged(),
    
    // Get latest server version
    switchMap(content => 
      forkJoin([
        of(content),
        getServerVersion(docId)
      ])
    ),
    
    // Check for conflicts
    map(([localContent, serverVersion]) => ({
      content: localContent,
      hasConflict: checkConflict(localContent, serverVersion)
    })),
    
    // Save or prompt user
    switchMap(({ content, hasConflict }) =>
      hasConflict
        ? promptUserResolveConflict(content)
        : saveDocument(content)
    ),
    
    // Retry on network failure
    retry({
      count: 3,
      delay: 1000
    }),
    
    // Handle errors gracefully
    catchError(err => {
      showErrorNotification(err);
      return EMPTY;
    })
  )
  .subscribe(result => {
    showSuccessNotification('Document saved');
  });
```

## Advantages

1. **Composability**: Build complex logic from simple operators
2. **Declarative**: Easier to reason about async flows
3. **Backpressure**: Built-in handling of fast producers
4. **Error Handling**: Centralized error management
5. **Cancellation**: Easy to cancel in-flight operations
6. **Testing**: Marble testing for async code

## Disadvantages

1. **Learning Curve**: Steep for beginners
2. **Debugging**: Stack traces can be cryptic
3. **Overhead**: Performance cost for simple operations
4. **Complexity**: Can be overkill for simple use cases
5. **Memory Leaks**: Forgetting to unsubscribe

## Best Practices

1. **Always unsubscribe**: Prevent memory leaks
2. **Use operators wisely**: Don't over-engineer
3. **Handle errors**: Every stream should have error handling
4. **Avoid nested subscriptions**: Use operators like `switchMap`
5. **Test with marble diagrams**: Visualize stream behavior
6. **Document stream behavior**: Async flows are hard to understand

## Comparison with Other Paradigms

| Paradigm | Best For | Example |
|----------|----------|---------|
| **Callbacks** | Simple async | `fs.readFile(path, callback)` |
| **Promises** | Single async value | `fetch(url).then(...)` |
| **Async/Await** | Sequential async | `const data = await fetch(url)` |
| **Reactive** | Multiple values over time | `websocket$.pipe(...)` |

## Conclusion

Reactive Programming shines in scenarios with:
- Multiple asynchronous events over time
- Complex event composition
- Need for backpressure handling
- Real-time data streams

For simple async operations, stick with Promises or async/await. Choose Reactive Programming when the complexity it solves outweighs the complexity it introduces.
