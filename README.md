# DigiSketch

DigiSketch is a minimalist PixelPost-style note app. Draw three tiny 16x16
pixel sketches, add a short message, and share an anonymous link.

## Features

- 3 sketch canvases with an 8-color pastel palette
- 280-character message limit
- Anonymous, shareable URL (`/v/[id]` with `/view/[id]` alias)
- ImageTrail animation for sketch reveals
- Upstash Redis (KV) storage — always-on, no auto-pause
- Touch-friendly drawing on mobile

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Upstash Redis (via Vercel Marketplace)
- Framer Motion + GSAP + Lucide React

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Redis database on the [Vercel Marketplace](https://vercel.com/marketplace) (Upstash) and link it to your project — or create one directly at [console.upstash.com](https://console.upstash.com).

3. Add a `.env.local` file:

```
UPSTASH_REDIS_REST_URL=your-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token
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
- Redis credentials are only used server-side.