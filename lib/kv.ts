import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});

export interface NoteData {
  sketches: unknown; // Grid[] at runtime
  message: string;
  theme: string;
}

/**
 * Save a note to KV.
 * Uses the NX flag ("set if Not eXists") so duplicate IDs are
 * rejected atomically — no need for a try/catch retry on DB errors.
 * Returns true when the key was created, false if it already existed.
 */
export async function saveNote(
  id: string,
  data: NoteData
): Promise<boolean> {
  const result = await redis.set(id, data, { nx: true });
  return result === "OK";
}

/**
 * Retrieve a note by its short ID.
 * Returns null when the key doesn't exist (same semantics as
 * Supabase's `.single()` returning null on a miss).
 */
export async function getNote(id: string): Promise<NoteData | null> {
  return redis.get<NoteData>(id);
}
