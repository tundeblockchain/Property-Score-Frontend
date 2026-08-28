const RIGHTMOVE_HOSTS = new Set(['rightmove.co.uk', 'www.rightmove.co.uk']);
const ONTHEMARKET_HOSTS = new Set(['onthemarket.com', 'www.onthemarket.com']);
const ZOOPLA_HOSTS = new Set(['zoopla.co.uk', 'www.zoopla.co.uk']);

function parseHttpUrl(value: string): URL | undefined {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}

export function isValidRightmoveUrl(value: string): boolean {
  const url = parseHttpUrl(value);
  if (!url || !RIGHTMOVE_HOSTS.has(url.hostname.toLowerCase())) {
    return false;
  }
  return /^\/properties\/\d+\/?$/.test(url.pathname);
}

export function isValidOnthemarketUrl(value: string): boolean {
  const url = parseHttpUrl(value);
  if (!url || !ONTHEMARKET_HOSTS.has(url.hostname.toLowerCase())) {
    return false;
  }
  return /^\/details\/\d+\/?$/i.test(url.pathname);
}

export function isValidZooplaUrl(value: string): boolean {
  const url = parseHttpUrl(value);
  if (!url || !ZOOPLA_HOSTS.has(url.hostname.toLowerCase())) {
    return false;
  }
  return /^\/(for-sale|to-rent)\/details\/\d+\/?$/i.test(url.pathname);
}

export function isValidListingUrl(value: string): boolean {
  return (
    isValidRightmoveUrl(value) ||
    isValidOnthemarketUrl(value) ||
    isValidZooplaUrl(value)
  );
}

export function normalizeListingUrl(value: string): string {
  const url = new URL(value.trim());
  url.hash = '';
  url.search = '';
  return url.toString();
}
