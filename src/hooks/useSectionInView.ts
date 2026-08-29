import { useEffect, useState } from 'react';

/** Keeps the band below the sticky header out of the running. */
const ROOT_MARGIN = '-88px 0px -55% 0px';

/**
 * Tracks which of the given element ids is currently the topmost one in view,
 * so a section nav can highlight the reader's position.
 */
export function useSectionInView(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Ids are rebuilt each render; the joined form gives the effect a stable dep.
  const idKey = ids.join('|');
  const [trackedIdKey, setTrackedIdKey] = useState(idKey);

  if (idKey !== trackedIdKey) {
    setTrackedIdKey(idKey);
    setActiveId(null);
  }

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const orderedIds = idKey.length > 0 ? idKey.split('|') : [];
    const elements = orderedIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) {
      return;
    }

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        }

        const topmost = orderedIds.find((id) => visibleIds.has(id));
        // Keep the last known section while between two of them.
        if (topmost) {
          setActiveId(topmost);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [idKey]);

  return activeId;
}
