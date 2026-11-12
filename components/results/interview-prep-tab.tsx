"use client";

import * as React from "react";
import {
  HelpCircle,
  Code2,
  Users,
  Lightbulb,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Award,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getScoreColor } from "@/lib/utils";
import type { InterviewQuestion, InterviewFeedback, Internship, ParsedResume } from "@/types";

interface InterviewPrepTabProps {
  internship: Internship;
  resume: ParsedResume;
}

export function InterviewPrepTab({ internship, resume }: InterviewPrepTabProps) {
  const [questions, setQuestions] = React.useState<InterviewQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState<boolean>(true);
  const [selectedQuestion, setSelectedQuestion] = React.useState<InterviewQuestion | null>(null);

  // Practice Mode State
  const [userAnswer, setUserAnswer] = React.useState<string>("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<InterviewFeedback | null>(null);

  const fetchQuestions = React.useCallback(async () => {
    setIsLoadingQuestions(true);
    const toastId = toast.loading("Generating customized technical & behavioral interview questions...");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: internship.title,
          company: internship.company,
          jobDescription: internship.description,
          resumeSkills: resume.skills,
          questionCount: 6,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load questions");

      const qList: InterviewQuestion[] = json.data.questions || [];
      setQuestions(qList);
      if (qList.length > 0) {
        setSelectedQuestion(qList[0]);
      }
      toast.success("Interview questions prepared!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate questions", { id: toastId });
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [internship, resume]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmitPractice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    if (userAnswer.trim().length < 15) {
      toast.error("Please write a slightly more detailed answer to receive meaningful feedback.");
      return;
    }

    setIsSubmittingAnswer(true);
    const toastId = toast.loading("AI interviewer is grading your response...");

    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.question,
          type: selectedQuestion.type,
          userAnswer: userAnswer.trim(),
          jobTitle: internship.title,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to evaluate answer");

      setFeedback(json.data);
      toast.success("Feedback ready!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Feedback generation failed", { id: toastId });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case "technical":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "behavioral":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      default:
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            Interview Preparation & Interactive Practice Simulator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Role-specific technical & behavioral questions with structured evaluation hints and live AI answer grading.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuestions}
          disabled={isLoadingQuestions}
          className="h-8 text-xs gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoadingQuestions ? "animate-spin" : ""}`} />
          New Questions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Bank (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Interview Question Bank</span>
            <span>{questions.length} Questions</span>
          </div>

          {isLoadingQuestions ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border p-4 space-y-2 animate-pulse">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted/60 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setFeedback(null);
                    setUserAnswer("");
                  }}
                  className={`cursor-pointer rounded-xl border p-4 text-xs transition-all ${
                    selectedQuestion?.id === q.id
                      ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30 shadow-sm"
                      : "border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getQuestionTypeBadge(
                        q.type
                      )}`}
                    >
                      {q.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Q#{idx + 1}</span>
                  </div>
                  <p className="font-semibold text-foreground line-clamp-2 leading-relaxed">
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Practice Simulator & Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedQuestion ? (
            <div className="space-y-4">
              {/* Question Detail Card with Hint & Framework */}
              <Card className="border-border/80">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="capitalize text-xs">
                      {selectedQuestion.type} Question
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    {selectedQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {/* Hint */}
                  <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-3 space-y-1">
                    <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                      What the interviewer is looking for:
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{selectedQuestion.hint}</p>
                  </div>

                  {/* Sample Framework & Keywords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="font-semibold text-foreground block mb-0.5">Recommended Framework:</span>
                      <span className="text-muted-foreground">{selectedQuestion.sampleFramework}</span>
                    </div>

                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="font-semibold text-foreground block mb-0.5">Expected Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedQuestion.expectedKeywords.map((k, i) => (
                          <span key={i} className="bg-background px-1.5 py-0.5 rounded text-[10px] text-foreground border">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Input Box */}
              <form onSubmit={handleSubmitPractice} className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-foreground flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-primary" />
                      Your Practice Answer
                    </label>
                    <span className="text-muted-foreground">{userAnswer.length} characters</span>
                  </div>
                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your response here using the suggested framework (STAR method or technical breakdown)..."
                    className="w-full rounded-xl border border-input bg-background p-3.5 text-xs sm:text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmittingAnswer || userAnswer.trim().length < 15}
                    className="gap-1.5 text-xs font-semibold shadow-sm"
                  >
                    {isSubmittingAnswer ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>{isSubmittingAnswer ? "Evaluating..." : "Submit Answer for AI Feedback"}</span>
                  </Button>
                </div>
              </form>

              {/* AI Feedback Panel */}
              {feedback && (
                <Card className="border-2 border-primary/30 bg-primary/[0.02] shadow-md animate-in fade-in">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                        <Award className="h-4 w-4 text-primary" />
                        AI Interviewer Evaluation
                      </CardTitle>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground font-semibold">Score:</span>
                        <Badge
                          variant="secondary"
                          className="text-sm font-black px-2.5 py-0.5 bg-primary text-primary-foreground"
                        >
                          {feedback.score} / 10
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 text-xs">
                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3 space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {feedback.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-3 space-y-1">
                        <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Areas to Sharpen
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {feedback.weaknesses.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Delivery & Structure critique */}
                    <div className="rounded-lg bg-muted/40 p-3 border border-border/40">
                      <span className="font-semibold text-foreground block mb-0.5">Structure & Delivery:</span>
                      <p className="text-muted-foreground leading-relaxed">{feedback.clarityAndStructure}</p>
                    </div>

                    {/* Exemplary Model Answer */}
                    <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-1.5">
                      <span className="font-bold text-primary flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Exemplary Benchmark Response
                      </span>
                      <p className="text-muted-foreground leading-relaxed italic">
                        &quot;{feedback.suggestedAnswer}&quot;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
              Select a question on the left to review hints and test your answer in practice mode.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

