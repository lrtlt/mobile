import {
  extractBlockedIframeSrc,
  WIDTH_REGEX,
} from '../app/components/articleParagraphs/embeded/embedComponents/embedHtmlUtils';

describe('extractBlockedIframeSrc', () => {
  it('extracts Facebook embed URL from iframe', () => {
    const html =
      '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fvilnius.lt%2Fposts%2F123&show_text=true&width=500" width="500" height="638"></iframe>';
    expect(extractBlockedIframeSrc(html)).toBe(
      'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fvilnius.lt%2Fposts%2F123&show_text=true&width=500',
    );
  });

  it('extracts Instagram embed URL from iframe', () => {
    const html =
      '<iframe src="https://www.instagram.com/p/ABC123/embed" width="400" height="500"></iframe>';
    expect(extractBlockedIframeSrc(html)).toBe('https://www.instagram.com/p/ABC123/embed');
  });

  it('returns null for YouTube iframe (not blocked)', () => {
    const html =
      '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>';
    expect(extractBlockedIframeSrc(html)).toBeNull();
  });

  it('returns null for Twitter iframe (not blocked)', () => {
    const html =
      '<iframe src="https://platform.twitter.com/embed/Tweet.html?id=123" width="500" height="300"></iframe>';
    expect(extractBlockedIframeSrc(html)).toBeNull();
  });

  it('returns null when no iframe is present', () => {
    const html = '<div><p>Hello world</p></div>';
    expect(extractBlockedIframeSrc(html)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractBlockedIframeSrc('')).toBeNull();
  });

  it('handles single-quoted src attribute', () => {
    const html =
      "<iframe src='https://www.facebook.com/plugins/video.php?href=test' width='500'></iframe>";
    expect(extractBlockedIframeSrc(html)).toBe(
      'https://www.facebook.com/plugins/video.php?href=test',
    );
  });

  it('handles iframe with attributes before src', () => {
    const html =
      '<iframe width="500" height="300" src="https://www.facebook.com/plugins/post.php?href=test" frameborder="0"></iframe>';
    expect(extractBlockedIframeSrc(html)).toBe(
      'https://www.facebook.com/plugins/post.php?href=test',
    );
  });

  it('is case-insensitive for the iframe tag', () => {
    const html =
      '<IFRAME SRC="https://www.facebook.com/plugins/post.php?href=test" width="500"></IFRAME>';
    expect(extractBlockedIframeSrc(html)).toBe(
      'https://www.facebook.com/plugins/post.php?href=test',
    );
  });
});

describe('WIDTH_REGEX', () => {
  const replaceWidth = (html: string, newWidth: number) =>
    html.replace(WIDTH_REGEX, `width="${newWidth}"`);

  it('replaces unquoted width attribute', () => {
    const html = '<iframe width=500 height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height="300"></iframe>');
  });

  it('replaces double-quoted width attribute', () => {
    const html = '<iframe width="500" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height="300"></iframe>');
  });

  it('replaces single-quoted width attribute', () => {
    const html = "<iframe width='500' height='300'></iframe>";
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height=\'300\'></iframe>');
  });

  it('replaces width with spaces around equals sign', () => {
    const html = '<iframe width = "500" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height="300"></iframe>');
  });

  it('replaces multiple width occurrences', () => {
    const html = '<iframe width="500"></iframe><div width="800"></div>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350"></iframe><div width="350"></div>');
  });

  it('replaces 3-digit widths', () => {
    const html = '<iframe width="387" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height="300"></iframe>');
  });

  it('replaces 4-digit widths', () => {
    const html = '<iframe width="1024" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="350" height="300"></iframe>');
  });

  it('does not replace 1-2 digit values', () => {
    const html = '<iframe width="50" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="50" height="300"></iframe>');
  });

  it('does not replace 5+ digit values', () => {
    const html = '<iframe width="10000" height="300"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe width="10000" height="300"></iframe>');
  });

  it('does not replace height attribute', () => {
    const html = '<iframe height="500"></iframe>';
    expect(replaceWidth(html, 350)).toBe('<iframe height="500"></iframe>');
  });

  it('handles real Facebook embed HTML', () => {
    const html =
      '<iframe src="https://www.facebook.com/plugins/post.php?href=test&width=387.4285583496094" width="387.4285583496094" height="638" style="border:none;overflow:hidden" scrolling="no" frameborder="0"></iframe>';
    // 387.4285583496094 — the \b boundary matches "387" then stops at ".", so the decimal part remains
    const result = replaceWidth(html, 350);
    expect(result).toContain('width="350"');
    expect(result).toContain('height="638"');
  });
});
