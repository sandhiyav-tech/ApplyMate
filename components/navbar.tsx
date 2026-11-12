"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Trash2, History, Compass, ArrowRight, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDeleteData = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/user/data", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete data");
      toast.success("All personal resume and analysis data has been permanently cleared.");
      setShowConfirm(false);
      // Optional: reset dashboard state if user is on dashboard
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to purge data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-foreground">ApplyMate</span>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">AI</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-primary ${
                pathname === "/dashboard" ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Application Assistant
            </Link>
            <Link
              href="/history"
              className={`transition-colors hover:text-primary ${
                pathname === "/history" ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Saved History
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Delete my data button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="text-muted-foreground hover:text-destructive text-xs gap-1.5"
              title="Delete all parsed resume data and session history"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Delete My Data</span>
            </Button>

            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 font-medium shadow-sm">
                <span>Start Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="rounded-full bg-destructive/10 p-2.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Permanently Delete Data?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In accordance with privacy best practices, ApplyMate AI never stores your raw resume files permanently. Clicking confirm will purge your parsed resume session cache, custom match scores, and saved analysis entries.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteData} disabled={isDeleting}>
                {isDeleting ? "Purging..." : "Yes, Purge My Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

