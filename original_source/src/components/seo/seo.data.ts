import seoData from "data/seo.data.json";

export const SITE_ORIGIN = "https://www.flyplatoon.com";

// Fallback social-share image for routes without a dedicated ogImage.
export const DEFAULT_OG_IMAGE =
  "https://content.flyplatoon.com/website/platoon-aviation.jpg";

export interface SeoEntry {
  title: string;
  description: string;
  // Short, human label used as the breadcrumb leaf name.
  name?: string;
  // Per-route social-share image; falls back to DEFAULT_OG_IMAGE.
  ogImage?: string;
}

// One entry per route, keyed by canonical path. This JSON is the single
// source of truth shared by the runtime <Seo> component AND the build-time
// prerender step (scripts/prerender.js) — keep routes here and in
// src/constants/routes.ts / public/sitemap.xml in sync.
export const SEO_DATA = seoData as Record<string, SeoEntry>;

// Normalize a pathname to its canonical form: lowercase, no trailing
// slash (except the homepage), no query or hash.
export const canonicalPath = (pathname: string) => {
  let path = (pathname || "/").toLowerCase();
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "");
  }
  return path || "/";
};

export const canonicalUrl = (pathname: string) =>
  `${SITE_ORIGIN}${canonicalPath(pathname) === "/" ? "/" : canonicalPath(pathname)}`;
