# TypeScript + Prisma + Express + SQLite REST API  

A simple blog-style REST API built with **TypeScript**, **Express**, **Prisma ORM**, and **SQLite**.  
Implements `Users`, `Posts`, and `Comments` with full CRUD operations, migrations, seeding, pagination, and validation.  



## Features  
- TypeScript for type safety  
- Prisma ORM for schema, migrations & queries  
- SQLite as lightweight local database  
- Express.js REST API with CRUD endpoints  
- Zod for runtime validation  
- Prisma Studio for DB exploration  
- Pagination and filtering  



## Tech Stack  
- **Backend:** Express.js  
- **Language:** TypeScript  
- **Database:** SQLite  
- **ORM:** Prisma  
- **Validation:** Zod  



## Setup  

### 1. Clone Repo
```bash
git clone https://github.com/yadhuvarshini/Typescript-Prisma-express-rest-api.git
cd Typescript-Prisma-express-rest-api
cd prisma-walkthrough
```
### 2. Install Dependencies
```
npm install
```
### 3. Initialize Prisma (if not already done)
   This helps to create a schema file - prisma.schema and env file to connect your db
```
npx prisma init --datasource-provider sqlite
```
### 4. Configure .env and Schema file
   Update your .env file with your sqlite/PostgreSQL/mysql database connection URL.

```
DATABASE_URL="file:./dev.db"
```
#### Update the schema.prisma file to use PostgreSQL and define your models
```
// Prisma.schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime @default(now())
}

model Comment {
  id        Int      @id @default(autoincrement())
  text      String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
}
```

### 5. Run Migration
   To create a schema in the DB by Prisma
   This will:
	•	Create the SQLite DB (dev.db)
	•	Apply your models as tables
	•	Generate Prisma Client
```
npx prisma migrate dev --name init
```
### 6. Generate Prisma Client
   Prisma client will be generated at src/generated/prisma (because you set output in schema).
```
npx prisma generate
```
### 7. Seed Database
```
npx ts-node prisma/seed.ts
```
### 8. Start Server
```
npx ts-node src/index.ts
```
#### Server will run at http://localhost:6500

### 9. At End after db population use studio to see your db
    ```
    npx prisma studio
    ```
## Database Schema

### User
```
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}
```
### Post
```
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime @default(now())
}
```
### Comment
```
model Comment {
  id        Int      @id @default(autoincrement())
  text      String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
}
```

⸻

# API Endpoints

## Users
### List all users with their posts.
```
GET /users
```

## Posts
### GET ALL POSTS
```
GET /posts
```
List all posts with authors and comments.
	•	authorId=1 → filter by author
	•	page=1&limit=5 → pagination
 

### Create a new post.
```
POST /posts
```
```
{
  "title": "My First Post",
  "content": "Hello world!",
  "published": true,
  "authorId": 1
}
```
```
PUT /posts/:id
```
### Update a post.
```
{
  "title": "Updated Title",
  "content": "Updated Content",
  "published": false
}
```
### Delete a post and all its comments.

```
DELETE /posts/:id
```

⸻

## Comments

### Add a comment to a post.
```
POST /comments
```
```
{
  "text": "Nice article!",
  "postId": 1
}
```
### Update a comment.
```
PUT /comments/:id
```

```
{
  "text": "Updated comment"
}
```
### Delete a comment.
```
DELETE /comments/:id
```


⸻

## Seeding

Sample seed script (prisma/seed.ts) inserts:
	•	Users (Alice, Bob)
	•	Posts per user
	•	Comments on posts

### Run seeding:
```
npx ts-node prisma/seed.ts
```
---

## Testing with cURL  

### Users  

#### Get all users
```
curl -X GET http://localhost:6500/users
```

#### Create a user
```
curl -X 'POST' \
  'http://localhost:6500/users' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "stringsamplle",
  "email": "usersample@example.com"
}'

```
### Update a user
```
curl -X 'PUT' \
  'http://localhost:6500/users/2' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYW52aUBleGFtcGxlLmNvbSIsImlhdCI6MTc1ODE4NTY1NywiZXhwIjoxNzU4MTkyODU3fQ.qTWwB14-rAaPqYQDH2twgdZcLMFN8V0MJfTrUZKhVXQ' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "email": "user@example.com"
}'
```
#### Delete a user
```
curl -X 'DELETE' \
  'http://localhost:6500/users/9' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYW52aUBleGFtcGxlLmNvbSIsImlhdCI6MTc1ODE4NTY1NywiZXhwIjoxNzU4MTkyODU3fQ.qTWwB14-rAaPqYQDH2twgdZcLMFN8V0MJfTrUZKhVXQ'
  ```
⸻

### Posts

#### Get all posts
```
curl -X GET http://localhost:6500/posts
```
#### Get posts by author with pagination
```
curl -X GET "http://localhost:6500/posts?authorId=1&page=1&limit=5"
```
#### Create a new post
```
curl -X POST http://localhost:6500/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello world!", "published": true, "authorId": 1}'
```
#### Update a post
```
curl -X PUT http://localhost:6500/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated Content", "published": false}'
```
#### Delete a post (and its comments)
```
curl -X DELETE http://localhost:6500/posts/1
```

⸻

Comments

#### Add a comment
```
curl -X POST http://localhost:6500/comments \
  -H "Content-Type: application/json" \
  -d '{"text": "Nice article!", "postId": 1}'
```
#### Update a comment

```
curl -X PUT http://localhost:6500/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated comment"}'
```

#### Delete a comment
```
curl -X DELETE http://localhost:6500/comments/1
```

---

Summary
	•	Setup with TypeScript + Express + Prisma + SQLite
	•	Prisma schema → migration → seeding → endpoints
	•	CRUD operations for Users, Posts, Comments
	•	Bonus features: pagination, filtering, validation with Zod
	•	Prisma Studio to explore DB:
 ```
    npx prisma studio
 ```

Ready to extend with PostgreSQL/MySQL in production.

---
