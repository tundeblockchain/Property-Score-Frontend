const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'UL',
  'OL',
  'LI',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'A',
  'SPAN',
  'DIV',
]);

function isSafeHref(href: string): boolean {
  return /^(https?:|mailto:)\s*/i.test(href.trim());
}

function sanitizeNode(node: Node, documentRef: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return documentRef.createTextNode(node.textContent ?? '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;

  if (!ALLOWED_TAGS.has(element.tagName)) {
    const fragment = documentRef.createDocumentFragment();
    for (const child of Array.from(element.childNodes)) {
      const sanitized = sanitizeNode(child, documentRef);
      if (sanitized) {
        fragment.appendChild(sanitized);
      }
    }
    return fragment;
  }

  const clean = documentRef.createElement(element.tagName.toLowerCase());

  if (element.tagName === 'A') {
    const href = element.getAttribute('href');
    if (href && isSafeHref(href)) {
      clean.setAttribute('href', href.trim());
      clean.setAttribute('target', '_blank');
      clean.setAttribute('rel', 'noopener noreferrer');
    }
  }

  for (const child of Array.from(element.childNodes)) {
    const sanitized = sanitizeNode(child, documentRef);
    if (sanitized) {
      clean.appendChild(sanitized);
    }
  }

  return clean;
}

/** Allow only simple listing markup from Rightmove (p, headings, lists, links). */
export function sanitizeListingHtml(dirty: string): string {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(dirty, 'text/html');
  const container = document.createElement('div');

  for (const child of Array.from(parsed.body.childNodes)) {
    const sanitized = sanitizeNode(child, document);
    if (sanitized) {
      container.appendChild(sanitized);
    }
  }

  return container.innerHTML;
}

export function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}
