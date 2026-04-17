import type { MetadataRoute } from "next";

import { listings } from "@/lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://veloday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = [
    "complete-bike",
    "frame",
    "wheelset",
  ].map((category) => ({
    url: `${siteUrl}/search?category=${category}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${siteUrl}/listing/${listing.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
}
