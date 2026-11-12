import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory sliding window store fallback
interface MemoryTokenBucket {
  tokens: number;
  lastRefill: number;
}
const memoryStore = new Map<string, MemoryTokenBucket>();
const MAX_TOKENS = 20; // 20 requests
const REFILL_INTERVAL_MS = 60 * 1000; // per 1 minute

function checkMemoryLimit(identifier: string): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  let bucket = memoryStore.get(identifier);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    memoryStore.set(identifier, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed > REFILL_INTERVAL_MS) {
    bucket.tokens = MAX_TOKENS;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return {
      success: true,
      remaining: bucket.tokens,
      reset: Math.ceil((bucket.lastRefill + REFILL_INTERVAL_MS - now) / 1000),
    };
  }

  return {
    success: false,
    remaining: 0,
    reset: Math.ceil((bucket.lastRefill + REFILL_INTERVAL_MS - now) / 1000),
  };
}

let upstashRatelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes("example.upstash.io")
) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "60 s"),
      analytics: true,
      prefix: "applymate_ratelimit",
    });
  } catch (err) {
    console.warn("Failed to initialize Upstash Redis rate limiter, using in-memory fallback:", err);
  }
}

export async function rateLimit(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (upstashRatelimit) {
    try {
      const result = await upstashRatelimit.limit(identifier);
      return {
        success: result.success,
        remaining: result.remaining,
        reset: Math.ceil((result.reset - Date.now()) / 1000),
      };
    } catch (err) {
      console.warn("Upstash rate limit call failed, falling back to memory:", err);
    }
  }

  return checkMemoryLimit(identifier);
}

