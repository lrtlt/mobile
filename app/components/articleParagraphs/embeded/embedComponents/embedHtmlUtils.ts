/**
 * On Android, iframes from services like Facebook get blocked with ERR_BLOCKED_BY_RESPONSE
 * due to X-Frame-Options headers. Extract the iframe src and load it directly as the WebView URI.
 * Only applies to known problematic domains to avoid breaking other embeds.
 */
export const BLOCKED_IFRAME_DOMAINS = ['facebook.com', 'instagram.com'];

export const extractBlockedIframeSrc = (html: string): string | null => {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (!match) {
    return null;
  }
  const src = match[1];
  const isBlocked = BLOCKED_IFRAME_DOMAINS.some((domain) => src.includes(domain));
  return isBlocked ? src : null;
};

export const WIDTH_REGEX = /width\s*=\s*["']?\b(\d{3,4})\b["']?/gi;
