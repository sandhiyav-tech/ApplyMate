import { createHash } from "crypto";
import type { ParsedResume } from "@/types";

// In-memory LRU-like cache for parsed resumes
interface CachedResumeItem {
  data: ParsedResume;
  cachedAt: number;
}

const resumeCache = new Map<string, CachedResumeItem>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateResumeHash(content: string): string {
  return createHash("sha256").update(content.trim()).digest("hex");
}

export function getCachedResume(hash: string): ParsedResume | null {
  const item = resumeCache.get(hash);
  if (!item) return null;

  if (Date.now() - item.cachedAt > CACHE_TTL_MS) {
    resumeCache.delete(hash);
    return null;
  }

  return item.data;
}

export function setCachedResume(hash: string, data: ParsedResume): void {
  // Prevent unbounded growth: clear oldest items if size > 200
  if (resumeCache.size > 200) {
    const oldestKey = resumeCache.keys().next().value;
    if (oldestKey) resumeCache.delete(oldestKey);
  }

  resumeCache.set(hash, {
    data,
    cachedAt: Date.now(),
  });
}

export function clearResumeCache(): void {
  resumeCache.clear();
}

