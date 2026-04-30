# DigiSketch

DigiSketch is a minimalist PixelPost-style note app. Draw three tiny 16x16
pixel sketches, add a short message, and share an anonymous link.

## Features

- 3 sketch canvases with an 8-color pastel palette
- 280-character message limit
- Anonymous, shareable URL (`/v/[id]` with `/view/[id]` alias)
- Supabase-backed storage using JSONB grids
- Touch-friendly drawing on mobile

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Framer Motion + Lucide React

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create the Supabase table:

```sql
create table public.sketches (
	id text primary key,
	sketches jsonb not null,
	message text,
	theme text default 'light',
	created_at timestamptz default now()
);
```

3. Add a `.env.local` file:

```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_TABLE_NAME=sketches
```

4. Run the dev server:

```bash
npm run dev
```

## API

`POST /api/notes`

Payload:

```json
{
	"sketches": [[["#f2a7b3", null, "#2d2a26", ...]]],
	"message": "Hello from DigiSketch",
	"theme": "light"
}
```

Returns:

```json
{ "id": "a1b2c3" }
```

## Notes

- A basic in-memory rate limiter is applied in the API route.
- The Supabase service role key is only used server-side.