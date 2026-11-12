"use client";

import * as React from "react";
import {
  Award,
  Layers,
  MapPin,
  Calendar,
  FileText,
  HelpCircle,
  Bookmark,
  Check,
  Building2,
  RefreshCw,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerReadinessTab } from "./career-readiness-tab";
import { SkillGapTab } from "./skill-gap-tab";
import { RoadmapTab } from "./roadmap-tab";
import { ResumeTipsTab } from "./resume-tips-tab";
import { CoverLetterTab } from "./cover-letter-tab";
import { InterviewPrepTab } from "./interview-prep-tab";
import { toast } from "sonner";
import type { FullAnalysisResult, ParsedResume, Internship } from "@/types";

interface ResultsHubProps {
  analysis: FullAnalysisResult;
  resume: ParsedResume;
  internship: Internship;
  onChangeInternship: () => void;
  onResetAll: () => void;
}

export function ResultsHub({
  analysis,
  resume,
  internship,
  onChangeInternship,
  onResetAll,
}: ResultsHubProps) {
  const [activeTab, setActiveTab] = React.useState<string>("readiness");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const handleSaveAnalysis = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving analysis to your profile history...");

    try {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId: internship.id,
          internshipTitle: internship.title,
          companyName: internship.company,
          readinessScore: analysis.readiness.overallScore,
          summary: analysis.readiness.verdictSummary,
          fullAnalysisData: analysis,
        }),
      });

      if (!res.ok) throw new Error("Failed to save analysis");

      setIsSaved(true);
      toast.success("Analysis saved to History!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to save", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <button
              onClick={onChangeInternship}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Choose different role</span>
            </button>
            <span>•</span>
            <span className="text-foreground font-semibold flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {internship.company}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {internship.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <Badge variant="secondary" className="capitalize text-[11px]">
              {internship.type}
            </Badge>
            <Badge variant="outline" className="text-[11px]">
              Candidate: {resume.name}
            </Badge>
            <span className="text-muted-foreground">
              Evaluated on {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveAnalysis}
            disabled={isSaving || isSaved}
            className="text-xs gap-1.5 h-9"
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Saved in History</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Analysis</span>
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onChangeInternship}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Compare Another Role</span>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Responsive Scrollable Tabs Bar */}
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-full justify-start min-w-[640px] bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="readiness" className="gap-2 text-xs">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Career Readiness</span>
            </TabsTrigger>
            <TabsTrigger value="skillgaps" className="gap-2 text-xs">
              <Layers className="h-3.5 w-3.5 text-amber-500" />
              <span>Skill Gaps ({analysis.skillGap.missingSkills.length})</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span>Learning Roadmap</span>
            </TabsTrigger>
            <TabsTrigger value="resumetips" className="gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Resume Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="coverletter" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-purple-500" />
              <span>Cover Letter Generator</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="gap-2 text-xs">
              <HelpCircle className="h-3.5 w-3.5 text-rose-500" />
              <span>Interview Prep & Practice</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Career Readiness */}
        <TabsContent value="readiness">
          <CareerReadinessTab
            readiness={analysis.readiness}
            internshipTitle={internship.title}
            companyName={internship.company}
          />
        </TabsContent>

        {/* Tab 2: Skill Gaps */}
        <TabsContent value="skillgaps">
          <SkillGapTab
            skillGap={analysis.skillGap}
            onGenerateRoadmapTab={() => setActiveTab("roadmap")}
          />
        </TabsContent>

        {/* Tab 3: Learning Roadmap */}
        <TabsContent value="roadmap">
          <RoadmapTab
            targetRole={internship.title}
            missingSkills={analysis.skillGap.missingSkills.map((m) => m.skill)}
            currentSkills={resume.skills}
          />
        </TabsContent>

        {/* Tab 4: Resume Tips */}
        <TabsContent value="resumetips">
          <ResumeTipsTab
            optimizations={analysis.optimizations}
            internshipTitle={internship.title}
          />
        </TabsContent>

        {/* Tab 5: Cover Letter */}
        <TabsContent value="coverletter">
          <CoverLetterTab
            resume={resume}
            internship={internship}
          />
        </TabsContent>

        {/* Tab 6: Interview Prep */}
        <TabsContent value="interview">
          <InterviewPrepTab
            internship={internship}
            resume={resume}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

