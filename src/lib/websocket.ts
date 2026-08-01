import { env } from '@/config/env';
import type { DealUpdateSocketMessage } from '@/models';

export type DealUpdateHandler = (message: DealUpdateSocketMessage) => void;

function isDealUpdateMessage(value: unknown): value is DealUpdateSocketMessage {
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

export class AnalysisSocket {
  private socket: WebSocket | null = null;
  private readonly onUpdate: DealUpdateHandler;

  constructor(onUpdate: DealUpdateHandler) {
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
        if (isDealUpdateMessage(data)) {
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
