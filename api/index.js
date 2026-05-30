import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";
import { customAlphabet } from "nanoid";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json({ limit: "500kb" }));

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || "",
});

const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

app.post("/api/notes", async (req, res) => {
  try {
    const { sketches, message } = req.body;
    
    if (message !== undefined && typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a string" });
    }
    if (message && message.length > 300) {
      return res.status(400).json({ error: "Message exceeds 300 characters" });
    }

    if (!sketches || !Array.isArray(sketches) || sketches.length !== 3) {
      return res.status(400).json({ error: "Must provide exactly 3 sketches" });
    }

    for (const grid of sketches) {
      if (!Array.isArray(grid) || (grid.length !== 16 && grid.length !== 32)) {
        return res.status(400).json({ error: "Invalid grid size. Must be 16x16 or 32x32" });
      }
      for (const row of grid) {
        if (!Array.isArray(row) || row.length !== grid.length) {
          return res.status(400).json({ error: "Invalid row length" });
        }
        for (const cell of row) {
          if (cell !== null && typeof cell !== "string") {
            return res.status(400).json({ error: "Invalid cell data type" });
          }
          if (typeof cell === "string" && cell.length > 25) {
             return res.status(400).json({ error: "Cell color string too long" });
          }
        }
      }
    }

    const id = nanoid();
    const data = {
      sketches,
      message: message || "",
      created_at: new Date().toISOString(),
    };

    await redis.set(id, data);
    res.json({ id });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Failed to save note" });
  }
});

app.get("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const note = await redis.get(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

export default app;
