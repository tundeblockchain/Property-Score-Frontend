import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

let printing = false;

function subscribeToPrint(onStoreChange: () => void): () => void {
  function handleBeforePrint() {
    printing = true;
    // The browser snapshots the page as soon as beforeprint returns, so the
    // expanded DOM must commit before this handler finishes.
    flushSync(onStoreChange);
  }

  function handleAfterPrint() {
    printing = false;
    onStoreChange();
  }

  window.addEventListener('beforeprint', handleBeforePrint);
  window.addEventListener('afterprint', handleAfterPrint);
  return () => {
    window.removeEventListener('beforeprint', handleBeforePrint);
    window.removeEventListener('afterprint', handleAfterPrint);
    printing = false;
  };
}

export function useIsPrinting(): boolean {
  return useSyncExternalStore(subscribeToPrint, () => printing, () => false);
}
