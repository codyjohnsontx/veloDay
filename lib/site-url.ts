const DEFAULT_SITE_URL = "https://veloday.com";

export function resolveSiteUrl(value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const raw = value?.trim();
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

export function getSiteOrigin(value?: string): string {
  return resolveSiteUrl(value).origin;
}
