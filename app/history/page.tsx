"use client";

import * as React from "react";
import Link from "next/link";
import {
  History as HistoryIcon,
  Building2,
  Trash2,
  Calendar,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getScoreColor } from "@/lib/utils";
import type { SavedAnalysis } from "@/types";

export default function HistoryPage() {
  const [analyses, setAnalyses] = React.useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyses");
      const json = await res.json();
      if (res.ok) {
        setAnalyses(json.analyses || []);
      }
    } catch (err: any) {
      toast.error("Failed to load saved analyses");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to delete all saved analyses? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/data", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete analyses");
      setAnalyses([]);
      toast.success("History cleared successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to clear history");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-grid-pattern">
      <div className="container max-w-4xl px-4 sm:px-8 mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <HistoryIcon className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Saved Application Analyses
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Review previously diagnosed internship fits and readiness scores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {analyses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={isDeleting}
                className="text-xs text-destructive hover:bg-destructive/10 gap-1.5 h-9"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </Button>
            )}

            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 text-xs font-semibold h-9 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>New Analysis</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* List of saved analyses */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border p-5 space-y-3 animate-pulse">
                <div className="h-5 w-48 bg-muted rounded" />
                <div className="h-4 w-full bg-muted/60 rounded" />
              </div>
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <HistoryIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No saved analyses yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                After uploading your resume and analyzing an internship on the dashboard, click &quot;Save Analysis&quot; to pin it here.
              </p>
            </div>
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <span>Start Your First Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((item) => {
              const scoreColor = getScoreColor(item.readinessScore);
              return (
                <Card key={item.id} className="border-border/80 hover:border-primary/40 transition-all shadow-sm">
                  <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="font-semibold text-foreground">{item.companyName}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground">
                        {item.internshipTitle}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${scoreColor.bg} ${scoreColor.border}`}
                      >
                        <span className={`text-lg font-black ${scoreColor.text}`}>
                          {item.readinessScore}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          Readiness
                        </span>
                      </div>

                      <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="text-xs gap-1 h-8 font-semibold">
                          <span>Re-evaluate</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

