import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/* ──────────────────────────────────────────────────────────────────────────
   Free SEO + AI gap audit endpoint.

   POST { url: string }
   → { url, status, loadTimeMs, htmlSizeBytes, scores, checks[] }

   Checks cover the most common Google Search Console crawl/index issues
   (titles, descriptions, H1, canonical, robots, sitemap, images alt,
   broken/insecure links, video metadata) and AI crawlability gaps
   (llms.txt, AI bot allowlist, JSON-LD, semantic HTML, hreflang).
   ────────────────────────────────────────────────────────────────────────── */

type CheckStatus = "pass" | "warn" | "fail" | "info";

type Check = {
  id: string;
  category: "seo" | "crawl" | "structured" | "media" | "links" | "ai" | "performance";
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

const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; RankMyBizAudit/1.0; +https://rankmybiz.ai/seo-audit)";

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fd[0-9a-f]{2}:/i,
];

function isPrivateHost(hostname: string): boolean {
  if (PRIVATE_HOST_PATTERNS.some((p) => p.test(hostname))) return true;
  // 172.16.0.0 – 172.31.255.255
  const m = hostname.match(/^172\.(\d+)\./);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 16 && n <= 31) return true;
  }
  return false;
}

function normaliseUrl(input: string): URL | null {
  try {
    const trimmed = input.trim();
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (isPrivateHost(u.hostname)) return null;
    return u;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
): Promise<{ res: Response; ms: number } | { error: string; ms: number }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.5",
        ...(init.headers || {}),
      },
    });
    return { res, ms: Date.now() - start };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "fetch failed",
      ms: Date.now() - start,
    };
  } finally {
    clearTimeout(timer);
  }
}

/* ── tiny HTML scanners (regex, no external deps) ────────────────────────── */

function stripHead(html: string): string {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
}
function stripBody(html: string): string {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : html;
}
function getTagText(html: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
function getAllTags(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
  }
  return out;
}
function getMeta(html: string, attrName: string, attrValue: string): string | null {
  const re = new RegExp(
    `<meta[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1];
  // try reversed attribute order
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attrName}=["']${attrValue}["'][^>]*>`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}
function getAttr(tagHtml: string, attr: string): string | null {
  const m = tagHtml.match(new RegExp(`${attr}=["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}
function findAllTagsRaw(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  return html.match(re) || [];
}

/* ── individual audit pieces ─────────────────────────────────────────────── */

function auditTitleAndMeta(html: string, head: string): Check[] {
  const out: Check[] = [];
  const title = getTagText(head, "title");
  if (!title) {
    out.push({
      id: "title-missing",
      category: "seo",
      label: "Page title",
      status: "fail",
      message: "No <title> tag found. Google relies on this as the primary headline.",
    });
  } else {
    const len = title.length;
    if (len < 20) {
      out.push({
        id: "title-short",
        category: "seo",
        label: "Page title",
        status: "warn",
        message: `Title is only ${len} characters — too short for ranking signals.`,
        details: title,
      });
    } else if (len > 65) {
      out.push({
        id: "title-long",
        category: "seo",
        label: "Page title",
        status: "warn",
        message: `Title is ${len} characters — Google will truncate it in results.`,
        details: title,
      });
    } else {
      out.push({
        id: "title-ok",
        category: "seo",
        label: "Page title",
        status: "pass",
        message: `Title length looks healthy (${len} chars).`,
        details: title,
      });
    }
  }

  const desc = getMeta(head, "name", "description");
  if (!desc) {
    out.push({
      id: "desc-missing",
      category: "seo",
      label: "Meta description",
      status: "fail",
      message:
        "Missing meta description. Google often shows this as the snippet under your title.",
    });
  } else {
    const len = desc.length;
    if (len < 70) {
      out.push({
        id: "desc-short",
        category: "seo",
        label: "Meta description",
        status: "warn",
        message: `Description is only ${len} characters — aim for 120–160.`,
        details: desc,
      });
    } else if (len > 170) {
      out.push({
        id: "desc-long",
        category: "seo",
        label: "Meta description",
        status: "warn",
        message: `Description is ${len} characters — likely truncated in SERP.`,
        details: desc,
      });
    } else {
      out.push({
        id: "desc-ok",
        category: "seo",
        label: "Meta description",
        status: "pass",
        message: `Description length looks healthy (${len} chars).`,
        details: desc,
      });
    }
  }

  const viewport = getMeta(head, "name", "viewport");
  out.push(
    viewport
      ? {
          id: "viewport-ok",
          category: "seo",
          label: "Mobile viewport",
          status: "pass",
          message: "Viewport meta tag present — mobile-friendly.",
        }
      : {
          id: "viewport-missing",
          category: "seo",
          label: "Mobile viewport",
          status: "fail",
          message: "No viewport meta — Google flags this as mobile-unfriendly.",
        },
  );

  const charset = head.match(/<meta[^>]*charset=["']?([^"'>\s]+)/i)?.[1];
  out.push(
    charset
      ? {
          id: "charset-ok",
          category: "seo",
          label: "Character encoding",
          status: "pass",
          message: `Charset declared (${charset}).`,
        }
      : {
          id: "charset-missing",
          category: "seo",
          label: "Character encoding",
          status: "warn",
          message: "No <meta charset> — can cause garbled rendering on some clients.",
        },
  );

  return out;
}

function auditHeadings(body: string): Check[] {
  const out: Check[] = [];
  const h1s = getAllTags(body, "h1");
  if (h1s.length === 0) {
    out.push({
      id: "h1-missing",
      category: "seo",
      label: "H1 heading",
      status: "fail",
      message: "No <h1> on the page. Search engines look for this as the main topic.",
    });
  } else if (h1s.length > 1) {
    out.push({
      id: "h1-multiple",
      category: "seo",
      label: "H1 heading",
      status: "warn",
      message: `${h1s.length} <h1> tags found. Google prefers a single clear H1.`,
      details: h1s.slice(0, 3).join(" | "),
    });
  } else {
    out.push({
      id: "h1-ok",
      category: "seo",
      label: "H1 heading",
      status: "pass",
      message: "Single H1 found.",
      details: h1s[0],
    });
  }

  const headingCount =
    getAllTags(body, "h2").length +
    getAllTags(body, "h3").length +
    getAllTags(body, "h4").length;
  out.push({
    id: "heading-structure",
    category: "ai",
    label: "Heading structure",
    status: headingCount >= 2 ? "pass" : "warn",
    message:
      headingCount >= 2
        ? `Found ${headingCount} subheadings — AI crawlers can map sections.`
        : "Few subheadings (<h2>/<h3>) — AI tools struggle to summarise sections.",
  });

  return out;
}

function auditCanonicalAndRobots(head: string, headers: Headers, finalUrl: string): Check[] {
  const out: Check[] = [];

  const canonicalMatch = head.match(
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  );
  if (!canonicalMatch) {
    out.push({
      id: "canonical-missing",
      category: "crawl",
      label: "Canonical URL",
      status: "warn",
      message:
        "No rel=canonical link. Without it, Google may pick the wrong URL when duplicates exist.",
    });
  } else {
    out.push({
      id: "canonical-ok",
      category: "crawl",
      label: "Canonical URL",
      status: "pass",
      message: "Canonical link present.",
      details: canonicalMatch[1],
    });
  }

  const metaRobots = getMeta(head, "name", "robots");
  if (metaRobots) {
    const v = metaRobots.toLowerCase();
    if (v.includes("noindex")) {
      out.push({
        id: "noindex",
        category: "crawl",
        label: "Indexing directive",
        status: "fail",
        message: `Page has <meta robots> = "${metaRobots}" — Google will NOT index it.`,
      });
    } else {
      out.push({
        id: "robots-ok",
        category: "crawl",
        label: "Indexing directive",
        status: "pass",
        message: `Robots directive: "${metaRobots}".`,
      });
    }
  }

  const xRobots = headers.get("x-robots-tag");
  if (xRobots && xRobots.toLowerCase().includes("noindex")) {
    out.push({
      id: "x-robots-noindex",
      category: "crawl",
      label: "X-Robots-Tag header",
      status: "fail",
      message: `Server is sending X-Robots-Tag: ${xRobots} — Google will not index this URL.`,
    });
  }

  const lang = head.match(/<html[^>]*lang=["']([^"']+)["']/i)?.[1] ||
               getMeta(head, "http-equiv", "content-language");
  out.push(
    lang
      ? {
          id: "lang-ok",
          category: "ai",
          label: "Language declaration",
          status: "pass",
          message: `Language declared: ${lang}.`,
        }
      : {
          id: "lang-missing",
          category: "ai",
          label: "Language declaration",
          status: "warn",
          message:
            "No lang attribute on <html>. AI tools and screen readers may misinterpret content.",
        },
  );

  const hreflangs = head.match(/<link[^>]*rel=["']alternate["'][^>]*hreflang=/gi) || [];
  if (hreflangs.length > 0) {
    out.push({
      id: "hreflang",
      category: "ai",
      label: "Hreflang alternates",
      status: "pass",
      message: `${hreflangs.length} hreflang alternate(s) declared — good for multi-region sites.`,
    });
  }

  // HTTPS
  out.push(
    finalUrl.startsWith("https://")
      ? {
          id: "https",
          category: "crawl",
          label: "HTTPS",
          status: "pass",
          message: "Page served over HTTPS.",
        }
      : {
          id: "https",
          category: "crawl",
          label: "HTTPS",
          status: "fail",
          message: "Not served over HTTPS. Google ranks HTTPS pages higher and flags HTTP as not-secure.",
        },
  );

  return out;
}

function auditStructuredData(html: string): Check[] {
  const out: Check[] = [];
  const blocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  if (blocks.length === 0) {
    out.push({
      id: "jsonld-missing",
      category: "structured",
      label: "Schema.org JSON-LD",
      status: "fail",
      message:
        "No structured data found. AI search and Google rich results rely heavily on JSON-LD.",
    });
  } else {
    const types = new Set<string>();
    for (const b of blocks) {
      const inner = b.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
      try {
        const parsed = JSON.parse(inner);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const it of items) {
          if (it && typeof it === "object" && "@type" in it) {
            const t = (it as { "@type": unknown })["@type"];
            if (typeof t === "string") types.add(t);
            else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
          }
        }
      } catch {
        out.push({
          id: "jsonld-invalid",
          category: "structured",
          label: "Schema.org JSON-LD",
          status: "warn",
          message: "JSON-LD block found but failed to parse — invalid JSON.",
        });
      }
    }
    if (types.size > 0) {
      out.push({
        id: "jsonld-ok",
        category: "structured",
        label: "Schema.org JSON-LD",
        status: "pass",
        message: `${blocks.length} JSON-LD block(s) found.`,
        details: `Types: ${Array.from(types).join(", ")}`,
      });
    }
  }

  // Open Graph
  const og = ["og:title", "og:description", "og:image", "og:type", "og:url"];
  const missingOg = og.filter((k) => !getMeta(html, "property", k));
  if (missingOg.length === 0) {
    out.push({
      id: "og-ok",
      category: "structured",
      label: "Open Graph tags",
      status: "pass",
      message: "All core Open Graph tags present (title, description, image, type, url).",
    });
  } else if (missingOg.length === og.length) {
    out.push({
      id: "og-missing",
      category: "structured",
      label: "Open Graph tags",
      status: "fail",
      message: "No Open Graph tags. Links to your site will look bare on social and AI surfaces.",
    });
  } else {
    out.push({
      id: "og-partial",
      category: "structured",
      label: "Open Graph tags",
      status: "warn",
      message: `Missing OG tag(s): ${missingOg.join(", ")}.`,
    });
  }

  // Twitter Card
  const twitterCard = getMeta(html, "name", "twitter:card");
  out.push(
    twitterCard
      ? {
          id: "twitter-ok",
          category: "structured",
          label: "Twitter Card",
          status: "pass",
          message: `Twitter card type: ${twitterCard}.`,
        }
      : {
          id: "twitter-missing",
          category: "structured",
          label: "Twitter Card",
          status: "warn",
          message: "No twitter:card meta — links shared on X show as plain text.",
        },
  );

  return out;
}

function auditImages(body: string): Check[] {
  const out: Check[] = [];
  const imgs = findAllTagsRaw(body, "img");
  if (imgs.length === 0) {
    out.push({
      id: "img-none",
      category: "media",
      label: "Images",
      status: "info",
      message: "No <img> tags found on the page.",
    });
    return out;
  }
  let missingAlt = 0;
  let emptyAlt = 0;
  let missingDimensions = 0;
  let lazyLoaded = 0;
  for (const tag of imgs) {
    const alt = getAttr(tag, "alt");
    if (alt === null) missingAlt++;
    else if (alt.trim() === "") emptyAlt++;
    if (!getAttr(tag, "width") || !getAttr(tag, "height")) missingDimensions++;
    if ((getAttr(tag, "loading") || "").toLowerCase() === "lazy") lazyLoaded++;
  }
  out.push({
    id: "img-count",
    category: "media",
    label: "Image count",
    status: "info",
    message: `${imgs.length} image(s) on page.`,
  });
  out.push(
    missingAlt === 0
      ? {
          id: "img-alt-ok",
          category: "media",
          label: "Image alt text",
          status: emptyAlt > imgs.length / 2 ? "warn" : "pass",
          message:
            emptyAlt > 0
              ? `${emptyAlt} image(s) have empty alt="" (decorative). All images have an alt attribute.`
              : "All images have alt text.",
        }
      : {
          id: "img-alt-missing",
          category: "media",
          label: "Image alt text",
          status: "fail",
          message: `${missingAlt} of ${imgs.length} image(s) are missing alt attributes — accessibility + image search hit.`,
        },
  );
  out.push(
    missingDimensions === 0
      ? {
          id: "img-dim-ok",
          category: "media",
          label: "Image dimensions",
          status: "pass",
          message: "All images declare width/height — protects Cumulative Layout Shift.",
        }
      : {
          id: "img-dim-missing",
          category: "media",
          label: "Image dimensions",
          status: "warn",
          message: `${missingDimensions} image(s) missing width/height — risk of layout shift (Core Web Vitals).`,
        },
  );
  if (imgs.length >= 5 && lazyLoaded < imgs.length / 3) {
    out.push({
      id: "img-lazy",
      category: "performance",
      label: "Lazy loading",
      status: "warn",
      message: `Only ${lazyLoaded}/${imgs.length} images use loading="lazy". Below-the-fold images should defer.`,
    });
  }
  return out;
}

function auditLinks(body: string, finalUrl: string): Check[] {
  const out: Check[] = [];
  const anchors = findAllTagsRaw(body, "a");
  if (anchors.length === 0) {
    out.push({
      id: "links-none",
      category: "links",
      label: "Links",
      status: "warn",
      message: "No <a> links found — page is a dead end for crawlers.",
    });
    return out;
  }
  let internal = 0,
    external = 0,
    emptyHref = 0,
    emptyText = 0,
    unsafeBlank = 0,
    nofollowExt = 0;
  let host = "";
  try {
    host = new URL(finalUrl).hostname;
  } catch {}
  for (const raw of anchors) {
    const href = getAttr(raw, "href");
    const target = getAttr(raw, "target");
    const rel = (getAttr(raw, "rel") || "").toLowerCase();
    if (!href || href.trim() === "" || href.trim() === "#") {
      emptyHref++;
      continue;
    }
    let isExternal = false;
    if (/^https?:\/\//i.test(href)) {
      try {
        const h = new URL(href).hostname;
        isExternal = h !== host;
      } catch {}
    }
    if (isExternal) external++;
    else internal++;
    if (target === "_blank" && !rel.includes("noopener")) unsafeBlank++;
    if (isExternal && rel.includes("nofollow")) nofollowExt++;
  }
  out.push({
    id: "links-count",
    category: "links",
    label: "Internal vs external links",
    status: "info",
    message: `${anchors.length} link(s): ${internal} internal, ${external} external.`,
  });
  if (emptyHref > 0) {
    out.push({
      id: "links-empty-href",
      category: "links",
      label: "Broken/empty links",
      status: "warn",
      message: `${emptyHref} link(s) have empty or "#" href — wasted crawl budget.`,
    });
  }
  if (unsafeBlank > 0) {
    out.push({
      id: "links-unsafe-blank",
      category: "links",
      label: "Insecure target=_blank",
      status: "warn",
      message: `${unsafeBlank} link(s) use target="_blank" without rel="noopener" — security and tabnabbing risk.`,
    });
  }
  if (internal === 0) {
    out.push({
      id: "links-no-internal",
      category: "links",
      label: "Internal linking",
      status: "fail",
      message: "No internal links — Google can't discover other pages from here.",
    });
  } else {
    out.push({
      id: "links-internal-ok",
      category: "links",
      label: "Internal linking",
      status: "pass",
      message: `${internal} internal link(s) — crawlers can navigate deeper.`,
    });
  }
  void emptyText;
  void nofollowExt;
  return out;
}

function auditVideo(body: string, jsonldTypes: Set<string>): Check[] {
  const out: Check[] = [];
  const videoTags = findAllTagsRaw(body, "video");
  const youtube = body.match(/<iframe[^>]*src=["'][^"']*(youtube\.com|youtu\.be|player\.vimeo\.com)/gi) || [];
  const total = videoTags.length + youtube.length;
  if (total === 0) {
    out.push({
      id: "video-none",
      category: "media",
      label: "Video content",
      status: "info",
      message: "No <video> or YouTube/Vimeo embeds detected.",
    });
    return out;
  }
  out.push({
    id: "video-count",
    category: "media",
    label: "Video content",
    status: "info",
    message: `${videoTags.length} <video> + ${youtube.length} YouTube/Vimeo embed(s).`,
  });
  if (jsonldTypes.has("VideoObject")) {
    out.push({
      id: "video-schema-ok",
      category: "media",
      label: "Video schema",
      status: "pass",
      message: "VideoObject schema present — eligible for Google video rich results.",
    });
  } else {
    out.push({
      id: "video-schema-missing",
      category: "media",
      label: "Video schema",
      status: "warn",
      message:
        "Videos detected but no VideoObject JSON-LD. Add it so Google indexes them in the Videos tab.",
    });
  }
  // missing captions/transcripts heuristic
  let missingCaptions = 0;
  for (const tag of videoTags) {
    if (!/track[^>]*kind=["']captions/i.test(tag)) missingCaptions++;
  }
  if (videoTags.length > 0 && missingCaptions > 0) {
    out.push({
      id: "video-captions",
      category: "ai",
      label: "Video captions",
      status: "warn",
      message: `${missingCaptions}/${videoTags.length} <video> element(s) have no <track kind="captions"> — AI can't read the audio.`,
    });
  }
  return out;
}

function auditAiContent(html: string, body: string, headers: Headers): Check[] {
  const out: Check[] = [];
  const semantic = ["main", "article", "section", "nav", "header", "footer"];
  const present = semantic.filter((t) => new RegExp(`<${t}\\b`, "i").test(body));
  if (present.length >= 3) {
    out.push({
      id: "semantic-ok",
      category: "ai",
      label: "Semantic HTML",
      status: "pass",
      message: `Uses ${present.length} semantic landmarks: ${present.join(", ")}.`,
    });
  } else {
    out.push({
      id: "semantic-missing",
      category: "ai",
      label: "Semantic HTML",
      status: "warn",
      message: `Only ${present.length} semantic landmark(s) (${present.join(", ") || "none"}). AI parsers map content via <main>/<article>.`,
    });
  }

  // word count from body text
  const text = body.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean).length;
  if (words < 150) {
    out.push({
      id: "thin-content",
      category: "ai",
      label: "Content depth",
      status: "fail",
      message: `Only ~${words} words of visible text. AI assistants and Google view this as thin content.`,
    });
  } else if (words < 400) {
    out.push({
      id: "content-light",
      category: "ai",
      label: "Content depth",
      status: "warn",
      message: `~${words} words. Consider expanding for better topic coverage.`,
    });
  } else {
    out.push({
      id: "content-ok",
      category: "ai",
      label: "Content depth",
      status: "pass",
      message: `~${words} words of visible text — solid for AI summarisation.`,
    });
  }

  // FAQ / HowTo schemas detected via plain text scan as a hint
  const faqHints = /<(?:h[2-4]|summary)[^>]*>[^<]*\?\s*<\//i.test(body);
  if (faqHints) {
    out.push({
      id: "faq-hint",
      category: "ai",
      label: "Q&A formatting",
      status: "info",
      message: "Question-style headings detected — pair them with FAQPage JSON-LD for AI rich results.",
    });
  }

  // content-type
  const ct = headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("text/html")) {
    out.push({
      id: "content-type",
      category: "crawl",
      label: "Content-Type header",
      status: "warn",
      message: `Server returned Content-Type "${ct}" — should be text/html for indexable pages.`,
    });
  }
  return out;
}

async function auditRobots(origin: string): Promise<{ robotsText: string | null; checks: Check[] }> {
  const checks: Check[] = [];
  const r = await fetchWithTimeout(`${origin}/robots.txt`);
  if ("error" in r) {
    checks.push({
      id: "robots-fetch",
      category: "crawl",
      label: "robots.txt",
      status: "warn",
      message: `Could not fetch /robots.txt (${r.error}).`,
    });
    return { robotsText: null, checks };
  }
  if (!r.res.ok) {
    checks.push({
      id: "robots-missing",
      category: "crawl",
      label: "robots.txt",
      status: "warn",
      message: `No robots.txt at /robots.txt (HTTP ${r.res.status}). Search engines crawl with no rules — usually fine but you can't control them.`,
    });
    return { robotsText: null, checks };
  }
  const text = await r.res.text();
  checks.push({
    id: "robots-ok",
    category: "crawl",
    label: "robots.txt",
    status: "pass",
    message: `robots.txt found (${text.length} bytes).`,
  });
  // sitemap inside robots
  const sitemaps = [...text.matchAll(/^\s*sitemap:\s*(.+)$/gim)].map((m) => m[1].trim());
  if (sitemaps.length === 0) {
    checks.push({
      id: "robots-no-sitemap",
      category: "crawl",
      label: "Sitemap directive",
      status: "warn",
      message: "robots.txt does not declare a Sitemap. Add `Sitemap: https://yoursite.com/sitemap.xml`.",
    });
  } else {
    checks.push({
      id: "robots-sitemap",
      category: "crawl",
      label: "Sitemap directive",
      status: "pass",
      message: `Sitemap declared in robots.txt.`,
      details: sitemaps.join("\n"),
    });
  }
  // AI bot policy
  const aiBots = [
    "GPTBot",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "anthropic-ai",
    "CCBot",
    "Applebot-Extended",
  ];
  const blocked: string[] = [];
  for (const bot of aiBots) {
    const re = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/(?:\\s|$)`, "i");
    if (re.test(text)) blocked.push(bot);
  }
  if (blocked.length === 0) {
    checks.push({
      id: "ai-bots-allowed",
      category: "ai",
      label: "AI crawler access",
      status: "pass",
      message: "No AI bots are blocked in robots.txt — your content is reachable to ChatGPT, Claude, Perplexity, Google AI Overviews.",
    });
  } else {
    checks.push({
      id: "ai-bots-blocked",
      category: "ai",
      label: "AI crawler access",
      status: "warn",
      message: `Blocked AI bots: ${blocked.join(", ")}. If you want AI visibility, remove these Disallow rules.`,
    });
  }
  return { robotsText: text, checks };
}

async function auditSitemap(origin: string, robotsText: string | null): Promise<Check[]> {
  const checks: Check[] = [];
  let candidates: string[] = [];
  if (robotsText) {
    candidates = [...robotsText.matchAll(/^\s*sitemap:\s*(.+)$/gim)].map((m) => m[1].trim());
  }
  if (candidates.length === 0) candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  for (const url of candidates) {
    const r = await fetchWithTimeout(url, { method: "GET" });
    if ("error" in r) continue;
    if (r.res.ok) {
      const text = await r.res.text();
      const urlCount = (text.match(/<url>/gi) || []).length;
      const sitemapCount = (text.match(/<sitemap>/gi) || []).length;
      checks.push({
        id: "sitemap-ok",
        category: "crawl",
        label: "Sitemap",
        status: "pass",
        message: urlCount
          ? `Sitemap reachable with ${urlCount} URL(s).`
          : sitemapCount
            ? `Sitemap index reachable with ${sitemapCount} child sitemap(s).`
            : "Sitemap reachable.",
        details: url,
      });
      return checks;
    }
  }
  checks.push({
    id: "sitemap-missing",
    category: "crawl",
    label: "Sitemap",
    status: "fail",
    message: "No sitemap.xml reachable. Without one, Google may miss new or deep pages.",
  });
  return checks;
}

async function auditLlmsTxt(origin: string): Promise<Check[]> {
  const r = await fetchWithTimeout(`${origin}/llms.txt`);
  if ("error" in r) {
    return [
      {
        id: "llms-txt",
        category: "ai",
        label: "llms.txt",
        status: "warn",
        message: `Could not check /llms.txt (${r.error}).`,
      },
    ];
  }
  if (r.res.ok) {
    return [
      {
        id: "llms-txt-ok",
        category: "ai",
        label: "llms.txt",
        status: "pass",
        message: "llms.txt found — gives AI assistants a curated map of your content.",
      },
    ];
  }
  return [
    {
      id: "llms-txt-missing",
      category: "ai",
      label: "llms.txt",
      status: "warn",
      message:
        "No /llms.txt. Adding one helps ChatGPT, Claude, and Perplexity discover your most important pages.",
    },
  ];
}

function auditPerformance(html: string, loadMs: number): Check[] {
  const out: Check[] = [];
  const sizeKB = Math.round(Buffer.byteLength(html, "utf8") / 1024);
  out.push({
    id: "html-size",
    category: "performance",
    label: "HTML payload",
    status: sizeKB > 500 ? "warn" : "pass",
    message: `HTML is ${sizeKB} KB${sizeKB > 500 ? " — over 500 KB hurts mobile load time" : "."}`,
  });
  out.push({
    id: "ttfb",
    category: "performance",
    label: "Server response time",
    status: loadMs > 2000 ? "fail" : loadMs > 800 ? "warn" : "pass",
    message: `Server returned HTML in ${loadMs} ms${loadMs > 2000 ? " — Google flags > 2.5s as poor" : "."}`,
  });
  const inlineScripts = (html.match(/<script\b(?![^>]*\bsrc=)/gi) || []).length;
  if (inlineScripts > 5) {
    out.push({
      id: "inline-scripts",
      category: "performance",
      label: "Inline scripts",
      status: "warn",
      message: `${inlineScripts} inline <script> blocks — increases blocking JS for first paint.`,
    });
  }
  return out;
}

/* ── scoring ─────────────────────────────────────────────────────────────── */

function scoreCategory(checks: Check[], category: Check["category"]): number {
  const cat = checks.filter((c) => c.category === category && c.status !== "info");
  if (cat.length === 0) return 100;
  const points = cat.reduce(
    (sum, c) => sum + (c.status === "pass" ? 100 : c.status === "warn" ? 60 : 0),
    0,
  );
  return Math.round(points / cat.length);
}

/* ── handler ─────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const raw = typeof body.url === "string" ? body.url : "";
  const u = normaliseUrl(raw);
  if (!u) {
    return NextResponse.json(
      { error: "Enter a valid public http(s) URL. Private/local hosts are blocked." },
      { status: 400 },
    );
  }

  const fetched = await fetchWithTimeout(u.toString());
  if ("error" in fetched) {
    return NextResponse.json(
      { error: `Could not load ${u.toString()} — ${fetched.error}` },
      { status: 502 },
    );
  }
  const { res, ms } = fetched;
  const html = await res.text();
  const finalUrl = res.url || u.toString();
  const origin = new URL(finalUrl).origin;
  const head = stripHead(html);
  const bodyHtml = stripBody(html);

  const checks: Check[] = [];

  // Status code check
  if (res.status >= 400) {
    checks.push({
      id: "status",
      category: "crawl",
      label: "HTTP status",
      status: "fail",
      message: `Server returned HTTP ${res.status}. Search engines drop these from the index.`,
    });
  } else if (res.status >= 300) {
    checks.push({
      id: "status",
      category: "crawl",
      label: "HTTP status",
      status: "warn",
      message: `HTTP ${res.status} redirect followed to ${finalUrl}.`,
    });
  } else {
    checks.push({
      id: "status",
      category: "crawl",
      label: "HTTP status",
      status: "pass",
      message: `HTTP ${res.status} OK.`,
    });
  }

  checks.push(...auditTitleAndMeta(html, head));
  checks.push(...auditHeadings(bodyHtml));
  checks.push(...auditCanonicalAndRobots(head, res.headers, finalUrl));

  const sd = auditStructuredData(html);
  checks.push(...sd);
  const jsonldTypes = new Set<string>();
  for (const c of sd) {
    if (c.id === "jsonld-ok" && c.details) {
      const t = c.details.replace(/^Types:\s*/, "").split(",").map((s) => s.trim());
      t.forEach((x) => jsonldTypes.add(x));
    }
  }

  checks.push(...auditImages(bodyHtml));
  checks.push(...auditLinks(bodyHtml, finalUrl));
  checks.push(...auditVideo(bodyHtml, jsonldTypes));
  checks.push(...auditAiContent(html, bodyHtml, res.headers));
  checks.push(...auditPerformance(html, ms));

  const [robotsResult, llmsChecks] = await Promise.all([
    auditRobots(origin),
    auditLlmsTxt(origin),
  ]);
  const sitemapChecks = await auditSitemap(origin, robotsResult.robotsText);
  checks.push(...robotsResult.checks, ...sitemapChecks, ...llmsChecks);

  const result: AuditResult = {
    url: u.toString(),
    finalUrl,
    fetchedAt: new Date().toISOString(),
    status: res.status,
    loadTimeMs: ms,
    htmlSizeBytes: Buffer.byteLength(html, "utf8"),
    scores: {
      overall: 0,
      seo: scoreCategory(checks, "seo"),
      crawl: scoreCategory(checks, "crawl"),
      structured: scoreCategory(checks, "structured"),
      media: scoreCategory(checks, "media"),
      ai: scoreCategory(checks, "ai"),
    },
    checks,
  };
  result.scores.overall = Math.round(
    (result.scores.seo +
      result.scores.crawl +
      result.scores.structured +
      result.scores.media +
      result.scores.ai) /
      5,
  );

  return NextResponse.json(result, {
    headers: { "cache-control": "no-store" },
  });
}
