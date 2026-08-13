import { env } from '@/config/env';
import type {
  DealUpdateSocketMessage,
  HmoRenderUpdateSocketMessage,
  JobSocketMessage,
} from '@/models';

export type JobSocketHandler = (message: JobSocketMessage) => void;

const HMO_RENDER_STATUSES = new Set(['pending', 'ready', 'failed', 'skipped']);

export function isDealUpdateMessage(value: unknown): value is DealUpdateSocketMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const message = value as Partial<DealUpdateSocketMessage>;
  return (
    message.type === 'DEAL_UPDATE' &&
    typeof message.jobId === 'string' &&
    message.status === 'COMPLETED' &&
    typeof message.scores === 'object' &&
    message.scores !== null
  );
}

export function isHmoRenderUpdateMessage(value: unknown): value is HmoRenderUpdateSocketMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const message = value as Partial<HmoRenderUpdateSocketMessage>;
  const rendering = message.rendering;
  return (
    message.type === 'HMO_RENDER_UPDATE' &&
    typeof message.jobId === 'string' &&
    typeof message.schemeId === 'string' &&
    typeof rendering === 'object' &&
    rendering !== null &&
    rendering.kind === 'proposed_floor_plan' &&
    typeof rendering.promptVersion === 'string' &&
    typeof rendering.status === 'string' &&
    HMO_RENDER_STATUSES.has(rendering.status)
  );
}

function isJobSocketMessage(value: unknown): value is JobSocketMessage {
  return isDealUpdateMessage(value) || isHmoRenderUpdateMessage(value);
}

export class AnalysisSocket {
  private socket: WebSocket | null = null;
  private readonly onUpdate: JobSocketHandler;

  constructor(onUpdate: JobSocketHandler) {
    this.onUpdate = onUpdate;
  }

  connect(token: string): Promise<void> {
    this.close();
    const url = `${env.wsUrl}?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(url);
    this.socket = socket;

    socket.addEventListener('message', (event) => {
      try {
        const data: unknown = JSON.parse(String(event.data));
        if (isJobSocketMessage(data)) {
          this.onUpdate(data);
        }
      } catch {
        // Ignore non-JSON or unrelated messages.
      }
    });

    return new Promise((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), { once: true });
      socket.addEventListener(
        'error',
        () => reject(new Error('WebSocket connection failed')),
        { once: true },
      );
    });
  }

  subscribe(jobId: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(JSON.stringify({ action: 'subscribe', jobId }));
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
