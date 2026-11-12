import { z } from "zod";

// ================= Resume Parsing Schemas =================
export const ParseResumeInputSchema = z.object({
  text: z.string().min(20, "Resume text must be at least 20 characters").optional(),
  fileBase64: z.string().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
}).refine(data => data.text || data.fileBase64, {
  message: "Either text or fileBase64 must be provided",
});

export const EducationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().nullish(),
  graduationYear: z.string().nullish(),
  gpa: z.string().nullish(),
});

export const ProjectItemSchema = z.object({
  title: z.string(),
  technologies: z.array(z.string()).default([]),
  description: z.string().default(""),
  link: z.string().nullish(),
});

export const ExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  highlights: z.array(z.string()).default([]),
});

export const ParsedResumeSchema = z.object({
  name: z.string().default("Applicant"),
  email: z.string().default(""),
  phone: z.string().nullish(),
  location: z.string().nullish(),
  linkedin: z.string().nullish(),
  github: z.string().nullish(),
  portfolio: z.string().nullish(),
  summary: z.string().nullish(),
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  experience: z.array(ExperienceItemSchema).default([]),
  qualityScore: z.number().min(0).max(100).default(75),
  qualityBreakdown: z.object({
    completeness: z.number().min(0).max(100).default(75),
    impact: z.number().min(0).max(100).default(70),
    formatting: z.number().min(0).max(100).default(80),
    actionVerbs: z.number().min(0).max(100).default(75),
  }).default({
    completeness: 75,
    impact: 70,
    formatting: 80,
    actionVerbs: 75,
  }),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  rawText: z.string().nullish(),
});

// ================= Internship Match Schemas =================
export const MatchInputSchema = z.object({
  resume: ParsedResumeSchema,
  category: z.enum(['tech', 'data', 'design', 'marketing', 'all']).nullish(),
  search: z.string().nullish(),
});

export const MatchResultItemSchema = z.object({
  internshipId: z.string(),
  matchPercentage: z.number().min(0).max(100),
  matchedSkillsCount: z.number(),
  totalSkillsCount: z.number(),
  highlightReason: z.string(),
});

// ================= Full Analysis Schemas =================
export const AnalyzeInputSchema = z.object({
  resume: ParsedResumeSchema,
  internship: z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    description: z.string().min(10, "Job description is required"),
    requiredSkills: z.array(z.string()).default([]),
    preferredSkills: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([]),
  }),
});

export const SkillGapItemSchema = z.object({
  skill: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string(),
  reason: z.string(),
});

export const SkillGapAnalysisSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(SkillGapItemSchema),
  bonusSkills: z.array(z.string()),
  matchRate: z.number().min(0).max(100),
});

export const ResumeOptimizationSuggestionSchema = z.object({
  originalBullet: z.string(),
  optimizedBullet: z.string(),
  explanation: z.string(),
  targetedSkill: z.string(),
});

export const CareerReadinessScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  breakdown: z.object({
    skills: z.number().min(0).max(100),
    projects: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    resumeQuality: z.number().min(0).max(100),
  }),
  verdict: z.enum([
    'Excellent Fit',
    'Competitive Candidate',
    'Good Foundation - Needs Skill Growth',
    'Stretch Opportunity',
  ]),
  verdictSummary: z.string(),
  keyStrengths: z.array(z.string()),
  primaryBlockers: z.array(z.string()),
});

export const FullAnalysisOutputSchema = z.object({
  readiness: CareerReadinessScoreSchema,
  skillGap: SkillGapAnalysisSchema,
  optimizations: z.array(ResumeOptimizationSuggestionSchema),
});

// ================= Learning Roadmap Schemas =================
export const RoadmapInputSchema = z.object({
  targetRole: z.string(),
  missingSkills: z.array(z.string()).min(1, "At least one missing skill is required"),
  currentSkills: z.array(z.string()).default([]),
  durationWeeks: z.number().min(2).max(12).default(4),
});

export const RoadmapResourceSchema = z.object({
  title: z.string(),
  type: z.enum(['Official Docs', 'freeCodeCamp', 'YouTube', 'Coursera Audit', 'Interactive Tutorial', 'GitHub']),
  url: z.string().url(),
  estimatedHours: z.number(),
  free: z.boolean(),
});

export const RoadmapWeekSchema = z.object({
  weekNumber: z.number(),
  topic: z.string(),
  goal: z.string(),
  skillsTargeted: z.array(z.string()),
  resources: z.array(RoadmapResourceSchema),
  miniProject: z.object({
    title: z.string(),
    description: z.string(),
    deliverable: z.string(),
  }),
});

export const LearningRoadmapSchema = z.object({
  durationWeeks: z.number(),
  targetRole: z.string(),
  weeks: z.array(RoadmapWeekSchema),
  milestones: z.array(z.string()),
});

// ================= Cover Letter Schemas =================
export const CoverLetterInputSchema = z.object({
  resume: ParsedResumeSchema,
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  jobDescription: z.string().min(10, "Job description is required"),
  tone: z.enum(['formal', 'friendly', 'concise']).default('formal'),
  customNotes: z.string().optional(),
});

export const CoverLetterOutputSchema = z.object({
  tone: z.enum(['formal', 'friendly', 'concise']),
  letterText: z.string().min(50),
  hook: z.string(),
  keyMatchesHighlighted: z.array(z.string()),
});

// ================= Interview Preparation Schemas =================
export const InterviewPrepInputSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  jobDescription: z.string().min(10, "Job description is required"),
  resumeSkills: z.array(z.string()).default([]),
  questionCount: z.number().min(3).max(10).default(6),
});

export const InterviewQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['technical', 'behavioral', 'situational']),
  question: z.string(),
  hint: z.string(),
  sampleFramework: z.string(),
  expectedKeywords: z.array(z.string()),
});

export const InterviewPrepOutputSchema = z.object({
  role: z.string(),
  questions: z.array(InterviewQuestionSchema),
});

// ================= Interview Feedback Schemas =================
export const InterviewFeedbackInputSchema = z.object({
  question: z.string().min(5, "Question is required"),
  type: z.enum(['technical', 'behavioral', 'situational']),
  userAnswer: z.string().min(10, "Please provide an answer with at least 10 characters"),
  jobTitle: z.string().default("Intern"),
});

export const InterviewFeedbackOutputSchema = z.object({
  score: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  clarityAndStructure: z.string(),
  suggestedAnswer: z.string(),
});

// ================= Save Analysis Schema =================
export const SaveAnalysisInputSchema = z.object({
  internshipId: z.string().optional(),
  internshipTitle: z.string(),
  companyName: z.string(),
  readinessScore: z.number(),
  summary: z.string(),
  fullAnalysisData: z.record(z.any()).optional(),
});

