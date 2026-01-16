# Event-Driven Notification Platform

A scalable, event-driven notification system built with Node.js, TypeScript, Kafka, PostgreSQL, Redis, and Docker. The platform ingests events from multiple tenants, validates and enriches them, processes them asynchronously via workers, and dispatches notifications across multiple channels. A minimal Next.js UI is included to visualize event flow and delivery status.

## Why This Project Exists

Most real-world systems are event-driven, multi-tenant, asynchronous, and infrastructure-heavy. This project is designed to demonstrate:

- Backend system design thinking
- Asynchronous processing with message queues
- Clean architecture and service boundaries
- Real SaaS patterns: tenants, rate limits, retries, dead letters
- Infrastructure-first mindset (Docker, Kafka, Redis)
- Minimal but meaningful frontend for observability

**This is not a CRUD app. It is a backend-first system.**

## High-Level Architecture

```
Client
  |
  | HTTP Events (X-API-Key)
  v
Ingestion Service
  |
  | Kafka (events.ingested)
  v
Workers
  |
  | Routing + Channel Dispatch
  v
Email / SMS / Webhook Providers
  |
  v
PostgreSQL         Redis
```

**Key principle:** HTTP is synchronous. Everything else is asynchronous.

## Mental Model (How to Think About the System)

1. Clients send events
2. Ingestion service validates + enriches
3. Kafka becomes the source of truth
4. Workers consume events independently
5. Failures are retried, isolated, and observable
6. UI only visualizes what already happened

**No service depends on another service's runtime availability.**

## Folder Structure Explained

```
notification-platform/
├── ingestion-service/
├── workers/
├── shared/
├── web/
├── infra/
└── README.md
```

### `infra/` — Infrastructure Layer (Foundation)

**Purpose:** Defines everything the system depends on externally.

**Contains:**
- Kafka + Zookeeper
- PostgreSQL
- Redis
- Docker Compose configuration

**Why it exists:**
- Keeps infrastructure out of application code
- Enables one-command local setup
- Mirrors production-like environments
- Allows infra to change without rewriting services

**Key idea:** Application code assumes infra exists. Infra never assumes application logic.

### `shared/` — Contracts & Canonical Types

**Purpose:** Single source of truth for schemas and types shared across services.

**Contains:**
- Zod schemas (event validation)
- TypeScript types (EventInput, EnrichedEvent)
- Prisma schema (data model)

**Why it exists:**
- Prevents schema drift
- Enforces consistency across services
- Eliminates duplicate validation logic

**Key idea:** If two services disagree on data shape, the system is broken.

### `ingestion-service/` — Event Entry Point

**Purpose:** Accepts external events and pushes them into Kafka.

**Responsibilities:**
- Authenticate tenants via API key
- Validate payloads using shared schemas
- Enrich events (IDs, timestamps, tenant context)
- Publish events to Kafka
- Respond quickly (202 Accepted)

**What it does NOT do:**
- No business logic
- No delivery logic
- No retries
- No blocking work

**Key idea:** The ingestion service is a gatekeeper, not a worker.

### `workers/` — Asynchronous Processing Engine

**Purpose:** Consume Kafka events and perform actual work.

**Responsibilities:**
- Consume events from Kafka topics
- Apply routing rules
- Enforce rate limits (Redis)
- Handle retries and failures
- Dispatch to channels (email, SMS, webhook)
- Persist delivery status

**Why workers exist:**
- Scale independently
- Fail without affecting ingestion
- Handle long-running tasks safely

**Key idea:** Workers turn events into outcomes.

### `web/` (Next.js UI) — Observability & Showcase

**Purpose:** Minimal UI to visualize what the backend is doing.

**Shows:**
- Ingested events
- Delivery status
- Timestamps
- Tenant context

**Why minimal frontend:**
- Backend is the product
- UI exists to demonstrate system behavior
- No heavy client-side logic

**Key idea:** UI is a window, not the engine.

## Event Lifecycle

1. Client sends event → `/v1/events`
2. Ingestion validates & enriches
3. Event published to Kafka
4. Worker consumes event
5. Rule engine decides routing
6. Channel dispatcher sends notification
7. Result stored and visualized in UI

## Tech Stack

- **Backend:** Node.js, TypeScript, Express
- **Queue:** Kafka (kafkajs)
- **Validation:** Zod
- **Database:** PostgreSQL
- **Cache / Rate Limit:** Redis
- **Frontend:** Next.js + shadcn/ui
- **Infra:** Docker, Docker Compose
- **CI:** GitHub Actions

## What This Project Demonstrates

- Event-driven architecture
- Clean service boundaries
- Multi-tenant SaaS design
- Async processing & backpressure
- Infrastructure-first thinking
- Production-grade patterns

## Who This Is For

- Backend engineers
- Distributed systems learners
- Interview portfolios
- Anyone wanting to build real-world backend systems

## Future Enhancements

- Dead-letter queue handling
- Webhook retry signatures
- Per-tenant dashboards
- Alerting & metrics
- Kubernetes deployment
