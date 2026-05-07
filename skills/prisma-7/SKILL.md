---
name: prisma-7
description: "Comprehensive Prisma 7 ORM skill for PostgreSQL with NestJS. Covers schema design, migrations, CRUD operations, transactions, extensions, middleware, soft deletes, and performance patterns. Trigger: /prisma-7 or any Prisma-related task."
trigger: /prisma-7
---

# /prisma-7

Prisma 7 is the definitive ORM for PostgreSQL in NestJS. This skill provides authoritative, production-grade guidance across three equal pillars: schema design, CRUD operations, and transactions. Execute with precision.

---

## Design Thinking

### Purpose

This skill serves developers building type-safe, performant PostgreSQL backends with NestJS. It addresses the full lifecycle of database interaction: schema-first design, type-safe queries, complex transactions, and production hardening. The audience is intermediate to advanced NestJS developers who need confident, decisive guidance on Prisma patterns that scale.

### Tone

**Pragmatic Type-Safety Enthusiast.** Prisma's greatest strength is eliminating the gap between schema and runtime. Commit to patterns that leverage TypeScript's type system fully. Reject boilerplate that defeats the purpose. Every abstraction must earn its complexity.

### Constraints

- **PostgreSQL-only** for production; SQLite for unit tests
- **NestJS 10+** with dependency injection
- **Prisma 7** with native ECMAScript modules
- No repository pattern - direct Prisma Client injection into services
- Environment variables via `@nestjs/config` with `dotenv`

### Differentiation

**The one thing:** Prisma 7's type-safe queries eliminate runtime SQL errors. This skill teaches you to treat your `schema.prisma` as the single source of truth and build every layer - services, DTOs, API contracts - from it, never against it.

---

## Implementation Directive

### Environment Setup

Install dependencies:

```bash
npm install prisma @prisma/client
npm install -D @nestjs/config dotenv
```

Initialize Prisma:

```bash
npx prisma init
```

Configure `prisma.config.ts` at project root:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

Generate Prisma Client:

```bash
npx prisma generate
```

### NestJS Module Registration

Create `src/prisma/prisma.service.ts`:

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Register in `src/prisma/prisma.module.ts`:

```ts
import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Import in `app.module.ts`:

```ts
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
})
export class AppModule {}
```

---

## Domain-Specific Guidelines

### 1. Schema Design & Migrations

#### Core Schema Principles

Design schema from domain logic, not database normalization theory. Prisma's relation modes (`relationMode` vs `relationMode = "prisma"`) affect foreign key handling.

**Standard PostgreSQL schema structure:**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// === ENUMS ===
enum UserRole {
  ADMIN
  USER
  GUEST
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

// === MODELS ===

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  orders Order[]
  posts  Post[]

  @@index([email])
  @@index([role, deletedAt])
}

model Order {
  id        String      @id @default(cuid())
  total     Decimal     @db.Decimal(10, 2)
  status    OrderStatus @default(PENDING)
  userId    String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@index([userId, status])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  author User @relation(fields: [authorId], references: [id])

  @@index([authorId, published])
  @@fulltext([title, content])
}
```

#### Migration Workflow

```bash
# Create migration from schema changes
npx prisma migrate dev --name add_user_verification

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Status check
npx prisma migrate status
```

**Migration naming conventions:** Use descriptive, forward-looking names: `add_user_verification`, `create_orders_table`, `add_soft_delete_support`.

#### Advanced Schema Patterns

**Self-relations:**

```prisma
model Employee {
  id       String @id @default(cuid())
  name     String
  managerId String?
  manager  Employee?  @relation("EmployeeHierarchy", fields: [managerId], references: [id])
  reports  Employee[] @relation("EmployeeHierarchy")
}
```

**Composite types:**

```prisma
model Account {
  id       String @id @default(cuid())
  settings Json   @default("{}")
  metadata Address?
}

type Address {
  street String
  city   String
  country String
}
```

---

### 2. CRUD Queries & Relations

#### Fundamental Query Patterns

**Create:**

```ts
// Single record
const user = await this.prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
    role: "USER",
  },
});

// With related records
const order = await this.prisma.order.create({
  data: {
    total: 99.99,
    user: {
      connect: { id: userId },
    },
  },
});

// Create or connect
const post = await this.prisma.post.create({
  data: {
    title: "First Post",
    author: {
      connectOrCreate: {
        where: { email: "alice@example.com" },
        create: { email: "alice@example.com", name: "Alice" },
      },
    },
  },
});
```

**Read:**

```ts
// Find unique
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  include: { orders: true, posts: true },
});

// Find first matching
const admin = await this.prisma.user.findFirst({
  where: { role: "ADMIN", deletedAt: null },
});

// Find many with pagination
const posts = await this.prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 20,
  include: { author: { select: { name: true, email: true } } },
});

// Count
const count = await this.prisma.user.count({
  where: { role: "USER", deletedAt: null },
});
```

**Update:**

```ts
// Update single
const updated = await this.prisma.user.update({
  where: { id: userId },
  data: { name: "Alice Updated" },
});

// Update many
const result = await this.prisma.post.updateMany({
  where: { published: false, createdAt: { lt: lastMonth } },
  data: { published: true },
});
```

**Delete:**

```ts
// Hard delete (use soft delete in production)
await this.prisma.post.delete({ where: { id: postId } });

// Delete many
await this.prisma.order.deleteMany({
  where: { status: "CANCELLED", createdAt: { lt: lastYear } },
});
```

#### Relation Queries

**Nested writes:**

```ts
// Create user with posts in single transaction
const user = await this.prisma.user.create({
  data: {
    email: "author@example.com",
    name: "Author",
    posts: {
      create: [
        { title: "First", content: "Content" },
        { title: "Second", content: "More content" },
      ],
    },
  },
  include: { posts: true },
});

// Update with nested relation
await this.prisma.user.update({
  where: { id: userId },
  data: {
    orders: {
      create: { total: 149.99, status: "PENDING" },
    },
  },
});
```

**Filtering on relations:**

```ts
const users = await this.prisma.user.findMany({
  where: {
    orders: {
      some: {
        total: { gt: 100 },
        status: "DELIVERED",
      },
    },
  },
  include: {
    orders: {
      where: { status: "DELIVERED" },
      select: { total: true, createdAt: true },
    },
  },
});
```

**Relation load strategy:**

```ts
// Default: uses LATERAL JOIN (more efficient in most cases)
const users = await this.prisma.user.findMany({
  include: { orders: true },
});

// Explicit join strategy
const users = await this.prisma.user.findMany({
  include: { orders: true },
  relationLoadStrategy: "join",
});

// Query strategy (multiple queries, app-level join)
const users = await this.prisma.user.findMany({
  include: { orders: true },
  relationLoadStrategy: "query",
});
```

---

### 3. Transactions & Atomic Operations

#### Transaction Patterns

**Interactive transactions:**

```ts
async function transferFunds(
  fromAccountId: string,
  toAccountId: string,
  amount: number
) {
  return this.prisma.$transaction(async (tx) => {
    const from = await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });

    if (from.balance < 0) {
      throw new Error("Insufficient funds");
    }

    await tx.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    });

    await tx.transactionLog.create({
      data: {
        fromAccountId,
        toAccountId,
        amount,
        status: "COMPLETED",
      },
    });

    return { from, to: toAccountId };
  });
}
```

**Isolated transactions:**

```ts
// SERIALIZABLE for critical operations
await this.prisma.$transaction(
  async (tx) => {
    // Critical section
  },
  { isolationLevel: "Serializable" }
);

// READ COMMITTED (default, faster)
await this.prisma.$transaction(
  async (tx) => {
    // Standard operations
  },
  { isolationLevel: "ReadCommitted" }
);
```

**Sequential operations:**

```ts
// Execute multiple operations
const [updatedPosts, deletedUsers] = await this.prisma.$transaction([
  this.prisma.post.updateMany({
    where: { published: false },
    data: { published: true },
  }),
  this.prisma.user.deleteMany({
    where: { deletedAt: { lt: twoYearsAgo } },
  }),
]);
```

#### Atomic Operations

**Increment/Decrement:**

```ts
// Atomic counter
await this.prisma.post.update({
  where: { id: postId },
  data: { viewCount: { increment: 1 } },
});

// Multiple atomic operations in single update
await this.prisma.product.update({
  where: { id: productId },
  data: {
    stock: { decrement: quantity },
    soldCount: { increment: quantity },
  },
});
```

**Field-level atomic updates:**

```ts
// Array operations (PostgreSQL)
await this.prisma.user.update({
  where: { id: userId },
  data: {
    tags: { push: "premium" },
  },
});

// Json operations
await this.prisma.account.update({
  where: { id: accountId },
  data: {
    settings: {
      set: { theme: "dark", notifications: true },
    },
  },
});
```

---

### 4. Prisma Client Extensions

#### Client Extensions

Extensions add methods to Prisma Client instance:

```ts
// src/prisma/extensions/soft-delete.extension.ts
import { Prisma } from "@prisma/client";

const softDeleteExtension = Prisma.defineExtension({
  name: "softDelete",
  model: {
    $allModels: {
      async softDelete<T>(
        this: T,
        where: Prisma.Exact<Prisma.AnyArg, T>
      ): Promise<Prisma.GetResult<T, never> | null> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).update({
          where,
          data: { deletedAt: new Date() },
        });
      },
    },
  },
});

// Apply globally
const prisma = new PrismaClient().$extends(softDeleteExtension);
```

#### Model Extensions

Extend specific models with custom methods:

```ts
// src/prisma/extensions/user.extension.ts
const userExtension = Prisma.defineExtension({
  name: "user",
  model: {
    user: {
      async findByEmail(this: any, email: string) {
        return this.findUnique({
          where: { email, deletedAt: null },
        });
      },

      async findAdmins(this: any) {
        return this.findMany({
          where: { role: "ADMIN", deletedAt: null },
        });
      },
    },
  },
});

// Compose extensions
const composed = Prisma.defineExtension({
  ...softDeleteExtension,
  ...userExtension,
});

const prisma = new PrismaClient().$extends(composed);
```

#### Result Extensions

Transform query results:

```ts
const withFullName = Prisma.defineExtension({
  name: "withFullName",
  result: {
    user: {
      fullName: {
        compute(user) {
          return `${user.name ?? "Unknown"} (${user.email})`;
        },
      },
    },
  },
});
```

---

### 5. Middleware & Logging

#### Query Logging

```ts
// Development logging (all queries)
const prisma = new PrismaClient({
  log: [
    { emit: "stdout", level: "query" },
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ],
});

// Production logging (errors only)
const prisma = new PrismaClient({
  log: [{ emit: "stdout", level: "error" }],
});
```

#### Event-Based Logging

```ts
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query", (e) => {
  console.log(`Query: ${e.query}`);
  console.log(`Duration: ${e.duration}ms`);
  console.log(`Params: ${e.params}`);
});

prisma.$on("error", (e) => {
  console.error(`Prisma Error: ${e.message}`);
  console.error(e.target);
});
```

#### Custom Middleware

```ts
// Global query middleware
prisma.$use(async (params, next) => {
  const start = Date.now();

  console.log(`Starting ${params.model}.${params.action}`);

  const result = await next(params);

  const duration = Date.now() - start;
  console.log(
    `Completed ${params.model}.${params.action} in ${duration}ms`
  );

  return result;
});
```

#### Request Logging (NestJS)

Create logging interceptor:

```ts
// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        console.log(`${method} ${url} ${response.statusCode} - ${Date.now() - now}ms`);
      })
    );
  }
}
```

---

### 6. Raw Queries

#### When to Use Raw Queries

Raw queries are appropriate when:
- Prisma does not support the SQL feature (e.g., full-text search ranking)
- Complex aggregations that are awkward in Prisma
- Performance-critical operations requiring specific SQL hints

**Avoid raw queries for routine CRUD** - lose type safety and portability.

#### $queryRaw

```ts
// Interpolated (vulnerable to SQL injection - AVOID)
const users = await prisma.$queryRaw(
  `SELECT * FROM users WHERE email = ${email}`  // DANGEROUS
);

// Parameterized (SAFE)
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;

// With Prisma types
const users = await prisma.$queryRaw<User[]>(
  SQL`SELECT id, email, name FROM users WHERE role = ${role}`
);
```

#### $executeRaw

```ts
// Batch update with raw SQL
const result = await prisma.$executeRaw`
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = ${postId}
`;

// Cleanup old records
await prisma.$executeRaw`
  DELETE FROM sessions
  WHERE expires_at < NOW()
`;
```

#### Raw Query with Aggregation

```ts
// Complex aggregation
const stats = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
  SELECT DATE(created_at) as date, COUNT(*) as count
  FROM orders
  WHERE created_at >= ${startDate}
  GROUP BY DATE(created_at)
  ORDER BY date DESC
`;
```

---

### 7. Soft Deletes & Logical Deletion

#### Schema Design for Soft Deletes

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  deletedAt DateTime? // Null = not deleted
  // ... other fields
}
```

#### Global Query Helper

```ts
// src/prisma/helpers/with-soft-delete.ts
const softDeleteMiddleware = async (params: any, next: any) => {
  // Skip for create, connect, etc.
  if (
    ["FindUnique", "FindFirst", "FindMany", "Update", "Delete"].includes(
      params.action
    )
  ) {
    // Add deletedAt filter
    if (params.action === "FindUnique") {
      params.args.where.deletedAt = null;
    } else if (params.args?.where) {
      params.args.where.deletedAt = null;
    }
  }
  return next(params);
};
```

#### Soft Delete Service Pattern

```ts
// src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }
}
```

---

### 8. Performance Patterns

#### Select Only What You Need

```ts
// Bad: Fetching all fields
const users = await this.prisma.user.findMany(); // Returns all columns

// Good: Specific fields only
const users = await this.prisma.user.findMany({
  select: { id: true, email: true, name: true },
});
```

#### Include with Select

```ts
// Include related records with specific fields
const posts = await this.prisma.user.findMany({
  where: { id: userId },
  include: {
    posts: {
      select: { id: true, title: true, createdAt: true },
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    },
  },
});
```

#### Batch Operations

```ts
// Bulk create (efficient)
const users = await this.prisma.user.createMany({
  data: [
    { email: "user1@example.com", name: "User 1" },
    { email: "user2@example.com", name: "User 2" },
    { email: "user3@example.com", name: "User 3" },
  ],
  skipDuplicates: true,
});

// Bulk update
await this.prisma.user.updateMany({
  where: { role: "GUEST", createdAt: { lt: oneYearAgo } },
  data: { role: "USER" },
});
```

#### Connection Management

```ts
// Use transaction for batch operations requiring atomicity
await this.prisma.$transaction([
  this.prisma.order.updateMany({
    where: { status: "PENDING", createdAt: { lt: yesterday } },
    data: { status: "CANCELLED" },
  }),
  this.prisma.notification.createMany({
    data: cancelledOrderIds.map((id) => ({
      type: "ORDER_CANCELLED",
      orderId: id,
    })),
  }),
]);
```

#### Query Batching (N+1 Prevention)

```ts
// Bad: N+1 queries
for (const userId of userIds) {
  const posts = await this.prisma.post.findMany({
    where: { authorId: userId },
  });
}

// Good: Single query with relation
const postsByAuthor = await this.prisma.post.findMany({
  where: { authorId: { in: userIds } },
  orderBy: { authorId: "asc" },
});

// Group in memory
const grouped = userIds.map((id) => ({
  authorId: id,
  posts: postsByAuthor.filter((p) => p.authorId === id),
}));
```

---

### 9. Environment Variables

#### .env Structure

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
NODE_ENV="development"
```

#### Validation with Zod

```ts
// src/config/env.validation.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
```

#### NestJS Configuration

```ts
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (envObj) => {
        const parsed = envSchema.safeParse(envObj);
        if (!parsed.success) {
          throw new Error(`Invalid environment: ${parsed.error}`);
        }
        return parsed.data;
      },
    }),
    PrismaModule,
  ],
})
export class AppModule {}
```

---

## Hard Constraints

### Schema Design

- **Never use `@db.Text` for fields that have known bounds** - define proper sizes
- **Do not use `@map` and `@@map` arbitrarily** - only when legacy column names require it
- **Avoid `@default(now())` on updatedAt fields** - use `@updatedAt` instead
- **Do not create enums for transient states** - enums are permanent in PostgreSQL once data exists

### Query Patterns

- **Never interpolate user input directly into raw queries** - use template tag parameters exclusively
- **Do not use `find()` or `findOne()`** - these methods do not exist in Prisma 7
- **Avoid `$transaction` for single queries** - it adds overhead without benefit
- **Do not fetch `*` columns when you need specific fields** - use `select`
- **Never use `process.env` directly outside `PrismaService` constructor** - inject ConfigService

### NestJS Patterns

- **Do not create a repository per model** - inject PrismaService directly into services
- **Never instantiate `PrismaClient` manually** - always use `PrismaService`
- **Do not use `prisma.$disconnect()` in controllers** - only in `OnModuleDestroy`
- **Avoid importing generated Prisma types in public DTOs** - decouple schema from API

### Performance

- **Do not use `include` for one-to-one relations when you only need the ID** - use `select`
- **Avoid `createMany` with fewer than 10 records** - single `create` is often faster
- **Do not use `relationLoadStrategy: "query"` without measurement** - default `join` is usually better
- **Never run raw queries in loops** - batch them or use `updateMany`

### Soft Deletes

- **Do not use `deletedAt` as a boolean** - check for `IS NOT NULL` not `= true`
- **Avoid global middleware for soft delete filtering** - explicit `where` clauses are clearer
- **Do not forget to filter soft-deleted records in aggregations** - count will be wrong

---

## Quick Reference

### Common Import Patterns

```ts
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
```

### Essential Prisma Commands

```bash
npx prisma generate          # Generate client
npx prisma migrate dev        # Create and apply migrations
npx prisma migrate deploy     # Apply migrations in production
npx prisma migrate reset      # Reset database (dev only)
npx prisma studio             # GUI for data management
npx prisma validate           # Validate schema
npx prisma format             # Format schema
```

### Key Decision Points

| Scenario | Recommendation |
|----------|----------------|
| Single record CRUD | Direct Prisma queries |
| Multiple related writes | `$transaction` |
| Complex aggregations | Raw `$queryRaw` |
| Soft delete | Manual `deletedAt` filtering |
| N+1 prevention | Include relations with select |
| High-volume inserts | `createMany` |
