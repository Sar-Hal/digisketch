# DigiSketch

DigiSketch is a minimalist PixelPost-style note app. Draw three tiny 16x16
pixel sketches, add a short message, and share an anonymous link.

## Features

- 3 sketch canvases with an 8-color pastel palette
- 280-character message limit
- Anonymous, shareable URL (`/v/[id]`)
- Upstash Redis (KV) storage — always-on, lightning fast
- Touch-friendly drawing on mobile
- Pure vanilla frontend for zero-lag instant loading

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, and JavaScript (Zero build tools!)
- **Backend:** Node.js with Express
- **Database:** Upstash Redis

## Project Structure & Workflow

Since this project uses no frontend frameworks (like React) or build tools (like Webpack), the workflow is incredibly simple:

- `public/`: Contains the pure frontend. 
  - `styles.css`: Where all the colors, gradients, and soft UI glassmorphic styles are defined.
  - `create.html` & `create.js`: The sketching wizard logic.
  - `view.html` & `view.js`: The note viewing logic.
- `api/index.js`: The backend Express app. This runs as a **Serverless Function** on Vercel.
- `server.js`: Only used for local development. It wraps `api/index.js` and serves the `public/` static files so you can test locally using `npm run dev`.
- `vercel.json`: Tells Vercel how to route traffic correctly in production.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Redis database on the [Vercel Marketplace](https://vercel.com/marketplace) (Upstash) and link it to your project — or create one directly at [console.upstash.com](https://console.upstash.com).

3. Add a `.env.local` file with your credentials:

```
UPSTASH_REDIS_REST_KV_REST_API_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_KV_REST_API_TOKEN=your-token
```

4. Start the server:

```bash
npm run dev
```

The server will start instantly and your app will be available at `http://localhost:3000`.

## API

`POST /api/notes`

Payload:

```json
{
	"sketches": [[["#f2a7b3", null, "#2d2a26", ...]]],
	"message": "Hello from DigiSketch"
}
```

Returns:

```json
{ "id": "a1b2c3" }
```

## Notes

- Redis credentials are only used server-side in `server.js` to ensure security.