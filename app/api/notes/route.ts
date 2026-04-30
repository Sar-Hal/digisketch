import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, NOTES_TABLE } from "@/lib/supabase-server";
import { generateId, isValidGrid } from "@/lib/utils";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import type { Grid } from "@/lib/types";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;
const rateLimit = new Map<string, { count: number; windowStart: number }>();

const getClientId = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
};

const isValidSketches = (sketches: unknown): sketches is Grid[] =>
  Array.isArray(sketches) &&
  sketches.length === 3 &&
  sketches.every((grid) => isValidGrid(grid));

const checkRateLimit = (clientId: string) => {
  const now = Date.now();
  const entry = rateLimit.get(clientId);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(clientId, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  return false;
};

export async function POST(req: NextRequest) {
  const clientId = getClientId(req);
  if (checkRateLimit(clientId)) {
    return NextResponse.json(
      { error: "Too many notes created. Try again in a minute." },
      { status: 429 }
    );
  }

  let payload: { sketches?: unknown; message?: unknown; theme?: unknown } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const sketches = payload.sketches;
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const theme = typeof payload.theme === "string" ? payload.theme : "light";

  if (!isValidSketches(sketches)) {
    return NextResponse.json({ error: "Invalid sketch data." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();
  let id = generateId();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { error } = await supabase
      .from(NOTES_TABLE)
      .insert({ id, sketches, message, theme });

    if (!error) {
      return NextResponse.json({ id });
    }

    if (error.code !== "23505") {
      return NextResponse.json(
        { error: "Unable to save your note." },
        { status: 500 }
      );
    }

    id = generateId();
  }

  return NextResponse.json(
    { error: "Unable to reserve a unique id." },
    { status: 500 }
  );
}
