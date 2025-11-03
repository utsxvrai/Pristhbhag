# 30 Day Backend Challenge - Pristhbhag

I am learning 30 backend tools in 30 days, each day i will be learning new tool.

## Day 1 :
- Prisma : Prisma is a modern ORM (Object-Relational Mapping) tool for Node.js and TypeScript, helping you interact with databases in an intuitive, type-safe way.

``` npm install prisma --save-dev
    npm install @prisma/client
    npx prisma init
```

- Set DATABASE_URL in `.env`:
``` DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase" ```

- Generate Prisma Client:
``` npx prisma generate ```

- Run migrations to sync database:
``` npx prisma migrate dev --name init ```

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
``` docker run -d --name my-redis-container -p 6379:6379 redis ```
-Used the ioredis client in Node.js to connect to the Redis server.

- Implemented caching at the Repository Layer using the Decorator Pattern. This keeps my Service Layer and Controllers clean, as they are unaware that caching is even happening.
- Handled cache invalidation:
    - UpdateBlog & DeleteBlog: Delete the specific blog:id key and the general blogs:all key.

    - CreateBlog: Delete the blogs:all key to ensure the list is refetched.

### Resource 

- Notion Notes - Caching with Redis: https://www.notion.so/Caching-29c3c5598b618012995ece6b2bc7a22d