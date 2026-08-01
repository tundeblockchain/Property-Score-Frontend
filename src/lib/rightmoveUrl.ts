const RIGHTMOVE_HOSTS = new Set(['rightmove.co.uk', 'www.rightmove.co.uk']);

export function isValidRightmoveUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    if (!RIGHTMOVE_HOSTS.has(url.hostname.toLowerCase())) {
      return false;
    }
    return /^\/properties\/\d+\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

export function normalizeRightmoveUrl(value: string): string {
  const url = new URL(value.trim());
  url.hash = '';
  return url.toString();
}
