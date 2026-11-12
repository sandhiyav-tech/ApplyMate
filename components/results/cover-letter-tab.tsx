"use client";

import * as React from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { CoverLetterResult, ParsedResume, Internship } from "@/types";

interface CoverLetterTabProps {
  resume: ParsedResume;
  internship: Internship;
  initialCoverLetter?: CoverLetterResult | null;
}

export function CoverLetterTab({
  resume,
  internship,
  initialCoverLetter,
}: CoverLetterTabProps) {
  const [tone, setTone] = React.useState<"formal" | "friendly" | "concise">("formal");
  const [letterText, setLetterText] = React.useState<string>(initialCoverLetter?.letterText || "");
  const [hook, setHook] = React.useState<string>(initialCoverLetter?.hook || "");
  const [keyMatches, setKeyMatches] = React.useState<string[]>(initialCoverLetter?.keyMatchesHighlighted || []);
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialCoverLetter);
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [customNotes, setCustomNotes] = React.useState<string>("");

  const generateLetter = React.useCallback(
    async (selectedTone: "formal" | "friendly" | "concise") => {
      setIsLoading(true);
      const toastId = toast.loading(`Drafting ${selectedTone} cover letter for ${internship.company}...`);

      try {
        const res = await fetch("/api/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume,
            jobTitle: internship.title,
            company: internship.company,
            jobDescription: internship.description,
            tone: selectedTone,
            customNotes: customNotes.trim() || undefined,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to generate cover letter");

        setLetterText(json.data.letterText);
        setHook(json.data.hook);
        setKeyMatches(json.data.keyMatchesHighlighted || []);
        toast.success("Tailored cover letter generated!", { id: toastId });
      } catch (err: any) {
        toast.error(err.message || "Failed to draft letter", { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
    [resume, internship, customNotes]
  );

  React.useEffect(() => {
    if (!initialCoverLetter) {
      generateLetter(tone);
    }
  }, [initialCoverLetter, generateLetter, tone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Generating Microsoft Word (.docx) document...");

    try {
      const res = await fetch("/api/cover-letter/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: resume.name || "Applicant",
          applicantEmail: resume.email,
          applicantPhone: resume.phone,
          applicantLocation: resume.location,
          jobTitle: internship.title,
          company: internship.company,
          letterText,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate document");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanCompany = internship.company.replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `Cover_Letter_${cleanCompany}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Cover letter downloaded as .docx!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Download failed", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const tones: { id: "formal" | "friendly" | "concise"; label: string; desc: string }[] = [
    { id: "formal", label: "Formal", desc: "Corporate & Finance" },
    { id: "friendly", label: "Friendly", desc: "Startups & Culture" },
    { id: "concise", label: "Concise", desc: "Punchy & Direct" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls: Tone Selector & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
        <div className="space-y-1">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Tone Persona</span>
          </div>
          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1.5 pt-1">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTone(t.id);
                  generateLetter(t.id);
                }}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tone === t.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Copy & Download .docx */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={isLoading || !letterText}
            className="h-9 text-xs gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadDocx}
            disabled={isDownloading || isLoading || !letterText}
            className="h-9 text-xs gap-1.5 font-semibold shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isDownloading ? "Generating..." : "Download .docx"}</span>
          </Button>
        </div>
      </div>

      {/* Highlights & Hook */}
      {hook && (
        <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/20 space-y-1 text-xs">
          <span className="font-bold text-primary flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Opening Attention Hook
          </span>
          <p className="text-muted-foreground italic">&quot;{hook}&quot;</p>
        </div>
      )}

      {/* Editable Letter Canvas */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-500" />
              <span>Full letter (editable directly below)</span>
            </div>
            <span>
              {letterText.trim().split(/\s+/).filter(Boolean).length} words • {letterText.length} chars
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-8 animate-pulse">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-3/4 bg-muted/60 rounded" />
            </div>
          ) : (
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-input bg-background p-4 text-xs sm:text-sm font-sans leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

