---
title: "How to debug in microservices system?"
description: "Use distributed tracing (Jaeger, Zipkin), centralized logging (ELK, Splunk), correlation IDs across services, service mesh observability, and APM tools. Implement structured logging and maintain consistent log formats across all services."
tags: ["microservices", "debugging", "observability", "distributed-systems"]
pubDatetime: 2026-04-22T10:55:00Z
featured: false
draft: false
---

## Key Debugging Strategies for Microservices

### 1. Distributed Tracing
- **Tools**: Jaeger, Zipkin, AWS X-Ray, Datadog APM
- **Purpose**: Track requests across multiple services
- **Implementation**: 
  - Inject trace IDs at entry points
  - Propagate trace context through headers
  - Visualize service dependencies and latency

```go
// Example: OpenTelemetry tracing in Go
import "go.opentelemetry.io/otel"

func handleRequest(ctx context.Context) {
    tracer := otel.Tracer("service-name")
    ctx, span := tracer.Start(ctx, "operation-name")
    defer span.End()
    
    // Your business logic
}
```

### 2. Centralized Logging
- **Tools**: ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, Loki, CloudWatch
- **Best Practices**:
  - Use structured logging (JSON format)
  - Include correlation/trace IDs in every log
  - Standardize log levels across services
  - Add contextual metadata (service name, version, host)

```json
{
  "timestamp": "2026-04-22T10:55:00Z",
  "level": "error",
  "service": "payment-service",
  "trace_id": "abc123",
  "span_id": "def456",
  "message": "Payment processing failed",
  "error": "insufficient_funds",
  "user_id": "user_789"
}
```

### 3. Correlation IDs
- Generate unique ID at API gateway
- Pass through all service calls via headers
- Include in all logs and traces
- Enables end-to-end request tracking

```http
X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
X-Request-ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7
```

### 4. Service Mesh Observability
- **Tools**: Istio, Linkerd, Consul
- **Benefits**:
  - Automatic request tracing
  - Service-to-service metrics
  - Traffic visualization
  - Retry and timeout policies

### 5. Health Checks & Monitoring
- **Liveness probes**: Is the service running?
- **Readiness probes**: Can it handle traffic?
- **Metrics**: Prometheus + Grafana for dashboards
- **Key metrics**: Latency, error rate, throughput (RED method)

### 6. Local Development Debugging
- **Docker Compose**: Run dependent services locally
- **Service virtualization**: Mock external services
- **Remote debugging**: Attach debugger to containerized services
- **Port forwarding**: `kubectl port-forward` for Kubernetes

### 7. Chaos Engineering
- **Tools**: Chaos Monkey, Gremlin, Litmus
- **Purpose**: Proactively find weaknesses
- **Techniques**: Inject latency, kill services, simulate network failures

### 8. API Gateway Logging
- Log all incoming requests at the gateway
- Track request/response payloads (sanitize sensitive data)
- Monitor rate limits and authentication failures

### 9. Database Query Tracing
- Enable slow query logs
- Use database APM (pg_stat_statements for PostgreSQL)
- Track connection pool metrics

### 10. Event/Message Tracing
- For event-driven architectures (Kafka, RabbitMQ)
- Track message flow through queues
- Monitor dead letter queues
- Include trace IDs in message headers

## Common Debugging Scenarios

### Scenario 1: Request Timeout
1. Check distributed trace for slow service
2. Review service logs for errors
3. Check database query performance
4. Verify network latency between services

### Scenario 2: Intermittent Failures
1. Check for race conditions
2. Review retry/circuit breaker configs
3. Analyze load balancer health checks
4. Look for resource exhaustion (memory, connections)

### Scenario 3: Data Inconsistency
1. Check event ordering in message queues
2. Review transaction boundaries
3. Verify idempotency of operations
4. Check for eventual consistency issues

## Debugging Checklist
- [ ] Correlation IDs present in all logs
- [ ] Distributed tracing configured
- [ ] Centralized logging aggregation
- [ ] Service health endpoints exposed
- [ ] Metrics exported to monitoring system
- [ ] Error tracking (Sentry, Rollbar)
- [ ] API documentation up-to-date
- [ ] Service dependency map maintained

## Tools Comparison

| Tool | Purpose | Best For |
|------|---------|----------|
| Jaeger | Distributed tracing | Request flow visualization |
| ELK Stack | Log aggregation | Full-text log search |
| Prometheus | Metrics collection | Time-series data |
| Grafana | Visualization | Dashboards and alerts |
| Sentry | Error tracking | Exception monitoring |
| Postman/Insomnia | API testing | Manual debugging |

## Anti-Patterns to Avoid
- **Log everything**: Creates noise, increases costs
- **No correlation IDs**: Impossible to trace requests
- **Inconsistent log formats**: Hard to aggregate
- **No timeouts**: Cascading failures
- **Ignoring metrics**: Reactive instead of proactive
