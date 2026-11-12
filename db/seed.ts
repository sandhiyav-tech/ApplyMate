import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { internships } from "./schema";

export const SEED_INTERNSHIPS = [
  // ================= TECH INTERNSHIPS =================
  {
    title: "Software Engineering Intern (Full-Stack)",
    company: "CloudScale Technologies",
    location: "San Francisco, CA (Hybrid)",
    type: "hybrid" as const,
    category: "tech" as const,
    stipend: "$45 - $55 / hr",
    deadline: "Dec 15, 2026",
    description: "Join our core developer platform team to build scalable microservices and reactive web interfaces used by over 500,000 developers worldwide. You will partner with senior engineers on shipping feature flags, API performance optimizations, and modern React frontends.",
    requiredSkills: ["JavaScript", "TypeScript", "React", "Node.js", "Git"],
    preferredSkills: ["Next.js", "PostgreSQL", "Docker", "REST APIs", "Tailwind CSS"],
    responsibilities: [
      "Build modular, responsive UI components using Next.js and Tailwind CSS.",
      "Develop and test RESTful endpoints in Node.js/TypeScript.",
      "Collaborate with product designers to translate Figma prototypes into production code.",
      "Write unit and integration tests to maintain 85%+ code coverage.",
    ],
  },
  {
    title: "Frontend Developer Intern",
    company: "Veloce Design Systems",
    location: "New York, NY (Remote)",
    type: "remote" as const,
    category: "tech" as const,
    stipend: "$40 - $48 / hr",
    deadline: "Nov 30, 2026",
    description: "We are looking for a design-sensitive frontend engineering intern passionate about micro-interactions, accessibility (WCAG AA), and modern web standards. You will contribute to our open-source design library and enterprise dashboard.",
    requiredSkills: ["React", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
    preferredSkills: ["Next.js", "Figma", "Storybook", "Jest", "GraphQL"],
    responsibilities: [
      "Develop accessible and performant React components for our design system.",
      "Optimize web vital scores (LCP, FID, CLS) across our customer dashboard.",
      "Implement smooth state management and optimistic UI updates.",
    ],
  },
  {
    title: "Backend Engineering Intern (Distributed Systems)",
    company: "Apex Data Infrastructure",
    location: "Seattle, WA (On-site)",
    type: "onsite" as const,
    category: "tech" as const,
    stipend: "$50 - $60 / hr",
    deadline: "Jan 10, 2027",
    description: "Work on low-latency data ingestion pipelines and distributed storage layers processing billions of telemetry events daily. Ideal for candidates with strong computer science fundamentals and systems programming curiosity.",
    requiredSkills: ["Python", "Go", "SQL", "Git", "Linux"],
    preferredSkills: ["PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"],
    responsibilities: [
      "Assist in architecting high-throughput message consumer pipelines using Kafka and Go.",
      "Diagnose database bottlenecks and optimize SQL indexing strategies.",
      "Build telemetry monitors and distributed tracing alerts.",
    ],
  },
  {
    title: "Mobile App Engineering Intern (React Native / iOS)",
    company: "PocketHealth",
    location: "Boston, MA (Hybrid)",
    type: "hybrid" as const,
    category: "tech" as const,
    stipend: "$42 - $50 / hr",
    deadline: "Dec 20, 2026",
    description: "Help build the next-generation patient wellness tracker with offline-first synchronization, Bluetooth device connectivity, and smooth animations.",
    requiredSkills: ["JavaScript", "React Native", "TypeScript", "Git"],
    preferredSkills: ["Swift", "Redux", "GraphQL", "Mobile CI/CD", "Jest"],
    responsibilities: [
      "Ship high-performance React Native features on iOS and Android.",
      "Implement offline SQLite caching and conflict-resolution algorithms.",
      "Participate in daily standups and weekly production release testing.",
    ],
  },
  {
    title: "DevOps & Cloud Infrastructure Intern",
    company: "Skyline Cloud Labs",
    location: "Austin, TX (Remote)",
    type: "remote" as const,
    category: "tech" as const,
    stipend: "$44 - $52 / hr",
    deadline: "Jan 05, 2027",
    description: "Learn infrastructure-as-code and container orchestration at enterprise scale. You will help automate CI/CD release trains and enforce cloud security posture across multi-region AWS environments.",
    requiredSkills: ["Linux", "Bash", "Python", "Git", "Docker"],
    preferredSkills: ["AWS", "Terraform", "GitHub Actions", "Kubernetes", "Prometheus"],
    responsibilities: [
      "Containerize legacy microservices using multi-stage Dockerfiles.",
      "Build automated GitHub Actions workflows for continuous integration and linting.",
      "Instrument synthetic monitoring to detect latency spikes.",
    ],
  },
  {
    title: "AI & Machine Learning Engineering Intern",
    company: "Nexus AI Research",
    location: "San Francisco, CA (Hybrid)",
    type: "hybrid" as const,
    category: "tech" as const,
    stipend: "$55 - $65 / hr",
    deadline: "Dec 31, 2026",
    description: "Work closely with our research scientists on fine-tuning foundational models, retrieval-augmented generation (RAG) pipelines, and evaluation harnesses for LLM reasoning.",
    requiredSkills: ["Python", "PyTorch", "NumPy", "Git", "Pandas"],
    preferredSkills: ["LangChain", "Vector Databases", "Hugging Face", "Docker", "FastAPI"],
    responsibilities: [
      "Build semantic search workflows with Pinecone / pgvector and embeddings.",
      "Run evaluation benchmarks measuring LLM hallucination and latency.",
      "Deploy model inference endpoints on containerized GPU clusters.",
    ],
  },

  // ================= DATA INTERNSHIPS =================
  {
    title: "Data Science Intern",
    company: "FinPulse Analytics",
    location: "Chicago, IL (Hybrid)",
    type: "hybrid" as const,
    category: "data" as const,
    stipend: "$42 - $50 / hr",
    deadline: "Dec 18, 2026",
    description: "Leverage statistical modeling and predictive machine learning on financial transactions to detect anomalous behavior and forecast customer churn.",
    requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Git"],
    preferredSkills: ["Tableau", "Statistics", "PostgreSQL", "A/B Testing", "Spark"],
    responsibilities: [
      "Extract, clean, and validate multi-terabyte transactional datasets.",
      "Build regression and gradient-boosted classification models.",
      "Present actionable insights to risk management stakeholders.",
    ],
  },
  {
    title: "Data Analytics Intern",
    company: "UrbanMobility Group",
    location: "New York, NY (Remote)",
    type: "remote" as const,
    category: "data" as const,
    stipend: "$35 - $42 / hr",
    deadline: "Jan 15, 2027",
    description: "Partner with product managers to measure rider retention, driver incentives, and conversion funnels. Build self-serve dashboards for operational leaders.",
    requiredSkills: ["SQL", "Excel", "Data Visualization", "Tableau"],
    preferredSkills: ["Python", "PowerBI", "dbt", "Snowflake", "A/B Testing"],
    responsibilities: [
      "Author complex SQL queries with window functions and CTEs.",
      "Design interactive executive dashboards in Tableau.",
      "Analyze experiment results for ride surge pricing adjustments.",
    ],
  },
  {
    title: "Data Engineering Intern",
    company: "Streamline Media",
    location: "Los Angeles, CA (Hybrid)",
    type: "hybrid" as const,
    category: "data" as const,
    stipend: "$45 - $52 / hr",
    deadline: "Dec 22, 2026",
    description: "Build robust ETL pipelines feeding our real-time video recommendation engines. Work with modern modern data stack tools including dbt, Snowflake, and Airflow.",
    requiredSkills: ["Python", "SQL", "Git", "Data Warehousing"],
    preferredSkills: ["Airflow", "Snowflake", "dbt", "Spark", "AWS S3"],
    responsibilities: [
      "Maintain automated Airflow DAGs for daily batch syncs.",
      "Implement data quality tests using Great Expectations.",
      "Optimize data modeling layers for analytical query speed.",
    ],
  },
  {
    title: "Business Intelligence Analyst Intern",
    company: "Summit Retail Partners",
    location: "Denver, CO (On-site)",
    type: "onsite" as const,
    category: "data" as const,
    stipend: "$34 - $40 / hr",
    deadline: "Jan 20, 2027",
    description: "Translate omnichannel e-commerce data into strategic merchandising recommendations. Ideal for curious problem solvers with sharp analytical instincts.",
    requiredSkills: ["SQL", "PowerBI", "Excel", "Data Storytelling"],
    preferredSkills: ["Python", "DAX", "Salesforce", "Google Analytics"],
    responsibilities: [
      "Build automated KPI tracking dashboards for retail operations.",
      "Conduct cohort analysis to identify repeat buyer segments.",
      "Synthesize analytical findings into executive slide decks.",
    ],
  },
  {
    title: "Quantitative Research Analyst Intern",
    company: "Aether Capital",
    location: "New York, NY (On-site)",
    type: "onsite" as const,
    category: "data" as const,
    stipend: "$60 - $75 / hr",
    deadline: "Nov 25, 2026",
    description: "Apply rigorous mathematical and statistical algorithms to identify market anomalies in high-frequency equity and options markets.",
    requiredSkills: ["Python", "Mathematics", "Statistics", "SQL"],
    preferredSkills: ["C++", "NumPy", "Time Series Analysis", "Stochastic Calculus"],
    responsibilities: [
      "Backtest algorithmic trading signals across historical market data.",
      "Clean tick-by-tick order book data streams.",
      "Perform Monte Carlo simulations to quantify portfolio risk.",
    ],
  },

  // ================= DESIGN INTERNSHIPS =================
  {
    title: "UI/UX Product Design Intern",
    company: "Prism Creative Studios",
    location: "San Francisco, CA (Remote)",
    type: "remote" as const,
    category: "design" as const,
    stipend: "$38 - $46 / hr",
    deadline: "Dec 12, 2026",
    description: "Help shape the future of collaborative workspace tools. You will lead end-to-end design sprints from user discovery interviews to polished high-fidelity prototypes in Figma.",
    requiredSkills: ["Figma", "Wireframing", "Prototyping", "User Research", "Design Systems"],
    preferredSkills: ["UI/UX", "HTML/CSS", "Usability Testing", "Micro-interactions", "Design Tokens"],
    responsibilities: [
      "Create wireframes, user flows, and interactive interactive Figma components.",
      "Conduct moderated user interviews and synthesize actionable feedback.",
      "Ensure designs adhere to design system specifications and WCAG accessibility standards.",
    ],
  },
  {
    title: "Product Design Intern (Growth & Onboarding)",
    company: "HabitLoop Inc.",
    location: "New York, NY (Hybrid)",
    type: "hybrid" as const,
    category: "design" as const,
    stipend: "$36 - $44 / hr",
    deadline: "Jan 08, 2027",
    description: "Design delightful onboarding flows that boost day-1 activation and retention across our consumer mobile and web applications.",
    requiredSkills: ["Figma", "UI/UX Design", "User Journeys", "Mobile Design"],
    preferredSkills: ["Interaction Design", "Protopie", "A/B Testing", "Visual Design"],
    responsibilities: [
      "Design multivariate onboarding experiment variants.",
      "Partner with growth engineering to review shipped UI fidelity.",
      "Build animated micro-delights for key milestone accomplishments.",
    ],
  },
  {
    title: "Design Systems & Visual Design Intern",
    company: "Loomis Interactive",
    location: "Chicago, IL (Hybrid)",
    type: "hybrid" as const,
    category: "design" as const,
    stipend: "$35 - $42 / hr",
    deadline: "Dec 28, 2026",
    description: "Contribute to a multi-brand typography, color, and icon token system. You'll bridge the gap between creative visual artistry and scalable web design token architecture.",
    requiredSkills: ["Figma", "Typography", "Visual Design", "Design Systems"],
    preferredSkills: ["Adobe Illustrator", "CSS", "Motion Design", "Design Tokens"],
    responsibilities: [
      "Document component variants and usage guidelines in Figma.",
      "Design custom iconography sets and brand illustrations.",
      "Collaborate with frontend developers on token synchronizations.",
    ],
  },
  {
    title: "UX Research Intern",
    company: "Veritas Health Tech",
    location: "Boston, MA (Remote)",
    type: "remote" as const,
    category: "design" as const,
    stipend: "$36 - $42 / hr",
    deadline: "Jan 12, 2027",
    description: "Uncover behavioral barriers for elderly and underserved patients using telehealth interfaces through generative and evaluative research studies.",
    requiredSkills: ["User Research", "Interviewing", "Usability Testing", "Qualitative Analysis"],
    preferredSkills: ["Dovetail", "Figma", "Survey Design", "Persona Development"],
    responsibilities: [
      "Recruit target study participants and execute usability testing scripts.",
      "Tag, synthesize, and categorize video feedback sessions.",
      "Share insight reports with cross-functional leadership.",
    ],
  },
  {
    title: "Brand & Graphic Design Intern",
    company: "Nova Brand Collective",
    location: "Austin, TX (On-site)",
    type: "onsite" as const,
    category: "design" as const,
    stipend: "$30 - $36 / hr",
    deadline: "Jan 18, 2027",
    description: "Create marketing collateral, social assets, packaging concepts, and interactive web landing pages for fast-growing sustainable consumer brands.",
    requiredSkills: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Visual Design"],
    preferredSkills: ["After Effects", "Brand Identity", "Print Production", "Layout Design"],
    responsibilities: [
      "Design branded social media templates, email newsletters, and ad creatives.",
      "Produce vector illustrations and iconography packages.",
      "Prepare print-ready packaging mechanicals.",
    ],
  },

  // ================= MARKETING INTERNSHIPS =================
  {
    title: "Product Marketing Intern",
    company: "Kite Developer Tools",
    location: "San Francisco, CA (Hybrid)",
    type: "hybrid" as const,
    category: "marketing" as const,
    stipend: "$36 - $45 / hr",
    deadline: "Dec 15, 2026",
    description: "Craft positioning statements, competitive teardowns, and launch campaigns for our flagship developer cloud products.",
    requiredSkills: ["Content Writing", "Market Research", "Product Positioning", "Communication"],
    preferredSkills: ["Developer Marketing", "Google Analytics", "Notion", "SEO"],
    responsibilities: [
      "Conduct in-depth competitor feature and pricing analysis matrices.",
      "Draft technical release blogs and customer showcase case studies.",
      "Coordinate launch collateral across social, email, and community channels.",
    ],
  },
  {
    title: "Growth Marketing & SEO Intern",
    company: "ClearStream Media",
    location: "New York, NY (Remote)",
    type: "remote" as const,
    category: "marketing" as const,
    stipend: "$32 - $38 / hr",
    deadline: "Jan 05, 2027",
    description: "Scale organic acquisition through technical SEO audits, keyword gap analysis, backlink outreach, and high-ranking editorial content creation.",
    requiredSkills: ["SEO", "Content Strategy", "Google Analytics", "Copywriting"],
    preferredSkills: ["Ahrefs", "Semrush", "WordPress", "HTML/CSS Basics"],
    responsibilities: [
      "Perform keyword research to capture high-intent search traffic.",
      "Optimize on-page metadata, internal linking, and content readability.",
      "Track weekly rankings and organic conversion trends in Looker Studio.",
    ],
  },
  {
    title: "Social Media & Community Management Intern",
    company: "ByteWave Gaming",
    location: "Los Angeles, CA (Hybrid)",
    type: "hybrid" as const,
    category: "marketing" as const,
    stipend: "$30 - $35 / hr",
    deadline: "Dec 20, 2026",
    description: "Grow and energize our 250k+ Discord and Twitter/X gaming community through interactive events, memes, creator partnerships, and dev streams.",
    requiredSkills: ["Social Media Strategy", "Community Engagement", "Copywriting", "Discord"],
    preferredSkills: ["TikTok / Reels Creation", "Canva", "Influencer Outreach", "Analytics"],
    responsibilities: [
      "Curate and execute a daily multi-channel social editorial calendar.",
      "Moderate community discussion threads, host game nights, and gather feedback.",
      "Produce short-form video snippets highlighting developer updates.",
    ],
  },
  {
    title: "Performance & Paid Acquisition Intern",
    company: "Elevate DTC Brands",
    location: "Miami, FL (Remote)",
    type: "remote" as const,
    category: "marketing" as const,
    stipend: "$32 - $40 / hr",
    deadline: "Jan 25, 2027",
    description: "Manage and optimize ad spend across Meta Ads, Google Search, and TikTok for high-growth direct-to-consumer lifestyle brands.",
    requiredSkills: ["Data Analysis", "Digital Advertising", "Excel", "Marketing Analytics"],
    preferredSkills: ["Meta Ads Manager", "Google Ads", "Conversion Rate Optimization", "A/B Testing"],
    responsibilities: [
      "Monitor daily ROAS, CAC, and CPM across active campaign ad sets.",
      "Propose creative A/B test variations with design teams.",
      "Build weekly performance reports diagnosing conversion drop-offs.",
    ],
  },
  {
    title: "Content Marketing & Technical Writing Intern",
    company: "DevSecOps Shield",
    location: "Seattle, WA (Remote)",
    type: "remote" as const,
    category: "marketing" as const,
    stipend: "$35 - $42 / hr",
    deadline: "Jan 10, 2027",
    description: "Write clear, authoritative guides, whitepapers, and developer documentation covering cloud security posture management and zero-trust principles.",
    requiredSkills: ["Technical Writing", "Research", "Content Strategy", "Communication"],
    preferredSkills: ["Markdown", "Git", "Cybersecurity Fundamentals", "SEO"],
    responsibilities: [
      "Write 2-3 in-depth technical tutorials and educational explainer posts monthly.",
      "Interview internal security researchers to distill complex concepts into clear articles.",
      "Manage our developer resource hub documentation library.",
    ],
  },
  {
    title: "Email & CRM Lifecycle Marketing Intern",
    company: "Savor Delivery App",
    location: "Atlanta, GA (Hybrid)",
    type: "hybrid" as const,
    category: "marketing" as const,
    stipend: "$30 - $36 / hr",
    deadline: "Jan 15, 2027",
    description: "Design automated re-engagement workflows, push notification triggers, and promotional email drips that drive repeat orders and loyalty rewards.",
    requiredSkills: ["Email Marketing", "Copywriting", "Segmentation", "A/B Testing"],
    preferredSkills: ["Klaviyo / Braze", "HTML/CSS Basics", "Customer Retention", "Figma Basics"],
    responsibilities: [
      "Draft catchy subject lines and email copy for weekly dining promotions.",
      "Segment subscriber lists based on geographic and purchasing behaviors.",
      "Execute split tests on send times, hero images, and CTA button copy.",
    ],
  },
];

export async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("⚠️ DATABASE_URL is not set. Skipping live DB push. In-memory seed data is ready for fallback mode.");
    return;
  }

  try {
    neonConfig.fetchConnectionCache = true;
    const pool = new Pool({ connectionString });
    const db = drizzle(pool);

    console.log("🌱 Seeding 22 internships into PostgreSQL database...");
    for (const item of SEED_INTERNSHIPS) {
      await db.insert(internships).values(item).onConflictDoNothing();
    }
    console.log("✅ Seed completed successfully!");
    await pool.end();
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
  }
}

// Allow direct CLI execution: node db/seed.ts
if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

