import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";
import { customAlphabet } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Setup Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || "",
});

const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

// View page route
app.get("/v/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view.html"));
});

// Create page route
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "create.html"));
});

// API: Save note
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

// API: Get note
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
