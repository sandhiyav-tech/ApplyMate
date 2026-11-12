import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import { SEED_INTERNSHIPS } from "./seed";
import { desc, eq, like, or } from "drizzle-orm";
import type { Internship, SavedAnalysis } from "@/types";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes("user:password")) {
    return null;
  }

  try {
    neonConfig.fetchConnectionCache = true;
    const pool = new Pool({ connectionString });
    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  } catch (error) {
    console.warn("Could not connect to Neon database, using fallback mode:", error);
    return null;
  }
}

// In-memory persistent cache for environments without a live Postgres DB connection
const localSavedAnalyses: SavedAnalysis[] = [
  {
    id: "sample-analysis-1",
    userId: "demo-user",
    internshipId: "seed-1",
    internshipTitle: "Software Engineering Intern (Full-Stack)",
    companyName: "CloudScale Technologies",
    readinessScore: 84,
    summary: "Competitive Candidate with strong React and TypeScript experience. Recommended adding Docker & Next.js to portfolio.",
    createdAt: new Date().toISOString(),
  },
];

export async function fetchAllInternships(params?: { category?: string; search?: string }): Promise<Internship[]> {
  const db = getDb();

  // If live DB is connected, fetch from database
  if (db) {
    try {
      const records = await db.query.internships.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          title: r.title,
          company: r.company,
          location: r.location,
          type: r.type as 'remote' | 'hybrid' | 'onsite',
          category: r.category as any,
          stipend: r.stipend,
          deadline: r.deadline,
          description: r.description,
          requiredSkills: (r.requiredSkills as string[]) || [],
          preferredSkills: (r.preferredSkills as string[]) || [],
          responsibilities: (r.responsibilities as string[]) || [],
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn("DB query failed, falling back to seed data:", err);
    }
  }

  // Fallback to rich seed dataset
  let results: Internship[] = SEED_INTERNSHIPS.map((item, idx) => ({
    id: `internship-${idx + 1}`,
    ...item,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }));

  if (params?.category && params.category !== 'all') {
    results = results.filter((i) => i.category.toLowerCase() === params.category?.toLowerCase());
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    results = results.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  return results;
}

export async function storeAnalysis(data: {
  userId?: string;
  internshipId?: string;
  internshipTitle: string;
  companyName: string;
  readinessScore: number;
  summary: string;
  fullAnalysisData?: any;
}): Promise<SavedAnalysis> {
  const db = getDb();

  if (db) {
    try {
      const [inserted] = await db.insert(schema.analyses).values({
        userId: data.userId || null,
        internshipId: data.internshipId ? (data.internshipId as any) : null,
        internshipTitle: data.internshipTitle,
        companyName: data.companyName,
        readinessScore: data.readinessScore,
        summary: data.summary,
        fullAnalysisData: data.fullAnalysisData,
      }).returning();

      return {
        id: inserted.id,
        userId: inserted.userId || undefined,
        internshipId: inserted.internshipId || undefined,
        internshipTitle: inserted.internshipTitle,
        companyName: inserted.companyName,
        readinessScore: inserted.readinessScore,
        summary: inserted.summary,
        createdAt: inserted.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn("Database insert failed, persisting to local store:", err);
    }
  }

  const newSaved: SavedAnalysis = {
    id: `analysis-${Date.now()}`,
    userId: data.userId || "anonymous",
    internshipId: data.internshipId,
    internshipTitle: data.internshipTitle,
    companyName: data.companyName,
    readinessScore: data.readinessScore,
    summary: data.summary,
    createdAt: new Date().toISOString(),
  };

  localSavedAnalyses.unshift(newSaved);
  return newSaved;
}

export async function fetchUserAnalyses(userId?: string): Promise<SavedAnalysis[]> {
  const db = getDb();
  if (db && userId) {
    try {
      const records = await db.query.analyses.findMany({
        where: eq(schema.analyses.userId, userId),
        orderBy: [desc(schema.analyses.createdAt)],
      });
      return records.map((r) => ({
        id: r.id,
        userId: r.userId || undefined,
        internshipId: r.internshipId || undefined,
        internshipTitle: r.internshipTitle,
        companyName: r.companyName,
        readinessScore: r.readinessScore,
        summary: r.summary,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("DB query for analyses failed:", err);
    }
  }

  return localSavedAnalyses;
}

export async function clearUserData(userId?: string): Promise<void> {
  const db = getDb();
  if (db && userId) {
    try {
      await db.delete(schema.analyses).where(eq(schema.analyses.userId, userId));
    } catch (err) {
      console.warn("DB delete failed:", err);
    }
  }
  localSavedAnalyses.length = 0;
}

