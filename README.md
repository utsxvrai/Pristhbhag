# 30 Day Backend Challenge - Pristhbhag

I am learning 30 backend tools in 30 days, each day i will be learning new tool.

## Day 1 :

- Prisma : Prisma is a modern ORM (Object-Relational Mapping) tool for Node.js and TypeScript, helping you interact with databases in an intuitive, type-safe way.

```npm install prisma --save-dev
    npm install @prisma/client
    npx prisma init
```

- Set DATABASE_URL in `.env`:
  `DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"`

- Generate Prisma Client:
  `npx prisma generate`

- Run migrations to sync database:
  `npx prisma migrate dev --name init`

## Day 2 :

- gRPC (Google Remote Procedure Call) is a high-performance communication protocol that allows services to talk to each other efficiently — often used in microservices architecture.

### What I Learned :

- How client and server (service) communicate via .proto files.

- How to define RPC methods (like CreateBlog, GetBlogs, etc.) in a .proto file.

- How to load and serve these methods using @grpc/grpc-js and @grpc/proto-loader.

- How to integrate gRPC with an Express REST API, allowing REST routes to communicate with gRPC services internally.

### Folder Setup

```
src/
 ├── proto/
 │    └── blog.proto
 ├── services/
 │    ├── grpc-service.js
 │    └── blog-service.js
 ├── clients/
 │    └── blog-client.js
 ├── controllers/
 │    └── blog-controller.js
 └── routes/
      └── blog-routes.js
```

## Day 3 :

- Redis (Remote Dictionary Server) is a fast, open-source, in-memory key-value data store used as a database, cache, and message broker. We're using it to cache database requests.

### What I Learned :

- How to use Redis to dramatically speed up read-heavy operations like GetBlogById and GetBlogs.
- Implemented the "cache-aside" pattern.
- How to run Redis locally in a container using Docker:
  `docker run -d --name my-redis-container -p 6379:6379 redis`
  -Used the ioredis client in Node.js to connect to the Redis server.

- Implemented caching at the Repository Layer using the Decorator Pattern. This keeps my Service Layer and Controllers clean, as they are unaware that caching is even happening.
- Handled cache invalidation:

  - UpdateBlog & DeleteBlog: Delete the specific blog:id key and the general blogs:all key.

  - CreateBlog: Delete the blogs:all key to ensure the list is refetched.

### Resource

- Notion Notes - Caching with Redis: https://www.notion.so/Caching-29c3c5598b618012995ece6b2bc7a22d

## Day 4 :

- Nginx is a high-performance web server and reverse proxy used for serving static files, load balancing, and acting as a gateway between clients and backend services.

### What I Learned :

- How to set up Nginx as a reverse proxy for backend APIs.

- Configured upstream servers for load balancing multiple backend instances.

- Learned about:

  - proxy_pass for routing requests to backend services.

  - proxy_set_header for forwarding client headers.

- Handling WebSocket connections with Upgrade and Connection headers.

- Used Nginx to serve a React frontend and route API calls to Node.js backend on the same domain.

- Learned how to modify the Nginx configuration and reload it using:

### Example nginx.conf snippet:

```
http {
  upstream backend_cluster {
    server backend1:8000;
    server backend2:8000;
  }

  server {
    listen 80;

    location / {
      root /usr/share/nginx/html;
      index index.html;
      try_files $uri /index.html;
    }

    location /api/ {
      proxy_pass http://backend_cluster;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
    }
  }
}
```

## Day 5 : More About Databases

### Transactions

A transaction in databases is a single logical unit of work that may consist of one or more SQL operations (like INSERT, UPDATE, or DELETE) that are executed together.

### ACID :

Popular relational databases like MySQL avoid these kinds of data integrity issues by following a few core principles that govern how transactions work. They conform to a transactional standard called ACID. ACID is an acronym for four different words, but it really breaks down into two core principles: completeness and concurrency. First, here’s what ACID stands for:

- **Atomicity**: the “all or nothing” rule — the transaction either happens completely or doesn’t happen at all
- **Consistency**: data is consistent before and after a transaction without any missing steps
- **Isolation**: multiple transactions can happen concurrently without reading the wrong data
- **Durability**: transactional success is robust to system failure

## **Normalization :**

Normalization is the process of structuring a database to reduce redundancy and improve consistency.In simple terms, it breaks large messy tables into smaller, well-organized ones. This ensures data is stored logically, making databases efficient, easy to maintain, and free from duplication or errors.

https://www.guru99.com/database-normalization.html

# **What are the Types of Normal Forms in DBMS?**

Here is a list of Normal Forms in SQL:

- **1NF (First Normal Form):** Ensures that the database table is organized such that each column contains atomic (indivisible) values, and each record is unique. This eliminates repeating groups, thereby structuring data into tables and columns.
- **2NF (Second Normal Form):** Builds on 1NF by We need to remove redundant data from a table that is being applied to multiple rows. and placing them in separate tables. It requires all non-key attributes to be fully functional on the primary key.
- **3NF (Third Normal Form):** Extends 2NF by ensuring that all non-key attributes are not only fully functional on the primary key but also independent of each other. This eliminates transitive dependency.
- **BCNF (Boyce-Codd Normal Form):** A refinement of 3NF that addresses anomalies not handled by 3NF. It requires every determinant to be a candidate key, ensuring even stricter adherence to normalization rules.

## Day 6 : Testing

# **What is Functional Testing?**

**Functional Testing** is a type of software testing that validates the software system against the functional requirements/specifications. The purpose of Functional tests is to test each function of the software application, by providing appropriate input, verifying the output against the Functional requirements.

# **What is Unit Testing?**

Unit testing is a software testing method where **individual units or components of code**—such as functions, methods, or classes—are tested in isolation to verify they work correctly. The goal is to validate that the smallest pieces of an application behave as expected without dependencies on external systems.

![image.png](attachment:74dc907d-ff1c-49b6-9f25-184e63b7c516:image.png)

# **What is Integration Testing?**

**Integration Testing** is defined as a type of testing where software modules are integrated logically and tested as a group. A typical software project consists of multiple software modules, coded by different programmers. The purpose of this level of testing is to expose defects in the interaction between these software modules when they are integrated

Integration Testing focuses on checking data communication amongst these modules. Hence it is also termed as **‘I & T’** (Integration and Testing), **‘String Testing’** and sometimes **‘Thread Testing’**.

### k6 (Load Testing Tool)

### Concept

k6 is a modern, developer-centric load testing tool written in Go with tests scripted in JavaScript. It helps you measure **system performance, scalability, and resilience** under load.

### Installation

```bash
npm install -g k6
```

### Structure of a k6 Script

Every test has three key parts:

1. **Options** — how many users, how long to run.
2. **Setup** — pre-test initialization.
3. **Default Function** — the actual requests simulated.

Example:

```jsx
import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  vus: 100, // virtual users
  duration: "1m", // test duration
};

export default function () {
  let res = http.get("http://localhost:3000/api/v1/blogs");
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
```

Run:

```bash
k6 run load-test.js
```

### Output

- **HTTP Req/s:** Requests per second.
- **Avg, p95 latency:** Average and 95th percentile response times.
- **Error %:** Failed requests.
- **Throughput:** Total data handled by the backend.

## Day 7 : RabbitMQ

### **RabbitMQ analogy: a task counter in a kitchen.**

Orders come in. The waiter writes each order and drops it at the counter. Chefs pick orders one by one. If too many orders arrive, the counter stacks them. If a chef steps away, orders wait. If a chef burns a dish, the order goes back on the counter. When more chefs arrive, the stack is drained faster.

This matches real-world problems:

1. Sending emails after a user signs up.
2. Generating thumbnails after image upload.
3. Running payment confirmations.
4. Cleaning up expired sessions.
5. Processing background jobs.

The producer is the waiter. The consumer is the chef. The counter is RabbitMQ.
**RabbitMQ basic services:**

1. Reliable message queues.
2. Acknowledgment and redelivery on failure.
3. Exchanges for routing: direct, topic, fanout, headers.
4. Bindings between exchanges and queues.
5. Dead-letter queues for failed messages.
6. Priority queues.
7. Message TTL and queue TTL.
8. Durable and transient queue support.
9. Work distribution across multiple consumers.
10. Publisher confirms for guaranteed delivery.
11. Delayed message delivery.
12. Cluster support for scaling and failover.

## Day 8 : CI / CD

### Overview

CI/CD (Continuous Integration / Continuous Deployment) automates building, testing, and deploying your code. For this project I added a GitHub Actions workflow that builds and pushes Docker images for the `backend` and `frontend` to GitHub Container Registry (GHCR) and deploys to a remote server via SSH and `docker-compose`.

### What I learned

- How to use GitHub Actions to build Docker images and push to a registry.
- How to trigger a remote deploy via SSH and `docker-compose`.
- How to manage secrets for CI (PAT, SSH key, remote host variables).

### Workflow summary

- Builds backend image from `./backend/Dockerfile` and pushes `ghcr.io/<owner>/pristhbhag-backend:latest` and `:sha`.
- Builds frontend image from `./frontend/Dockerfile` and pushes `ghcr.io/<owner>/pristhbhag-frontend:latest` and `:sha`.
- On pushes to `main` the workflow SSHs into the remote host and runs `docker login ghcr.io`, `docker-compose pull` and `docker-compose up -d`.

### Required repository secrets

Add the following secrets in GitHub (Repository -> Settings -> Secrets -> Actions):

- `GHCR_PAT` — Personal Access Token with `read:packages` and `write:packages`.
- `DEPLOY_HOST` — remote server hostname or IP.
- `DEPLOY_USER` — SSH username for the remote server.
- `DEPLOY_SSH_KEY` — private SSH key text for the `DEPLOY_USER`.
- `DEPLOY_SSH_PORT` — optional SSH port (defaults to `22`).
- `REMOTE_COMPOSE_PATH` — path on the remote host where `docker-compose.yml` lives (e.g., `/home/ubuntu/pristhbhag`).

### How to trigger and verify

1. Push a branch and open a PR — the `build-and-push` job will build and push images to GHCR.
2. Merge to `main` — the `deploy` job will SSH to the remote host and run the deploy steps.
3. Verify on the remote host:

```powershell
ssh -i ~/.ssh/id_rsa user@your-host
cd /path/to/compose
docker-compose ps
docker logs backend1 --tail 100
```
