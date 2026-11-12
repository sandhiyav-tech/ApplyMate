"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ResumeUploader } from "@/components/resume-uploader";
import { InternshipSelector } from "@/components/internship-selector";
import { ResultsHub } from "@/components/results/results-hub";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { ParsedResume, Internship, FullAnalysisResult } from "@/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialStepParam = searchParams.get("step");

  const [step, setStep] = React.useState<1 | 2 | 3>(
    initialStepParam === "2" ? 2 : 1
  );
  const [parsedResume, setParsedResume] = React.useState<ParsedResume | null>(null);
  const [selectedInternship, setSelectedInternship] = React.useState<Internship | null>(null);
  const [fullAnalysis, setFullAnalysis] = React.useState<FullAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);

  // Load from sessionStorage if available
  React.useEffect(() => {
    try {
      const savedResume = sessionStorage.getItem("applymate_resume");
      if (savedResume) {
        setParsedResume(JSON.parse(savedResume));
      }
      const savedInternship = sessionStorage.getItem("applymate_internship");
      if (savedInternship) {
        setSelectedInternship(JSON.parse(savedInternship));
      }
      const savedAnalysis = sessionStorage.getItem("applymate_analysis");
      if (savedAnalysis) {
        setFullAnalysis(JSON.parse(savedAnalysis));
        setStep(3);
      }
    } catch (e) {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  const handleResumeParsed = (resume: ParsedResume) => {
    setParsedResume(resume);
    try {
      sessionStorage.setItem("applymate_resume", JSON.stringify(resume));
    } catch (e) {}
    // Automatically transition to step 2 after brief delay
    setTimeout(() => {
      setStep(2);
    }, 600);
  };

  const handleSelectInternship = async (internship: Internship) => {
    setSelectedInternship(internship);
    try {
      sessionStorage.setItem("applymate_internship", JSON.stringify(internship));
    } catch (e) {}

    // If we have a parsed resume, automatically trigger full analysis
    if (parsedResume) {
      await runFullAnalysis(parsedResume, internship);
    } else {
      // Prompt user to upload resume first
      toast.info("Please upload your resume to analyze your match against this role.");
      setStep(1);
    }
  };

  const runFullAnalysis = async (resume: ParsedResume, internship: Internship) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    const toastId = toast.loading(`Running AI fit analysis for ${internship.title} at ${internship.company}...`);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          internship,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze role fit");
      }

      setFullAnalysis(json.data);
      try {
        sessionStorage.setItem("applymate_analysis", JSON.stringify(json.data));
      } catch (e) {}

      toast.success("Comprehensive analysis ready!", { id: toastId });
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "An unexpected error occurred during analysis.");
      toast.error(err.message || "Analysis failed", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setParsedResume(null);
    setSelectedInternship(null);
    setFullAnalysis(null);
    setStep(1);
    try {
      sessionStorage.removeItem("applymate_resume");
      sessionStorage.removeItem("applymate_internship");
      sessionStorage.removeItem("applymate_analysis");
    } catch (e) {}
    toast.info("Session reset. Upload a new resume to start fresh.");
  };

  // Step Progress Calculation
  const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-grid-pattern">
      <div className="container max-w-6xl px-4 sm:px-8 mx-auto space-y-8">
        {/* Step Indicator Header */}
        <div className="space-y-4 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Application Assistant Wizard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {step === 1 && "Step 1: Upload or Paste Your Resume"}
            {step === 2 && "Step 2: Choose Your Target Internship"}
            {step === 3 && "Step 3: Comprehensive Application Diagnostics"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground">
            {step === 1 && "We extract skills, projects, and coursework with zero permanent retention."}
            {step === 2 && "Ranked by AI against your specific background and technical capabilities."}
            {step === 3 && "Review career readiness, skill gaps, learning roadmaps, and practice questions."}
          </p>

          {/* Progress Tracker */}
          <div className="space-y-2 pt-2 max-w-md mx-auto">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Resume</span>
              <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Internship</span>
              <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Results Hub</span>
            </div>
          </div>
        </div>

        {/* Loading overlay when running full analysis */}
        {isAnalyzing && (
          <div className="rounded-2xl border bg-card p-12 text-center shadow-lg space-y-4 max-w-md mx-auto animate-in fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Analyzing Your Candidate Fit...</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Claude AI is matching your skills against {selectedInternship?.company}, prioritizing missing competencies, and generating bullet rewrites.
            </p>
          </div>
        )}

        {/* Error message with retry */}
        {analysisError && !isAnalyzing && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3 max-w-md mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h4 className="text-sm font-bold text-destructive">Analysis Failed</h4>
            <p className="text-xs text-muted-foreground">{analysisError}</p>
            <Button
              size="sm"
              onClick={() => {
                if (parsedResume && selectedInternship) {
                  runFullAnalysis(parsedResume, selectedInternship);
                }
              }}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Analysis</span>
            </Button>
          </div>
        )}

        {/* Step 1: Upload Resume */}
        {!isAnalyzing && step === 1 && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <ResumeUploader
              onParsed={handleResumeParsed}
              parsedResume={parsedResume}
              onReset={() => setParsedResume(null)}
            />

            {parsedResume && (
              <div className="flex justify-end pt-4">
                <Button
                  size="lg"
                  onClick={() => setStep(2)}
                  className="gap-2 font-bold shadow-md"
                >
                  <span>Continue to Step 2: Choose Internship</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Choose Internship */}
        {!isAnalyzing && step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Resume</span>
              </Button>

              {parsedResume && (
                <div className="text-xs text-muted-foreground">
                  Evaluating for: <span className="font-semibold text-foreground">{parsedResume.name}</span>
                </div>
              )}
            </div>

            <InternshipSelector
              resume={parsedResume}
              onSelectInternship={handleSelectInternship}
              selectedInternship={selectedInternship}
            />
          </div>
        )}

        {/* Step 3: Results Hub */}
        {!isAnalyzing && step === 3 && fullAnalysis && parsedResume && selectedInternship && (
          <div className="animate-in fade-in">
            <ResultsHub
              analysis={fullAnalysis}
              resume={parsedResume}
              internship={selectedInternship}
              onChangeInternship={() => setStep(2)}
              onResetAll={resetAll}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <span>Loading Application Assistant...</span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}


