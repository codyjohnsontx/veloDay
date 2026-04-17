import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "@/lib/site-url";

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
