"use client";

import * as React from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Code2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getScoreColor } from "@/lib/utils";
import type { ParsedResume } from "@/types";

interface ResumeUploaderProps {
  onParsed: (resume: ParsedResume) => void;
  parsedResume: ParsedResume | null;
  onReset?: () => void;
}

const SAMPLE_CS_RESUME = `
ALEX MORGAN
alex.morgan@berkeley.edu | (510) 555-0199 | San Francisco, CA
linkedin.com/in/alexmorgan-dev | github.com/alexmorgandev | alexmorgan.dev

EDUCATION
University of California, Berkeley — B.S. in Computer Science (Expected May 2026)
GPA: 3.82 / 4.00
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Computer Security, Full-Stack Web Development.

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, Java, C++, SQL, HTML/CSS
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, PyTorch
Databases & Tools: PostgreSQL, Redis, Docker, Git, GitHub Actions, AWS S3, REST APIs, Linux

PROJECTS
Distributed Real-Time Collaboration Canvas | React, TypeScript, Node.js, WebSocket
• Architected a high-performance vector canvas allowing 50+ concurrent users to edit nodes simultaneously with <40ms WebSocket sync.
• Implemented conflict-free replicated data types (CRDTs) to eliminate write collisions across distributed peers.
• Deployed microservices using Docker on AWS EC2 with continuous integration via GitHub Actions.

Campus Course Review & Schedule Optimizer | Next.js, PostgreSQL, Prisma, Tailwind CSS
• Built a full-stack academic planning portal used by over 1,400 undergraduate students during Spring enrollment.
• Optimized relational queries and table indexes in PostgreSQL, reducing average catalog search latency by 45%.
• Integrated OAuth 2.0 authentication and automated rate limiting to prevent spam submissions.

WORK EXPERIENCE
Undergraduate Course Assistant — Data Structures | UC Berkeley
August 2024 – Present | Berkeley, CA
• Lead weekly laboratory sections and office hours for 60+ students, mentoring on binary trees, graph algorithms, and asymptotic complexity.
• Developed automated grading test scripts in Python to evaluate student assignment submissions with 100% test reproducibility.
`;

const SAMPLE_DATA_RESUME = `
PRIYA SHARMA
priya.sharma@columbia.edu | (212) 555-0842 | New York, NY
linkedin.com/in/priyasharma-data | github.com/priyadata

EDUCATION
Columbia University — B.S. in Applied Mathematics & Statistics (Expected Dec 2026)
GPA: 3.78 / 4.00
Relevant Coursework: Applied Linear Algebra, Probability & Statistics, Machine Learning, Econometrics, SQL for Data Science.

SKILLS
Languages: Python, SQL, R, Bash
Data Science & ML: Pandas, NumPy, Scikit-Learn, Statsmodels, Matplotlib, Seaborn
Tools & Analytics: Tableau, PowerBI, Excel (Advanced Modeling), Git, Snowflake, PostgreSQL

PROJECTS
Financial Fraud Detection Pipeline | Python, Scikit-Learn, Pandas, PostgreSQL
• Trained and evaluated gradient-boosted decision trees (XGBoost) on 250,000 credit card transactions, achieving a 0.94 ROC-AUC.
• Built automated feature engineering pipelines dealing with class imbalance using SMOTE and stratified k-fold cross validation.

Urban Transit Optimization Dashboard | Python, Tableau, SQL
• Analyzed 3M+ taxi and subway trip records in Snowflake using complex SQL window functions to model passenger congestion peaks.
• Designed interactive Tableau storyboards delivered to city transit planners to recommend dynamic bus lane intervals.
`;

export function ResumeUploader({ onParsed, parsedResume, onReset }: ResumeUploaderProps) {
  const [activeTab, setActiveTab] = React.useState<"upload" | "paste">("upload");
  const [pastedText, setPastedText] = React.useState("");
  const [isParsing, setIsParsing] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleParse = async (file?: File, text?: string) => {
    setIsParsing(true);
    const toastId = toast.loading("Analyzing resume with Claude AI parser...");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else if (text) {
        formData.append("text", text);
      } else {
        throw new Error("Please upload a file or paste your resume text");
      }

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to parse resume");
      }

      toast.success(
        json.cached
          ? "Loaded parsed resume from session cache!"
          : "Resume parsed and scored successfully!",
        { id: toastId }
      );
      onParsed(json.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse resume", { id: toastId });
    } finally {
      setIsParsing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleParse(file);
    }
  };

  // If already parsed, display summary card with review & re-upload option
  if (parsedResume) {
    const scoreColor = getScoreColor(parsedResume.qualityScore);

    return (
      <Card className="glass-card overflow-hidden border-2 border-primary/20 shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-xl font-bold text-foreground">{parsedResume.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {parsedResume.education[0]?.degree || "Student"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {[parsedResume.email, parsedResume.phone, parsedResume.location]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resume Quality
                </div>
                <div className={`text-2xl font-black ${scoreColor.text}`}>
                  {parsedResume.qualityScore}
                  <span className="text-xs font-normal text-muted-foreground">/100</span>
                </div>
              </div>

              {onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="gap-1.5 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Upload Different Resume
                </Button>
              )}
            </div>
          </div>

          {/* Quality breakdown progress */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3.5 rounded-xl border border-border/40 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Completeness</span>
                <span className="font-semibold">{parsedResume.qualityBreakdown.completeness}%</span>
              </div>
              <Progress value={parsedResume.qualityBreakdown.completeness} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Measurable Impact</span>
                <span className="font-semibold">{parsedResume.qualityBreakdown.impact}%</span>
              </div>
              <Progress value={parsedResume.qualityBreakdown.impact} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Action Verbs</span>
                <span className="font-semibold">{parsedResume.qualityBreakdown.actionVerbs}%</span>
              </div>
              <Progress value={parsedResume.qualityBreakdown.actionVerbs} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Formatting</span>
                <span className="font-semibold">{parsedResume.qualityBreakdown.formatting}%</span>
              </div>
              <Progress value={parsedResume.qualityBreakdown.formatting} className="h-1.5" />
            </div>
          </div>

          {/* Extracted Skills */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Extracted Skills ({parsedResume.skills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {parsedResume.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-0.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 p-3.5 space-y-1.5">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Resume Highlights
              </span>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {parsedResume.strengths.slice(0, 2).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 p-3.5 space-y-1.5">
              <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Suggested Enhancements
              </span>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {parsedResume.improvements.slice(0, 2).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sample Quick-Loaders */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 rounded-xl border border-border/40 text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Test with a verified sample resume:
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleParse(undefined, SAMPLE_CS_RESUME)}
            disabled={isParsing}
            className="h-7 text-xs gap-1 font-medium bg-background"
          >
            <Code2 className="h-3 w-3 text-primary" />
            Load CS & Tech Resume
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleParse(undefined, SAMPLE_DATA_RESUME)}
            disabled={isParsing}
            className="h-7 text-xs gap-1 font-medium bg-background"
          >
            <Database className="h-3 w-3 text-emerald-500" />
            Load Data Science Resume
          </Button>
        </div>
      </div>

      {/* Tabs: File Upload vs Paste Text */}
      <div className="flex border-b border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Upload PDF / DOCX
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("paste")}
          className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "paste"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Paste Resume Text
        </button>
      </div>

      {activeTab === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/80 hover:border-primary/50 hover:bg-muted/20"
          } ${isParsing ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleParse(e.target.files[0]);
              }
            }}
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
            {isParsing ? (
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <UploadCloud className="h-7 w-7" />
            )}
          </div>

          <h3 className="text-base font-semibold text-foreground mb-1">
            {isParsing ? "Extracting and analyzing your resume..." : "Click to upload or drag & drop"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            Supports PDF and DOCX files up to 5 MB. Server-side extraction with automated quality scoring.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isParsing}
            className="pointer-events-none"
          >
            {isParsing ? "Analyzing..." : "Choose File"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your raw resume text here (Education, Experience, Skills, Projects)..."
            rows={10}
            className="w-full rounded-xl border border-input bg-background p-4 text-xs font-mono leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{pastedText.length} characters</span>
            <Button
              type="button"
              onClick={() => handleParse(undefined, pastedText)}
              disabled={isParsing || pastedText.trim().length < 30}
              className="gap-2"
            >
              {isParsing && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isParsing ? "Parsing Resume..." : "Analyze Pasted Text"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

