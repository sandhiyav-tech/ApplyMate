# 🚀 ApplyMate AI — Intelligent Internship Application Assistant

ApplyMate AI is a production-quality, full-stack web application designed to help university and college students land competitive internships. By pairing automated resume extraction with Anthropic Claude 3.5 Sonnet, ApplyMate evaluates student candidate fit, pinpoints exact skill gaps, rewrites resume bullet points with high-impact metrics, generates tailored cover letters (with 1-click `.docx` download), crafts personalized free learning roadmaps, and conducts interactive interview practice with live scoring.

---

## 🌟 Key Features

| Feature | Description | Route & API |
| :--- | :--- | :--- |
| **1. Deep Resume Parser** | Server-side parsing of **PDF** (`pdf-parse`) and **DOCX** (`mammoth`) or raw text. Extracts contact info, education, skills, projects, and work experience with an automated **0-100 baseline resume quality score**. | `/dashboard` & `POST /api/resume/parse` |
| **2. Smart Internship Matching** | Evaluates parsed resume against **20+ verified sample internships** across Tech, Data, Design, and Marketing. Ranks roles in real-time by match percentage. | `/dashboard` & `POST /api/match`, `GET /api/internships` |
| **3. Skill Gap Analysis** | Compares student capabilities directly to job requirements. Highlights matched skills, missing skills categorized by priority (**High, Medium, Low**), and standout bonus skills. | `/dashboard` & `POST /api/analyze` |
| **4. Resume Bullet Optimizer** | Provides role-specific **Before & After** bullet point rewrites with strong active verbs, quantifiable metrics, and recruiter rationale. | Tab in Results Hub & `POST /api/analyze` |
| **5. Career Readiness Score** | Holistic **0-100 readiness score** with sub-score breakdown (Skills, Projects, Experience, Resume Quality), hiring committee verdict badge, key strengths, and blockers. | Tab in Results Hub & `POST /api/analyze` |
| **6. Personalized Learning Roadmap** | Week-by-week curriculum (3, 4, or 6 weeks) focused on closing prioritized skill gaps using **100% free resources** (Official Docs, freeCodeCamp, YouTube, Coursera audit) and resume-ready mini projects. | Tab in Results Hub & `POST /api/roadmap` |
| **7. AI Cover Letter Generator** | Tailored letter with **Tone Selector** (*Formal, Friendly, Concise*), live editable textarea, copy to clipboard, and instant **Download as .docx** formatted document. | Tab in Results Hub & `POST /api/cover-letter`, `POST /api/cover-letter/download` |
| **8. Interview Simulator & Practice Mode** | Role-tailored technical and behavioral questions with hints, recommended frameworks (STAR, system breakdown), and an interactive **Practice Mode** where students type responses and receive instant AI feedback & scoring out of 10. | Tab in Results Hub & `POST /api/interview`, `POST /api/interview/feedback` |
| **9. Privacy & "Delete My Data"** | Zero data logging: raw resumes are never permanently retained. Users can permanently purge all session caches and saved history with one click. | Header / Navbar & `DELETE /api/user/data` |
| **10. Saved Analyses History** | View previously saved role evaluations and readiness diagnostics. | `/history` & `GET /api/analyses`, `POST /api/analyses` |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (Strict typing enabled across client & server)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + modular UI components (Cards, Tabs, Badges, Progress, Skeletons)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Seamless Dark / Light mode toggle)
- **AI / LLM**: [Anthropic Claude API](https://www.anthropic.com/) (`@anthropic-ai/sdk`, Claude 3.5 Sonnet) called strictly from server routes. Structured JSON validated with Zod. Includes high-fidelity heuristic simulation fallback for local development without an active key.
- **Resume Parsing**: `pdf-parse` (PDF) and `mammoth` (DOCX), processed securely server-side.
- **Exporting**: `docx` for generating formatted Microsoft Word documents.
- **Database & ORM**: PostgreSQL ([Neon](https://neon.tech/) / Vercel Postgres) with [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit`. Includes in-memory persistent fallback for immediate offline testing.
- **Authentication**: NextAuth.js (Auth.js) with Google OAuth and built-in Demo Student credentials provider.
- **Rate Limiting**: [Upstash Redis](https://upstash.com/) with automatic in-memory sliding window fallback in dev.
- **Validation**: Strict [Zod](https://zod.dev/) schemas on every API input and output.

---

## 📁 Project Structure

```text
ApplyMate AI/
├── app/
│   ├── api/
│   │   ├── resume/parse/route.ts          # POST: extract text & score resume quality
│   │   ├── match/route.ts                 # POST: rank internships by match %
│   │   ├── analyze/route.ts               # POST: readiness score, skill gaps & optimizations
│   │   ├── roadmap/route.ts               # POST: week-by-week learning roadmap
│   │   ├── cover-letter/route.ts          # POST: generate customized cover letter
│   │   ├── cover-letter/download/route.ts # POST: generate & download .docx document
│   │   ├── interview/route.ts             # POST: technical & behavioral questions
│   │   ├── interview/feedback/route.ts    # POST: AI evaluation of practice answers
│   │   ├── internships/route.ts           # GET: list 22 seeded internships
│   │   ├── analyses/route.ts              # GET & POST: fetch and save user analyses
│   │   ├── user/data/route.ts             # DELETE: purge session cache and user data
│   │   └── auth/[...nextauth]/route.ts    # NextAuth handler (Google & Demo)
│   ├── dashboard/
│   │   └── page.tsx                       # Multi-step wizard (Upload -> Choose -> Results Hub)
│   ├── history/
│   │   └── page.tsx                       # Saved analyses history
│   ├── globals.css                        # Tailwind tokens & dark mode variables
│   ├── layout.tsx                         # Root layout (Theme, Navbar, Footer, Toaster)
│   └── page.tsx                           # High-converting landing page with CTA
├── components/
│   ├── navbar.tsx                         # Navigation header with dark mode & delete data
│   ├── footer.tsx                         # Footer with privacy notice
│   ├── theme-provider.tsx                 # next-themes wrapper
│   ├── theme-toggle.tsx                   # Dark / Light theme toggle
│   ├── resume-uploader.tsx                # Drag-and-drop file upload & sample loaders
│   ├── internship-card.tsx                # Internship card with match badge
│   ├── internship-selector.tsx            # Filters, search bar & custom JD modal
│   ├── results/
│   │   ├── results-hub.tsx                # Orchestrator with tab navigation & actions
│   │   ├── career-readiness-tab.tsx       # 0-100 score gauge, breakdown & verdict
│   │   ├── skill-gap-tab.tsx              # Matched vs missing skills with priorities
│   │   ├── roadmap-tab.tsx                # Week-by-week timeline & free resources
│   │   ├── resume-tips-tab.tsx            # Before & After bullet point rewrites
│   │   ├── cover-letter-tab.tsx           # Tone selector, live editor & .docx download
│   │   └── interview-prep-tab.tsx         # Questions & interactive practice mode
│   └── ui/                                # Modular UI components (button, card, tabs, etc.)
├── db/
│   ├── schema.ts                          # Drizzle schema (users, internships, analyses)
│   ├── index.ts                           # Neon connection & data access helpers
│   └── seed.ts                            # 22 realistic sample internships
├── lib/
│   ├── ai/
│   │   ├── anthropic.ts                   # Anthropic Claude SDK client
│   │   ├── engine.ts                      # AI orchestration & intelligent fallback engine
│   │   └── ratelimit.ts                   # Upstash Redis & in-memory sliding window limiter
│   ├── parsers/
│   │   ├── pdf.ts                         # pdf-parse server wrapper
│   │   ├── docx.ts                        # mammoth server wrapper
│   │   └── cache.ts                       # SHA-256 session cache for parsed resumes
│   ├── auth.ts                            # NextAuth configuration
│   ├── docx-generator.ts                  # .docx file builder
│   ├── prompts.ts                         # Centralized LLM system & user prompt templates
│   ├── schemas.ts                         # Zod schemas for all inputs and outputs
│   └── utils.ts                           # Color gauges, badges & formatting helpers
└── types/
    └── index.ts                           # Shared TypeScript definitions
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ (tested on Node v20 and v24)
- **NPM**: v9+ or v10+

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the variables as needed:
```env
# Anthropic Claude API Key (Optional for demo simulation; required for live Claude calls)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# PostgreSQL Database (Neon or Vercel Postgres)
DATABASE_URL="postgres://user:password@ep-sample-pool.us-east-2.aws.neon.tech/applymate?sslmode=require"

# NextAuth Authentication
AUTH_SECRET="applymate-super-secret-key-32-chars-long-min"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="google-client-id-placeholder"
AUTH_GOOGLE_SECRET="google-client-secret-placeholder"

# Upstash Redis Rate Limiting (Optional; in-memory rate limiter acts as fallback)
UPSTASH_REDIS_REST_URL="https://example.upstash.io"
UPSTASH_REDIS_REST_TOKEN="upstash-token-placeholder"
```

> **Note**: ApplyMate AI includes automated fallback drivers. You can run and test the complete application locally even before provisioning external databases or API keys. When live credentials are provided, it automatically switches to production PostgreSQL, Claude 3.5 Sonnet, and Upstash Redis.

### 4. Database Setup & Seeding
Push the Drizzle schema to your PostgreSQL database and seed the 22 sample internships:
```bash
# Push schema tables to PostgreSQL
npm run db:push

# Seed realistic sample internships across Tech, Data, Design, and Marketing
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Full User Flow

1. **Landing Page (`/`)**:
   - Review value proposition and click **"Analyze My Resume & Find Matches"**.
2. **Step 1: Upload Resume (`/dashboard`)**:
   - Drag & drop any PDF/DOCX resume (up to 5 MB), paste text, or click **"Load CS & Tech Resume"** for instant 1-click testing.
   - Inspect the extracted contact info, education, skills, projects, and **Quality Score (out of 100)** with completeness, impact, and formatting metrics.
3. **Step 2: Choose Internship (`/dashboard`)**:
   - Filter by category (*All, Tech, Data, Design, Marketing*) or search for specific skills (e.g. `React`, `SQL`, `Figma`).
   - Notice the AI-ranked match percentages calculated specifically against your resume.
   - Or click **"Paste Any Job Description"** to evaluate against any external role. Click **"Analyze Fit"**.
4. **Step 3: Results Hub (`/dashboard`)**:
   - **Career Readiness Tab**: Check 0-100 overall score, radar breakdown, verdict badge, key strengths, and primary blockers.
   - **Skill Gaps Tab**: Review matched skills (green badges) and missing skills (with High/Medium/Low priority badges and recruiter rationale).
   - **Learning Roadmap Tab**: Explore the week-by-week plan with curated **100% free resources** (official docs, freeCodeCamp, YouTube, Coursera audit) and a weekly portfolio mini-project deliverable. Switch duration between 3, 4, and 6 weeks.
   - **Resume Optimizer Tab**: Inspect side-by-side **Before & After** bullet point rewrites tailored to the role. Click **"Copy Bullet"** to copy to clipboard.
   - **Cover Letter Tab**: Select tone (*Formal, Friendly, Concise*), edit directly in the live canvas, click **"Copy Text"**, or click **"Download as .docx"** to download a formatted Word document.
   - **Interview Prep Tab**: Review technical and behavioral questions with hints. Select a question, type your response into the **Practice Simulator**, and click **"Submit Answer for AI Feedback"** to receive an instant score out of 10, strengths, improvement areas, and a model benchmark answer.
5. **Saved History (`/history`)**:
   - In Results Hub, click **"Save Analysis"**. Navigate to `/history` to view your saved evaluations.
6. **Privacy ("Delete My Data")**:
   - Click **"Delete My Data"** in the top navigation bar and confirm to permanently purge all session caches and saved analyses.

---

## 🚢 Vercel Deployment Instructions

ApplyMate AI is optimized for zero-config serverless deployment on Vercel.

### 1. Push Code to GitHub / GitLab / Bitbucket
```bash
git init
git add .
git commit -m "Initial commit of ApplyMate AI production MVP"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
2. Import your ApplyMate AI repository.
3. In **Environment Variables**, add:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key (`sk-ant-...`)
   - `DATABASE_URL`: Connection string from Neon or Vercel Postgres (`postgres://...`)
   - `AUTH_SECRET`: Generate a random 32-character string (`openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g. `https://applymate-ai.vercel.app`)
   - `AUTH_GOOGLE_ID`: (Optional) Google OAuth Client ID
   - `AUTH_GOOGLE_SECRET`: (Optional) Google OAuth Client Secret
   - `UPSTASH_REDIS_REST_URL`: (Optional) Upstash Redis endpoint URL
   - `UPSTASH_REDIS_REST_TOKEN`: (Optional) Upstash Redis REST token
4. Click **"Deploy"**.

### 3. Run Production Database Migrations
After linking your project via the Vercel CLI or from your local machine:
```bash
# Push schema and seed production database
npx drizzle-kit push
npm run db:seed
```

---

## 🛡️ Security & Privacy Compliance

- **No Resume Data Retention**: Raw resume file contents are never stored in plain text or used for model training.
- **Session-Based Cache**: Parsed resume structures are cached in-memory with SHA-256 hashes per session to prevent repeated billing costs and purge automatically.
- **Serverless Isolation**: Anthropic API keys are strictly guarded inside server-side Route Handlers with `maxDuration = 60` and are never exposed to the client.
- **File Validation**: Strict server-side verification rejecting files over 5 MB and restricting MIME types to PDF and DOCX.
- **Rate Limiting**: Protected against denial-of-service abuse via sliding window rate limiting.

---

## 📄 License
MIT License. Built for students targeting competitive internships.

