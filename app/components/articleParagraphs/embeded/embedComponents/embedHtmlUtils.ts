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

/**
 * Injected CSS can't cross iframe boundaries, so dark mode has to be requested
 * through each provider's own theme parameter.
 */
export const applyDarkThemeToEmbedSrc = (src: string): string => {
  const separator = src.includes('?') ? '&' : '?';
  if (/(platform\.twitter\.com|platform\.x\.com)/.test(src) && !/[?&]theme=/.test(src)) {
    return `${src}${separator}theme=dark`;
  }

  let isDatawrapperHost = false;
  try {
    const parsedUrl = new URL(src);
    isDatawrapperHost = parsedUrl.hostname === 'datawrapper.dwcdn.net';
  } catch {
    isDatawrapperHost = false;
  }

  if (isDatawrapperHost && !/[?&]dark=/.test(src)) {
    return `${src}${separator}dark=true`;
  }
  return src;
};

export type EmbedThemeColors = {
  background: string;
  text: string;
};

export const applyDarkThemeToEmbedHtml = (html: string, colors: EmbedThemeColors): string => {
  const themedHtml = html
    // Twitter/X blockquote embeds pick the theme from a data attribute
    .replace(/<blockquote([^>]*class=["'][^"']*twitter-tweet[^"']*["'][^>]*)>/gi, (match, attrs) =>
      attrs.includes('data-theme') ? match : `<blockquote${attrs} data-theme="dark">`,
    )
    .replace(
      /(<iframe[^>]+src=["'])([^"']+)(["'])/gi,
      (_match, prefix, src, suffix) => `${prefix}${applyDarkThemeToEmbedSrc(src)}${suffix}`,
    );

  // Plain HTML fragments (text, links) render black-on-white by default.
  // color-scheme lets the engine adjust UA defaults (links, form controls) too.
  const darkBaseStyle =
    '<style>' +
    ':root { color-scheme: dark; }' +
    `body { background-color: ${colors.background}; color: ${colors.text}; }` +
    '</style>';

  return `${darkBaseStyle}${themedHtml}`;
};
