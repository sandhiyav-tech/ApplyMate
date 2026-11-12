import * as React from "react";
import { CheckCircle2, AlertCircle, PlusCircle, ArrowUpRight, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPriorityBadge } from "@/lib/utils";
import type { SkillGapAnalysis } from "@/types";

interface SkillGapTabProps {
  skillGap: SkillGapAnalysis;
  onGenerateRoadmapTab?: () => void;
}

export function SkillGapTab({ skillGap, onGenerateRoadmapTab }: SkillGapTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Overview Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Skill Overlap Diagnostic
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Matching {skillGap.matchedSkills.length} verified candidate skills against role requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground">Match Rate</div>
            <div className="text-xl font-black text-primary">{skillGap.matchRate}%</div>
          </div>
          {onGenerateRoadmapTab && (
            <button
              onClick={onGenerateRoadmapTab}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Build Roadmap for Gaps</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Skills with Priority */}
        <Card className="border-amber-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Missing or Under-represented Skills ({skillGap.missingSkills.length})
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Prioritized by how critical each skill is for clearing technical screenings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillGap.missingSkills.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                None! You have matched all essential skills listed for this role.
              </p>
            ) : (
              skillGap.missingSkills.map((gap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5 transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-foreground">{gap.skill}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">{gap.category}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(
                          gap.priority
                        )}`}
                      >
                        {gap.priority} priority
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{gap.reason}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Matched & Bonus Skills */}
        <div className="space-y-6">
          {/* Matched Skills */}
          <Card className="border-emerald-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Matched Core Skills ({skillGap.matchedSkills.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Verified proficiencies present in your resume that directly align with this role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.matchedSkills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="success"
                    className="text-xs px-2.5 py-1 font-medium gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bonus / Standout Skills */}
          {skillGap.bonusSkills && skillGap.bonusSkills.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Bonus Differentiating Skills ({skillGap.bonusSkills.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Valuable competencies you bring that exceed baseline qualifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {skillGap.bonusSkills.map((bonus, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs px-2.5 py-1 font-medium text-foreground bg-primary/10"
                    >
                      +{bonus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

