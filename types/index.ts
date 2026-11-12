export type InternshipCategory = 'tech' | 'data' | 'design' | 'marketing';

export interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  graduationYear?: string | null;
  gpa?: string | null;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate?: string | null;
  endDate?: string | null;
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  technologies: string[];
  description: string;
  link?: string | null;
}

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  summary?: string | null;
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  qualityScore: number;
  qualityBreakdown: {
    completeness: number; // 0-100
    impact: number;       // 0-100
    formatting: number;   // 0-100
    actionVerbs: number;  // 0-100
  };
  strengths: string[];
  improvements: string[];
  rawText?: string | null;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  category: InternshipCategory;
  stipend: string;
  deadline: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  matchPercentage?: number;
  createdAt?: string;
}

export interface SkillGapItem {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  reason: string;
}

export interface SkillGapAnalysis {
  matchedSkills: string[];
  missingSkills: SkillGapItem[];
  bonusSkills: string[];
  matchRate: number; // 0-100
}

export interface ResumeOptimizationSuggestion {
  originalBullet: string;
  optimizedBullet: string;
  explanation: string;
  targetedSkill: string;
}

export interface CareerReadinessScore {
  overallScore: number; // 0-100
  breakdown: {
    skills: number;         // 0-100
    projects: number;       // 0-100
    experience: number;     // 0-100
    resumeQuality: number;  // 0-100
  };
  verdict: 'Excellent Fit' | 'Competitive Candidate' | 'Good Foundation - Needs Skill Growth' | 'Stretch Opportunity';
  verdictSummary: string;
  keyStrengths: string[];
  primaryBlockers: string[];
}

export interface RoadmapResource {
  title: string;
  type: 'Official Docs' | 'freeCodeCamp' | 'YouTube' | 'Coursera Audit' | 'Interactive Tutorial' | 'GitHub';
  url: string;
  estimatedHours: number;
  free: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  topic: string;
  goal: string;
  skillsTargeted: string[];
  resources: RoadmapResource[];
  miniProject: {
    title: string;
    description: string;
    deliverable: string;
  };
}

export interface LearningRoadmap {
  durationWeeks: number;
  targetRole: string;
  weeks: RoadmapWeek[];
  milestones: string[];
}

export interface CoverLetterResult {
  tone: 'formal' | 'friendly' | 'concise';
  letterText: string;
  hook: string;
  keyMatchesHighlighted: string[];
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'situational';
  question: string;
  hint: string;
  sampleFramework: string; // e.g. STAR method or system approach
  expectedKeywords: string[];
}

export interface InterviewFeedback {
  score: number; // 0-10
  strengths: string[];
  weaknesses: string[];
  clarityAndStructure: string;
  suggestedAnswer: string;
}

export interface FullAnalysisResult {
  readiness: CareerReadinessScore;
  skillGap: SkillGapAnalysis;
  optimizations: ResumeOptimizationSuggestion[];
}

export interface SavedAnalysis {
  id: string;
  userId?: string;
  internshipId?: string;
  internshipTitle: string;
  companyName: string;
  readinessScore: number;
  summary: string;
  createdAt: string;
}

