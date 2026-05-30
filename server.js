import app from "./api/index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// This file is purely for local development (npm run dev).
// Vercel handles static routing directly via vercel.json.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));

app.get("/v/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view.html"));
});

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "create.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Local development server is running on http://localhost:${PORT}`);
});
