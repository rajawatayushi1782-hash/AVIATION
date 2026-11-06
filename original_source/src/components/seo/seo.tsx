import { useEffect } from "react";
import {
  canonicalPath,
  canonicalUrl,
  DEFAULT_OG_IMAGE,
  SEO_DATA,
  SITE_ORIGIN,
} from "./seo.data";

interface seoProps {
  pathname: string;
}

const upsertLink = (rel: string, href: string) => {
  // Remove duplicates, keep a single tag per rel.
  const links = document.head.querySelectorAll(`link[rel="${rel}"]`);
  links.forEach((link, index) => index > 0 && link.remove());
  let link = document.head.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  const metas = document.head.querySelectorAll(`meta[${attr}="${key}"]`);
  metas.forEach((meta, index) => index > 0 && meta.remove());
  let meta = document.head.querySelector(
    `meta[${attr}="${key}"]`
  ) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

// Maintains a single <script type="application/ld+json" id> block, replacing
// its contents per route (or removing it when not applicable).
const upsertJsonLd = (id: string, data: object | null) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

// Keeps the document head in sync with the active route: unique title and
// meta description per page, exactly one canonical link pointing to the
// preferred https://www.flyplatoon.com URL (no trailing slash), per-route
// Open Graph / Twitter tags, and a BreadcrumbList that reinforces hierarchy.
const Seo: React.FC<seoProps> = (props) => {
  useEffect(() => {
    let path = canonicalPath(props.pathname);
    // Unknown routes are redirected to the homepage by the router, so
    // they must canonicalize to the homepage as well.
    if (!SEO_DATA[path]) {
      path = "/";
    }
    const entry = SEO_DATA[path];
    const url = canonicalUrl(path);
    const image = entry.ogImage || DEFAULT_OG_IMAGE;

    document.title = entry.title;
    upsertLink("canonical", url);
    upsertMeta("name", "description", entry.description);
    upsertMeta("property", "og:title", entry.title);
    upsertMeta("property", "og:description", entry.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", entry.title);
    upsertMeta("name", "twitter:description", entry.description);
    upsertMeta("name", "twitter:image", image);

    // Breadcrumb only makes sense below the homepage (Home > Section).
    upsertJsonLd(
      "breadcrumb-jsonld",
      path === "/"
        ? null
        : {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${SITE_ORIGIN}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: entry.name || entry.title,
                item: url,
              },
            ],
          }
    );
  }, [props.pathname]);

  return null;
};

export default Seo;
