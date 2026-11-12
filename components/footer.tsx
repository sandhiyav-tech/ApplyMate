import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 py-12 text-sm text-muted-foreground">
      <div className="container max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground text-base">ApplyMate AI</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Empowering students with intelligent, personalized internship application guidance. Instant resume parsing, role fit diagnostics, customized learning roadmaps, and interview simulation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Zero data retention: resume contents are never sold or logged.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Role Matching
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Interview Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Compliance */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>Next.js 14 App Router</li>
              <li>Anthropic Claude 3.5 Sonnet</li>
              <li>PostgreSQL & Drizzle ORM</li>
              <li>Upstash Sliding Window Limiter</li>
              <li>Serverless on Vercel</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/40 pt-6 text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} ApplyMate AI. Built for students targeting competitive internships.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Privacy & Retention
            </Link>
            <span>•</span>
            <Link href="/history" className="hover:text-primary transition-colors">
              Analyses
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

