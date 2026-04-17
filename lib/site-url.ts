const DEFAULT_SITE_URL = "https://veloday.com";

export function resolveSiteUrl(
  value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): URL {
  const raw = value?.trim();
  const hasExplicitValue = raw !== undefined && raw.length > 0;
  const candidate = hasExplicitValue ? raw : DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  try {
    return new URL(withProtocol);
  } catch (cause) {
    if (hasExplicitValue) {
      throw new Error(
        `Invalid NEXT_PUBLIC_SITE_URL: "${raw}". Provide a well-formed URL (e.g. https://example.com).`,
        { cause },
      );
    }
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getSiteOrigin(value?: string): string {
  return resolveSiteUrl(value).origin;
}
