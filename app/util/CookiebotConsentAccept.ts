const CONSENT_SCRIPT = `
if (document.cookie.indexOf('CookieConsent=') === -1) {
  var expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  var stamp = Math.random().toString(36).substring(2);
  var utc = Date.now();
  var value = encodeURIComponent("{stamp:'" + stamp + "',necessary:true,preferences:true,statistics:false,marketing:false,method:'explicit',ver:1,utc:" + utc + ",region:'lt'}");
  document.cookie = 'CookieConsent=' + value + '; domain=.lrt.lt; path=/; expires=' + expires.toUTCString() + '; SameSite=Lax';
}
true;
`;

export function getLRTCookiebotConsentScript(url?: string): string | undefined {
  if (!url || !url.includes('lrt.lt')) {
    return undefined;
  }
  return CONSENT_SCRIPT;
}
