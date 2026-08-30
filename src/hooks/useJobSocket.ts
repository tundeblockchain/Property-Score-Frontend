import { useCallback, useRef, useSyncExternalStore } from 'react';
import { AnalysisSocket } from '@/lib/websocket';
import type { JobSocketMessage } from '@/models';

/**
 * Keeps an analysis websocket open for the current job. Message handling
 * stays in the caller so deal-detail and in-progress analysis can react
 * differently. Snapshot is the job id only — cache updates drive re-renders.
 */
export function useJobSocket(
  jobId: string | null | undefined,
  getIdToken: () => Promise<string | null>,
  onMessage: (message: JobSocketMessage) => void,
): void {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const subscribe = useCallback(
    (_onStoreChange: () => void) => {
      if (!jobId) {
        return () => {};
      }

      let cancelled = false;
      const socket = new AnalysisSocket((message) => {
        onMessageRef.current(message);
      });

      void (async () => {
        const token = await getIdToken();
        if (!token || cancelled) {
          return;
        }
        try {
          await socket.connect(token);
          if (!cancelled) {
            socket.subscribe(jobId);
          }
        } catch {
          // HTTP polling remains the fallback when the socket cannot connect.
        }
      })();

      return () => {
        cancelled = true;
        socket.close();
      };
    },
    [getIdToken, jobId],
  );

  useSyncExternalStore(subscribe, () => jobId ?? null, () => null);
}
