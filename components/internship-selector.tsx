"use client";

import * as React from "react";
import { Search, Filter, PlusCircle, Sparkles, Building, Briefcase, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InternshipCard } from "./internship-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Internship, ParsedResume } from "@/types";

interface InternshipSelectorProps {
  resume: ParsedResume | null;
  onSelectInternship: (internship: Internship) => void;
  selectedInternship: Internship | null;
}

export function InternshipSelector({
  resume,
  onSelectInternship,
  selectedInternship,
}: InternshipSelectorProps) {
  const [internships, setInternships] = React.useState<Internship[]>([]);
  const [category, setCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showCustomModal, setShowCustomModal] = React.useState<boolean>(false);

  // Custom Job Description Form State
  const [customTitle, setCustomTitle] = React.useState("");
  const [customCompany, setCustomCompany] = React.useState("");
  const [customDesc, setCustomDesc] = React.useState("");
  const [customSkills, setCustomSkills] = React.useState("");

  const fetchMatches = React.useCallback(async () => {
    setLoading(true);
    try {
      if (resume) {
        // Use matching endpoint to compute real-time scores
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume,
            category: category === "all" ? undefined : category,
            search: search.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setInternships(data.internships || []);
        } else {
          throw new Error(data.error);
        }
      } else {
        // Fallback to plain internships catalog
        const params = new URLSearchParams();
        if (category !== "all") params.set("category", category);
        if (search.trim()) params.set("search", search.trim());

        const res = await fetch(`/api/internships?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setInternships(data.internships || []);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load internship roles");
    } finally {
      setLoading(false);
    }
  }, [resume, category, search]);

  React.useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customCompany.trim() || !customDesc.trim()) {
      toast.error("Please fill in role title, company, and job description.");
      return;
    }

    const skillsArray = customSkills
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const customRole: Internship = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      company: customCompany.trim(),
      location: "Custom / Remote",
      type: "remote",
      category: "tech",
      stipend: "Competitive",
      deadline: "Rolling",
      description: customDesc.trim(),
      requiredSkills: skillsArray.length > 0 ? skillsArray : ["Communication", "Problem Solving"],
      preferredSkills: [],
      responsibilities: [
        "Collaborate with internal stakeholders to drive project deliverables.",
        "Implement and iterate on functional requirements.",
      ],
    };

    toast.success(`Custom role created for ${customCompany}! Running analysis...`);
    setShowCustomModal(false);
    onSelectInternship(customRole);
  };

  const categories = [
    { id: "all", label: "All Roles" },
    { id: "tech", label: "Engineering & Tech" },
    { id: "data", label: "Data & AI" },
    { id: "design", label: "Product & Design" },
    { id: "marketing", label: "Marketing & Growth" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Custom Job Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {resume ? "Ranked Internship Matches" : "Explore Verified Internships"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {resume
              ? "Ranked by AI fit against your parsed skills, coursework, and portfolio projects."
              : "Select a verified company role below or paste your own job posting to evaluate."}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowCustomModal(true)}
          className="gap-2 text-xs font-semibold shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-primary" />
          <span>Paste Any Job Description</span>
        </Button>
      </div>

      {/* Filter Toolbar: Categories & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${category === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role, company, or skill..."
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Internship Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-44" />
                </div>
                <Skeleton className="h-10 w-12 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center space-y-3">
          <Briefcase className="h-8 w-8 mx-auto text-muted-foreground" />
          <h4 className="text-base font-semibold text-foreground">No matching internships found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or category filter, or click &quot;Paste Any Job Description&quot; to test against a custom external role.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("all"); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onSelect={onSelectInternship}
              isSelected={selectedInternship?.id === internship.id}
            />
          ))}
        </div>
      )}

      {/* Custom Job Description Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-lg w-full rounded-2xl border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Paste Custom Job Description</h3>
                  <p className="text-xs text-muted-foreground">
                    Analyze any internship from LinkedIn, Handshake, or company careers pages.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Role Title *</label>
                <Input
                  required
                  placeholder="e.g. Software Engineering Intern"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Company Name *</label>
                <Input
                  required
                  placeholder="e.g. Stripe, Figma, or Local Startup"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Key Skills or Requirements (comma separated)
                </label>
                <Input
                  placeholder="e.g. React, TypeScript, Python, SQL"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Full Job Description / Requirements *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste the requirements, qualifications, and role description text..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCustomModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Analyze Custom Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

