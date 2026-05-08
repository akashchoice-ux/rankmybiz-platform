"use client";

import { useState, useMemo } from "react";

type CheckStatus = "pass" | "warn" | "fail" | "info";
type Category =
  | "seo"
  | "crawl"
  | "structured"
  | "media"
  | "links"
  | "ai"
  | "performance";

type Check = {
  id: string;
  category: Category;
  label: string;
  status: CheckStatus;
  message: string;
  details?: string;
};

type AuditResult = {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  status: number;
  loadTimeMs: number;
  htmlSizeBytes: number;
  scores: {
    overall: number;
    seo: number;
    crawl: number;
    structured: number;
    media: number;
    ai: number;
  };
  checks: Check[];
};

const CATEGORY_LABEL: Record<Category, string> = {
  seo: "On-page SEO",
  crawl: "Crawl & indexing",
  structured: "Structured data",
  media: "Images & video",
  links: "Links",
  ai: "AI search readiness",
  performance: "Performance",
};

const CATEGORY_BLURB: Record<Category, string> = {
  seo: "Title, description, headings — the signals Google uses to rank.",
  crawl: "Whether Googlebot can fetch, follow, and index the page.",
  structured: "JSON-LD, Open Graph, Twitter — required for rich results and AI snippets.",
  media: "Images and videos that Google Search Console tracks for image/video indexing.",
  links: "Internal/external linking and broken anchors that affect crawl budget.",
  ai: "How discoverable your content is to ChatGPT, Claude, Perplexity and Google AI Overviews.",
  performance: "Server speed and payload size — Core Web Vitals foundations.",
};

const STATUS_RANK: Record<CheckStatus, number> = { fail: 0, warn: 1, info: 2, pass: 3 };

function StatusIcon({ status }: { status: CheckStatus }) {
  const map: Record<CheckStatus, { bg: string; ring: string; symbol: string }> = {
    pass: { bg: "bg-success-light text-success", ring: "ring-success/20", symbol: "✓" },
    warn: { bg: "bg-warning-light text-warning", ring: "ring-warning/20", symbol: "!" },
    fail: { bg: "bg-danger-light text-danger", ring: "ring-danger/20", symbol: "×" },
    info: { bg: "bg-slate-100 text-slate-600", ring: "ring-slate-200", symbol: "i" },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ring-1 text-[13px] font-bold flex-shrink-0 ${s.bg} ${s.ring}`}
      aria-label={status}
    >
      {s.symbol}
    </span>
  );
}

function ScoreRing({ value, label, size = 84 }: { value: number; label: string; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const color =
    value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : value >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size * 0.28}
          fontWeight={700}
          fill="#0f172a"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        >
          {value}
        </text>
      </svg>
      <span className="text-xs font-medium text-slate-600 text-center max-w-[100px]">{label}</span>
    </div>
  );
}

function summarise(checks: Check[]) {
  return checks.reduce(
    (acc, c) => {
      acc[c.status] += 1;
      return acc;
    },
    { pass: 0, warn: 0, fail: 0, info: 0 } as Record<CheckStatus, number>,
  );
}

const CATEGORIES: Category[] = ["seo", "crawl", "structured", "ai", "media", "links", "performance"];

export default function AuditClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!url.trim()) {
      setError("Enter a website URL to audit.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || `Audit failed (HTTP ${res.status}).`);
        return;
      }
      setResult(data as AuditResult);
      setActiveCategory("all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(() => (result ? summarise(result.checks) : null), [result]);

  const visibleChecks = useMemo(() => {
    if (!result) return [];
    const sorted = [...result.checks].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
    if (activeCategory === "all") return sorted;
    return sorted.filter((c) => c.category === activeCategory);
  }, [result, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Hero + form */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark text-white px-6 sm:px-10 py-14 sm:py-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold tracking-wide uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Free SEO + AI gap checker
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Find every SEO and AI visibility gap on any page — in 15 seconds.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed">
            Catch the same issues Google Search Console flags — missing titles, broken
            crawl rules, image alt gaps, video schema, link errors — plus the AI search
            gaps (ChatGPT, Claude, Perplexity, Google AI Overviews) most tools ignore.
          </p>
          <form onSubmit={runAudit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourbusiness.com"
              className="flex-1 h-14 px-5 rounded-xl text-slate-900 placeholder-slate-400 text-base bg-white outline-none ring-2 ring-transparent focus:ring-accent/40"
              spellCheck={false}
              autoComplete="url"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-14 px-7 rounded-xl bg-accent text-slate-900 font-semibold text-base hover:bg-amber-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Auditing…" : "Run free audit"}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-amber-200 bg-black/20 rounded-lg px-3 py-2 inline-block">
              {error}
            </p>
          )}
          <p className="mt-4 text-xs text-white/70">
            No signup. No email. We don&apos;t store your URLs. Audit runs server-side from
            our edge.
          </p>
        </div>
      </section>

      {/* What we check */}
      {!result && !loading && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5">
            What this tool checks
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <div
                key={c}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand/30 hover:shadow-sm transition"
              >
                <div className="text-sm font-semibold text-brand uppercase tracking-wide mb-1">
                  {CATEGORY_LABEL[c]}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{CATEGORY_BLURB[c]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-brand animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-brand animate-pulse [animation-delay:120ms]" />
            <span className="w-3 h-3 rounded-full bg-brand animate-pulse [animation-delay:240ms]" />
            <span className="ml-2 text-sm font-medium">
              Fetching page, robots.txt, sitemap, llms.txt — hold on…
            </span>
          </div>
        </section>
      )}

      {/* Results */}
      {result && summary && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Audit complete
                </p>
                <a
                  href={result.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-slate-900 hover:text-brand truncate block max-w-[60ch]"
                >
                  {result.finalUrl}
                </a>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                <span>HTTP {result.status}</span>
                <span>· {result.loadTimeMs} ms TTFB</span>
                <span>· {Math.round(result.htmlSizeBytes / 1024)} KB HTML</span>
              </div>
            </div>

            <div className="px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
              <ScoreRing value={result.scores.overall} label="Overall" size={104} />
              <ScoreRing value={result.scores.seo} label="On-page SEO" />
              <ScoreRing value={result.scores.crawl} label="Crawl" />
              <ScoreRing value={result.scores.structured} label="Structured data" />
              <ScoreRing value={result.scores.media} label="Media" />
              <ScoreRing value={result.scores.ai} label="AI search" />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger-light text-danger font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" /> {summary.fail} critical
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-light text-warning font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" /> {summary.warn} warnings
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-light text-success font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> {summary.pass} passing
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                {summary.info} informational
              </span>
            </div>
          </section>

          {/* Filters */}
          <section className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              All issues ({result.checks.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = result.checks.filter((x) => x.category === c).length;
              if (count === 0) return null;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                    activeCategory === c
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {CATEGORY_LABEL[c]} ({count})
                </button>
              );
            })}
          </section>

          {/* Check list */}
          <section className="space-y-3">
            {visibleChecks.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex gap-4"
              >
                <StatusIcon status={c.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                      {c.label}
                    </h3>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      {CATEGORY_LABEL[c.category]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{c.message}</p>
                  {c.details && (
                    <pre className="mt-2 text-xs bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-600 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                      {c.details}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              Want help fixing what we found?
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              RankMyBiz gives Malaysian businesses a free, SEO-optimised listing with the
              schema, sitemap entries, and AI-readable structure already wired up.
            </p>
            <a
              href="/dashboard/submit"
              className="inline-flex mt-5 items-center justify-center h-12 px-7 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors"
            >
              List your business — free
            </a>
          </section>
        </>
      )}
    </div>
  );
}
