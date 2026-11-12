"use client";

import * as React from "react";
import {
  Calendar,
  ExternalLink,
  Clock,
  BookOpen,
  Code2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FolderGit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { LearningRoadmap } from "@/types";

interface RoadmapTabProps {
  initialRoadmap?: LearningRoadmap | null;
  targetRole: string;
  missingSkills: string[];
  currentSkills: string[];
}

export function RoadmapTab({
  initialRoadmap,
  targetRole,
  missingSkills,
  currentSkills,
}: RoadmapTabProps) {
  const [roadmap, setRoadmap] = React.useState<LearningRoadmap | null>(initialRoadmap || null);
  const [durationWeeks, setDurationWeeks] = React.useState<number>(4);
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialRoadmap);

  const fetchRoadmap = React.useCallback(
    async (weeks: number) => {
      setIsLoading(true);
      const toastId = toast.loading("Generating personalized week-by-week roadmap...");
      try {
        const res = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole,
            missingSkills: missingSkills.length > 0 ? missingSkills : ["Docker", "PostgreSQL", "Next.js"],
            currentSkills,
            durationWeeks: weeks,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to generate roadmap");

        setRoadmap(json.data);
        toast.success("Learning roadmap ready!", { id: toastId });
      } catch (err: any) {
        toast.error(err.message || "Failed to load roadmap", { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
    [targetRole, missingSkills, currentSkills]
  );

  React.useEffect(() => {
    if (!initialRoadmap) {
      fetchRoadmap(durationWeeks);
    }
  }, [initialRoadmap, fetchRoadmap, durationWeeks]);

  const getResourceTypeBadge = (type: string) => {
    switch (type) {
      case "Official Docs":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "freeCodeCamp":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "YouTube":
        return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";
      case "Coursera Audit":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Skill Gap Closing Timeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Targeting: <span className="font-semibold text-foreground">{targetRole}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border text-xs">
            <span className="text-muted-foreground px-2">Duration:</span>
            {[3, 4, 6].map((w) => (
              <button
                key={w}
                onClick={() => {
                  setDurationWeeks(w);
                  fetchRoadmap(w);
                }}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  durationWeeks === w
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {w} Weeks
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRoadmap(durationWeeks)}
            disabled={isLoading}
            className="h-8 text-xs gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse space-y-3">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-20 w-full bg-muted/40 rounded-xl" />
            </Card>
          ))}
        </div>
      ) : roadmap ? (
        <div className="space-y-6">
          {/* Timeline Weeks */}
          <div className="space-y-5">
            {roadmap.weeks.map((week) => (
              <Card key={week.weekNumber} className="relative overflow-hidden border-border/80">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
                <CardHeader className="pb-3 pl-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        Week {week.weekNumber}
                      </span>
                      <CardTitle className="text-base font-bold text-foreground">
                        {week.topic}
                      </CardTitle>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {week.skillsTargeted.map((s, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[11px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">Weekly Goal:</span> {week.goal}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pl-7">
                  {/* Curated Free Resources */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      Free Learning Curriculums:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {week.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-primary/40 transition-all text-xs"
                        >
                          <div className="space-y-1 pr-2">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                              <span>{res.title}</span>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getResourceTypeBadge(
                                  res.type
                                )}`}
                              >
                                {res.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ~{res.estimatedHours} hrs
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                100% Free
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Mini Project */}
                  <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <FolderGit2 className="h-3.5 w-3.5 text-primary" />
                        Week {week.weekNumber} Portfolio Deliverable: {week.miniProject.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-background">
                        Resume Project
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {week.miniProject.description}
                    </p>
                    <div className="text-[11px] text-primary font-medium flex items-center gap-1 pt-1">
                      <Code2 className="h-3 w-3" />
                      <span>Deliverable: {week.miniProject.deliverable}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Road to Mastery Milestones */}
          {roadmap.milestones && roadmap.milestones.length > 0 && (
            <Card className="border-emerald-500/20 bg-emerald-500/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Key Readiness Milestones Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                {roadmap.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}

