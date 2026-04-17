import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://veloday.com";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = raw && raw.length > 0 ? raw : DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  try {
    return new URL(withProtocol);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export default function robots(): MetadataRoute.Robots {
  const url = resolveSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/messages", "/sell/new", "/api"],
      },
    ],
    sitemap: new URL("/sitemap.xml", url).toString(),
    host: url.origin,
  };
}
