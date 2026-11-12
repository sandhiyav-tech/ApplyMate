import * as React from "react";
import { CheckCircle2, AlertTriangle, Award, ShieldAlert, TrendingUp, Sparkles, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getScoreColor } from "@/lib/utils";
import type { CareerReadinessScore } from "@/types";

interface CareerReadinessTabProps {
  readiness: CareerReadinessScore;
  internshipTitle: string;
  companyName: string;
}

export function CareerReadinessTab({
  readiness,
  internshipTitle,
  companyName,
}: CareerReadinessTabProps) {
  const overallColor = getScoreColor(readiness.overallScore);

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Excellent Fit":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "Competitive Candidate":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "Good Foundation - Needs Skill Growth":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      default:
        return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Score & Executive Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Radial Gauge Card */}
        <Card className="glass-card flex flex-col items-center justify-center p-6 text-center space-y-3 border-2 border-primary/20">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="h-4 w-4 text-primary" />
            Overall Fit Score
          </div>

          <div className="relative flex items-center justify-center">
            {/* Circular Ring Glow */}
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${overallColor.border} ${overallColor.bg} shadow-lg`}
            >
              <div className="flex flex-col items-center">
                <span className={`text-4xl font-black ${overallColor.text} tracking-tight`}>
                  {readiness.overallScore}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  out of 100
                </span>
              </div>
            </div>
          </div>

          <Badge className={`text-xs px-3 py-1 font-semibold border ${getVerdictBadge(readiness.verdict)}`}>
            {readiness.verdict}
          </Badge>
        </Card>

        {/* Verdict Summary & Sub-score breakdown */}
        <Card className="md:col-span-2 glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Hiring Committee Evaluation Verdict
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {readiness.verdictSummary}
            </p>
          </div>

          {/* Subscore progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/40 pt-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Required Skills Match
                </span>
                <span className="font-bold text-foreground">{readiness.breakdown.skills}%</span>
              </div>
              <Progress value={readiness.breakdown.skills} className="h-2" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Project Portfolio Proof
                </span>
                <span className="font-bold text-foreground">{readiness.breakdown.projects}%</span>
              </div>
              <Progress value={readiness.breakdown.projects} className="h-2" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Prior Experience Fit
                </span>
                <span className="font-bold text-foreground">{readiness.breakdown.experience}%</span>
              </div>
              <Progress value={readiness.breakdown.experience} className="h-2" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Resume Baseline Quality
                </span>
                <span className="font-bold text-foreground">{readiness.breakdown.resumeQuality}%</span>
              </div>
              <Progress value={readiness.breakdown.resumeQuality} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Strengths & Primary Blockers Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-emerald-500/20 bg-emerald-500/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Key Competitive Advantages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {readiness.keyStrengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{str}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Primary Blockers */}
        <Card className="border-amber-500/20 bg-amber-500/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Primary Application Gaps to Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {readiness.primaryBlockers.map((blk, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{blk}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

