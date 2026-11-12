import * as React from "react";
import { Building2, MapPin, DollarSign, Calendar, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCategory, getScoreColor } from "@/lib/utils";
import type { Internship } from "@/types";

interface InternshipCardProps {
  internship: Internship;
  onSelect: (internship: Internship) => void;
  isSelected?: boolean;
}

export function InternshipCard({ internship, onSelect, isSelected }: InternshipCardProps) {
  const matchColor = internship.matchPercentage ? getScoreColor(internship.matchPercentage) : null;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-2 border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.02]"
          : "hover:border-primary/40 border-border/80"
      }`}
    >
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
        {/* Top meta */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>{internship.company}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {internship.title}
              </h3>
            </div>

            {/* Match percentage pill */}
            {internship.matchPercentage !== undefined && matchColor && (
              <div
                className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 border ${matchColor.bg} ${matchColor.border} shrink-0`}
              >
                <span className={`text-base font-extrabold ${matchColor.text} leading-none`}>
                  {internship.matchPercentage}%
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                  Match
                </span>
              </div>
            )}
          </div>

          {/* Badges: Type, Category, Location */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Badge variant="outline" className="capitalize text-[11px] font-normal">
              {internship.type}
            </Badge>
            <Badge variant="secondary" className="text-[11px] font-medium">
              {formatCategory(internship.category)}
            </Badge>
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <MapPin className="h-3 w-3" />
              {internship.location}
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {internship.description}
          </p>
        </div>

        {/* Skills required tags */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Key Technologies:
          </div>
          <div className="flex flex-wrap gap-1">
            {internship.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
            {internship.requiredSkills.length > 4 && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{internship.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Compensation, Deadline & Action CTA */}
        <div className="border-t border-border/40 pt-3 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span>{internship.stipend}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Due {internship.deadline}</span>
            </div>
          </div>

          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(internship)}
            className="gap-1.5 text-xs font-semibold group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
          >
            <span>{isSelected ? "Selected" : "Analyze Fit"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

