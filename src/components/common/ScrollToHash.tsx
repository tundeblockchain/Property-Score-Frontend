interface ScrollToHashProps {
  hash: string;
}

/**
 * Scrolls to the element matching the location hash after that element has
 * mounted. Used when arriving from another route, where the browser cannot
 * scroll to a section that had not rendered yet.
 */
export function ScrollToHash({ hash }: ScrollToHashProps) {
  if (!hash) {
    return null;
  }

  return (
    <span
      key={hash}
      aria-hidden
      ref={() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    />
  );
}
