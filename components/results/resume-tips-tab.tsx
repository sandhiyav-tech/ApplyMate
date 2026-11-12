"use client";

import * as React from "react";
import { Copy, Check, Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ResumeOptimizationSuggestion } from "@/types";

interface ResumeTipsTabProps {
  optimizations: ResumeOptimizationSuggestion[];
  internshipTitle: string;
}

export function ResumeTipsTab({ optimizations, internshipTitle }: ResumeTipsTabProps) {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Optimized bullet copied to clipboard!");
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Targeted Resume Bullet Point Rewrites
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Optimized specifically for the <span className="font-semibold text-foreground">{internshipTitle}</span> role using quantifiable impact and strong technical verbs.
          </p>
        </div>
      </div>

      {/* List of Before & After suggestions */}
      <div className="space-y-5">
        {optimizations.map((item, idx) => (
          <Card key={idx} className="border-border/80 overflow-hidden">
            <CardHeader className="pb-3 bg-muted/10 border-b border-border/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    Suggestion #{idx + 1}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    Target Skill: <span className="text-primary">{item.targetedSkill}</span>
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(item.optimizedBullet, idx)}
                  className="h-8 text-xs gap-1.5 font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Bullet */}
                <div className="space-y-1.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase">
                      Before
                    </span>
                    <span>Standard Phrasing</span>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed pt-1">
                    &quot;{item.originalBullet}&quot;
                  </p>
                </div>

                {/* Optimized Bullet */}
                <div className="space-y-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase">
                      After
                    </span>
                    <span>High-Impact AI Optimization</span>
                  </div>
                  <p className="text-foreground font-medium leading-relaxed pt-1">
                    &quot;{item.optimizedBullet}&quot;
                  </p>
                </div>
              </div>

              {/* Recruiter Strategy Insight */}
              <div className="rounded-lg bg-muted/40 p-3 flex items-start gap-2.5 text-xs text-muted-foreground border border-border/40">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Why this catches recruiters&apos; eyes: </span>
                  {item.explanation}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

