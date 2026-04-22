---
question: "Compare WebSocket vs. HTTP"
answer: "HTTP is request-response (client initiates, ~500B header overhead per request). WebSocket is full-duplex persistent connection (~2-14B frame overhead). Use HTTP for CRUD/APIs. Use WebSocket when server must push frequently or sub-second latency required."
tags: ["networking"]
pubDatetime: 2026-04-22T10:43:00Z
featured: false
---

## Core Trade-off

**HTTP:** Stateless, cacheable, simple — but high latency (50-200ms/request) and header overhead.  
**WebSocket:** Low latency (1-10ms/message), bidirectional — but stateful (harder to scale), no caching, requires reconnect logic.

## When to Use

**HTTP:**
- CRUD operations, REST APIs
- Cacheable content (CDN-friendly)
- Infrequent updates (<1/min)

**WebSocket:**
- Real-time collaboration (Google Docs, Figma)
- Live feeds (stock tickers, chat)
- Server must push without polling

## Production Gotchas

**WebSocket:**
- Silent disconnect → implement heartbeat (ping every 30s)
- Reconnection storm → exponential backoff + jitter
- Memory leak from dead connections → idle timeout (5min)
- Blocked by corporate firewalls → fallback to long-polling
- Stateful = sticky sessions or Redis pub/sub for multi-server

**Cost:** 10k WebSocket connections ≈ 1-2GB RAM. If update frequency <1/min, HTTP polling is cheaper.

**Rule:** Start HTTP. Add WebSocket only when latency/push-frequency demands it.
