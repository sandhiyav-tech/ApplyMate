import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const internships = pgTable("internships", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // 'remote' | 'hybrid' | 'onsite'
  category: text("category").notNull(), // 'tech' | 'data' | 'design' | 'marketing'
  stipend: text("stipend").notNull(),
  deadline: text("deadline").notNull(),
  description: text("description").notNull(),
  requiredSkills: jsonb("required_skills").$type<string[]>().notNull(),
  preferredSkills: jsonb("preferred_skills").$type<string[]>().notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  internshipId: uuid("internship_id").references(() => internships.id, { onDelete: "set null" }),
  internshipTitle: text("internship_title").notNull(),
  companyName: text("company_name").notNull(),
  readinessScore: integer("readiness_score").notNull(),
  summary: text("summary").notNull(),
  fullAnalysisData: jsonb("full_analysis_data").$type<any>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

