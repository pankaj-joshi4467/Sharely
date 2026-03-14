# S-Media — Mock Social Media Feed

A full-stack social media feed app, just like Instagram or Twitter — but built from scratch for learning! You can create posts, like them, comment on them, and delete them. Built with modern web technologies used by real companies.

> **Beginner?** Don't worry! This guide explains everything step by step, including what each technology does and why it's used.

---

## What Does This App Do?

- **Write posts** (up to 280 characters, like Twitter)
- **Like posts** with a heart button (double-tap also works!)
- **Comment** on any post — anyone can read, write, and delete comments
- **Delete posts** with a confirmation step
- **Live feed** — new posts appear automatically every 10 seconds (no need to refresh)
- **"New posts" banner** slides down when fresh posts arrive while you're scrolling
- **Skeleton loading** — smooth placeholder animation while posts load
- **Responsive design** — works great on mobile, tablet, and desktop
- **Dark mode** support

---

## Tech Stack (What We Use & Why)

| Technology | What It Is | Why We Use It |
|---|---|---|
| **Next.js 14** | A React framework | Gives us both frontend (UI) and backend (API) in one project |
| **React 18** | UI library | Builds interactive components like buttons, cards, modals |
| **TypeScript** | JavaScript with types | Catches bugs before they happen |
| **Tailwind CSS** | CSS utility classes | Style elements directly in HTML — no separate CSS files needed |
| **Supabase** | Cloud PostgreSQL database | Free hosted database — stores all posts and comments |
| **Prisma** | Database ORM | Lets us talk to the database using JavaScript instead of raw SQL |
| **TanStack Query v5** | Server state manager | Handles fetching, caching, and auto-refreshing data from the API |
| **Zustand** | Client state manager | Stores local UI state (like your name, liked posts) simply |
| **Lucide React** | Icon library | Clean, consistent icons (heart, comment, trash, etc.) |

---

## Project Structure Explained

```
s-media/
├── prisma/
│   └── schema.prisma          # Defines your database tables (Post, Comment)
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # The main page (what you see at localhost:3000)
│   │   ├── layout.tsx         # Wraps every page (sets up providers, fonts)
│   │   ├── globals.css        # Global styles + background gradient + animations
│   │   └── api/               # Backend API routes (like a mini Express server)
│   │       └── posts/
│   │           ├── route.ts               # GET all posts / POST create post
│   │           └── [id]/
│   │               ├── route.ts           # DELETE a post
│   │               ├── like/route.ts      # POST to like a post
│   │               └── comments/
│   │                   ├── route.ts       # GET comments / POST new comment
│   │                   └── [commentId]/route.ts  # DELETE a comment
│   │
│   ├── components/            # Reusable UI pieces
│   │   ├── CreatePost.tsx     # The "What's on your mind?" input box
│   │   ├── PostFeed.tsx       # The scrollable list of all posts
│   │   ├── PostCard.tsx       # A single post card (header, content, buttons)
│   │   ├── CommentSection.tsx # Comment list + input for each post
│   │   ├── NameModal.tsx      # Popup asking for your display name
│   │   ├── NewPostsBanner.tsx # "New posts available" notification banner
│   │   ├── QueryProvider.tsx  # Sets up TanStack Query for the whole app
│   │   ├── Spinner.tsx        # Animated loading spinner
│   │   └── Toast.tsx          # Temporary notification messages
│   │
│   ├── hooks/                 # Custom React hooks (reusable data-fetching logic)
│   │   ├── usePosts.ts        # Hooks for getting, creating, liking, deleting posts
│   │   └── useComments.ts     # Hooks for getting, creating, deleting comments
│   │
│   ├── store/                 # Zustand stores (global client-side state)
│   │   ├── usePostStore.ts    # Stores the post input text, typing status
│   │   ├── useUserStore.ts    # Stores your name + which posts you've liked
│   │   └── useToastStore.ts   # Controls toast notification messages
│   │
│   └── lib/                   # Shared utility files
│       ├── prisma.ts          # Creates a single Prisma client (avoids duplicates)
│       ├── queryClient.ts     # Creates the TanStack Query client
│       └── utils.ts           # Helper functions (avatar colors, time formatting)
```

---

## Database Schema

The app has two tables:

**Post** — stores each post
```
id          → unique ID (auto-generated)
content     → the text of the post
authorName  → display name (default: "Anonymous")
likes       → number of likes (default: 0)
createdAt   → when it was posted
comments    → list of comments on this post
```

**Comment** — stores comments on posts
```
id          → unique ID (auto-generated)
content     → the text of the comment
authorName  → display name (default: "Anonymous")
postId      → which post this belongs to
createdAt   → when it was written
```

> When a post is deleted, all its comments are automatically deleted too (cascade delete).

---

## API Routes

These are the backend endpoints the frontend calls:

| Method | URL | What It Does |
|---|---|---|
| `GET` | `/api/posts` | Fetch all posts (newest first) |
| `POST` | `/api/posts` | Create a new post |
| `DELETE` | `/api/posts/:id` | Delete a post (and all its comments) |
| `POST` | `/api/posts/:id/like` | Add 1 like to a post |
| `GET` | `/api/posts/:id/comments` | Fetch all comments for a post |
| `POST` | `/api/posts/:id/comments` | Add a comment to a post |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Delete a specific comment |

---

## Setup Guide (Step by Step)

### What You Need First

- [Node.js](https://nodejs.org) (version 18 or higher) — JavaScript runtime
- [Git](https://git-scm.com) — to clone the project
- A free [Supabase](https://supabase.com) account — for the database

---

### Step 1 — Clone & Install

```bash
# Download the project
git clone <your-repo-url>
cd s-media

# Install all dependencies
npm install
```

> `npm install` reads `package.json` and downloads all required packages into `node_modules/`

---

### Step 2 — Create a Free Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"** — give it any name, choose a region close to you
3. Wait for the project to finish setting up (~1 minute)
4. Go to **Settings → Database**
5. Scroll down to **"Connection string"**
6. Copy the **URI** (with `pgbouncer=true`) — this is your `DATABASE_URL`
7. Also copy the **Direct connection** URI — this is your `DIRECT_URL`

---

### Step 3 — Set Up Environment Variables

Create a file called `.env` in the root of the project:

```bash
# On Mac/Linux
cp .env.example .env

# On Windows
copy .env.example .env
```

Open `.env` and fill in your Supabase connection strings:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

> Replace `[YOUR-PASSWORD]` with your Supabase project password and `[YOUR-PROJECT-REF]` with your project's reference ID (found in Settings → General).

---

### Step 4 — Push the Database Schema

This creates the `Post` and `Comment` tables in your Supabase database:

```bash
npx prisma db push
```

Then generate the Prisma client (TypeScript types for your database):

```bash
npx prisma generate
```

> `prisma db push` reads `prisma/schema.prisma` and creates the tables. You only need to run this when the schema changes.

---

### Step 5 — Start the App

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the S-Media feed!

---

## How the Data Flow Works

Here's how everything connects when you create a post:

```
You type in CreatePost.tsx
    ↓
Click "Share" → calls createPost() from useCreatePost hook
    ↓
TanStack Query sends POST request to /api/posts
    ↓
Next.js API route (app/api/posts/route.ts) receives the request
    ↓
Prisma writes the new post to Supabase (PostgreSQL)
    ↓
TanStack Query invalidates the posts cache → triggers refetch
    ↓
PostFeed.tsx re-renders with the new post at the top
```

---

## Common Issues & Fixes

**"Cannot connect to database"**
- Double-check your `.env` file — make sure there are no extra spaces or missing characters
- Make sure you ran `npx prisma db push`

**"Module not found" errors**
- Run `npm install` again
- Run `npx prisma generate`

**Posts not appearing**
- Open browser DevTools (F12) → Console tab — check for errors
- Make sure the dev server is running (`npm run dev`)

**Server error on API calls (Windows)**
- If you see 500 errors after changing code, restart the dev server:
  ```bash
  # Stop the server (Ctrl+C), then:
  npm run dev
  ```

---

## Scripts

| Command | What It Does |
|---|---|
| `npm run dev` | Start development server (with hot reload) |
| `npm run build` | Build the app for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check code for errors/warnings |
| `npx prisma db push` | Sync schema changes to the database |
| `npx prisma studio` | Open a visual database browser |

---

## Key Concepts for Beginners

**What is an ORM?**
Prisma is an ORM (Object-Relational Mapper). Instead of writing SQL like `SELECT * FROM posts`, you write `prisma.post.findMany()` — much easier to read and less error-prone.

**What is optimistic UI?**
When you like a post, the heart turns red immediately — before the server confirms it. This makes the app feel instant. If the server fails, the UI rolls back. This is called "optimistic update."

**What is polling?**
The app automatically re-fetches posts every 10 seconds using TanStack Query's `refetchInterval`. This way you see new posts from other users without manually refreshing.

**What is a Zustand store?**
Zustand is a simple state manager. `useUserStore` persists your name to `localStorage` so you don't have to re-enter it every time. `usePostStore` tracks the current text in the post input box.
