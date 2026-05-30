import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";
import { customAlphabet } from "nanoid";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || "",
});

const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

app.post("/api/notes", async (req, res) => {
  try {
    const { sketches, message } = req.body;
    if (!sketches || !Array.isArray(sketches)) {
      return res.status(400).json({ error: "Invalid sketches format" });
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
