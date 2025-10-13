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