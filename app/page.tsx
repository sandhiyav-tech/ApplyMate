import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileText,
  Target,
  Zap,
  BookOpen,
  HelpCircle,
  Briefcase,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-grid-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="container max-w-7xl px-4 sm:px-8 mx-auto">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm animate-in fade-in slide-in-from-top-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Built for College Students Targeting 2026-2027 Internships</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              Stop guessing. Start matching.{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Your AI Internship Coach.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Upload your resume and select any internship. ApplyMate AI diagnoses your fit, identifies exact skill gaps, rewrites your bullet points, crafts tailored cover letters, and coaches you through technical & behavioral interviews.
            </p>

            {/* Clear Primary Call to Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 font-bold text-base px-8 h-12 shadow-lg shadow-primary/25">
                  <span>Analyze My Resume & Find Matches</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard?step=2">
                <Button variant="outline" size="lg" className="h-12 text-sm font-semibold">
                  Browse 20+ Verified Internships
                </Button>
              </Link>
            </div>

            {/* Micro-trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free PDF & DOCX Parsing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Powered by Claude 3.5 Sonnet
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Resumes Never Logged or Sold
              </span>
            </div>
          </div>

          {/* Interactive Feature Showcase Teaser */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  AM
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Interactive Analysis Demo</h3>
                  <p className="text-xs text-muted-foreground">
                    Alex Morgan • B.S. Computer Science vs CloudScale Technologies (Full-Stack Intern)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold">
                  84% Career Readiness Score
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Box 1 */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-primary" />
                  Skill Gap Diagnostic
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Matched Skills</span>
                    <span className="text-emerald-500 font-bold">5 / 7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Missing Skill</span>
                    <span className="text-amber-500 font-bold">Docker (High)</span>
                  </div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  Bullet Optimization
                </div>
                <p className="text-muted-foreground italic line-clamp-2">
                  &quot;Architected real-time canvas with &lt;40ms WebSocket sync, eliminating write collisions with CRDTs.&quot;
                </p>
              </div>

              {/* Box 3 */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  Interview Practice
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Interactive simulator grading answers with STAR framework breakdown and top-tier model answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Features Section */}
      <section className="py-20 border-t border-border/40 bg-muted/10">
        <div className="container max-w-7xl px-4 sm:px-8 mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Everything You Need to Land the Offer
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Designed from the ground up for university students competing for summer & off-cycle internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 w-fit">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">1. Deep Resume Extraction</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload PDF/DOCX or paste text. Extracts contact info, education, skills, projects, and work highlights with an instant 0-100 baseline resume quality score.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-primary/10 text-primary p-3 w-fit">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">2. Smart Role Matching</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instantly rank against 20+ verified internships across Tech, Data, Design, and Marketing based on true skill overlap and project alignment.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 w-fit">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">3. Skill Gap Diagnostics</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pinpoints missing technologies with High, Medium, and Low priorities so you know exactly which gaps will trigger automated screening rejections.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 w-fit">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">4. Resume Bullet Optimizer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Specific side-by-side Before & After rewrites highlighting strong action verbs and quantified impact metrics tailored directly to the job description.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 p-3 w-fit">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">5. Free Learning Roadmaps</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Week-by-week curriculum with curated 100% free resources (Official Docs, freeCodeCamp, YouTube, Coursera audit) and portfolio-ready mini projects.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 w-fit">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">6. Cover Letter & Mock Interviews</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generate tailored letters with tone selection and download as .docx. Plus interactive practice interview mode with live AI scoring and model answers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow */}
      <section className="py-20">
        <div className="container max-w-7xl px-4 sm:px-8 mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              How ApplyMate Works
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              From raw resume to interview-ready in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl border border-border/80 p-6 bg-card space-y-3">
              <span className="text-4xl font-black text-primary/20">01</span>
              <h4 className="text-base font-bold text-foreground">Upload or Paste Resume</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drop your PDF or DOCX file. Our server-side parser securely extracts your experience and calculates your initial resume score.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border/80 p-6 bg-card space-y-3">
              <span className="text-4xl font-black text-primary/20">02</span>
              <h4 className="text-base font-bold text-foreground">Select Target Internship</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose from our pre-seeded database of top tech, data, design, and marketing internships, or paste any custom job description.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border/80 p-6 bg-card space-y-3">
              <span className="text-4xl font-black text-primary/20">03</span>
              <h4 className="text-base font-bold text-foreground">Get Actionable Results Hub</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review your 0-100 Career Readiness Score, close skill gaps with weekly roadmaps, download a tailored cover letter, and ace practice questions.
              </p>
            </div>
          </div>

          {/* Bottom CTA Box */}
          <div className="rounded-3xl bg-gradient-to-tr from-primary via-blue-600 to-indigo-700 p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to land your dream internship this term?
            </h3>
            <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Join students from Berkeley, Columbia, State Universities, and bootcamps using ApplyMate AI to elevate their applications.
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="font-bold text-base px-8 h-12 shadow-lg">
                  Launch Assistant Now — 100% Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

