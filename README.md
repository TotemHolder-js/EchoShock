# EchoShock MVP

EchoShock is a next-generation indie game platform designed to **empower independent developers** and help gamers **discover hidden gems**.

## Tech Stack

- **Frontend Framework**: Next.js (Page Router)
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase Auth + Postgres
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- A Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Database Setup

Execute the following SQL in your Supabase SQL editor:

```sql
create table public.featured_games (
  id          serial       primary key,
  title       text         not null,
  description text         not null,
  game_url    text         not null,
  image_url   text         not null,
  created_at  timestamptz  not null default now()
);
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Home Page**: Displays a grid of featured indie games
- **Admin Dashboard**: Protected area to manage featured games
- **Authentication**: Email/password login via Supabase Auth
- **Responsive Design**: Works on mobile, tablet, and desktop

## Project Structure

```
echoshock-mvp/
├── components/       # Reusable UI components
├── lib/              # Utility functions and clients
├── pages/            # Next.js pages and API routes
├── styles/           # Global styles and Tailwind config
└── public/           # Static assets
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/featured-games | Fetch all featured games |
| POST | /api/featured-games | Create a new featured game |


