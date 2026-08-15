import { describe, expect, it } from 'vitest';
import { isDealUpdateMessage, isHmoRenderUpdateMessage } from '@/lib/websocket';

describe('isDealUpdateMessage', () => {
  it('accepts a completed deal push', () => {
    expect(
      isDealUpdateMessage({
        type: 'DEAL_UPDATE',
        jobId: 'deal_1',
        status: 'COMPLETED',
        scores: { overall: 70, financial: 70, compliance: 70, marketDemand: 70, location: 70, refurb: 70 },
      }),
    ).toBe(true);
  });

  it('rejects render updates', () => {
    expect(
      isDealUpdateMessage({
        type: 'HMO_RENDER_UPDATE',
        jobId: 'deal_1',
        schemeId: 'students',
        rendering: {
          kind: 'proposed_floor_plan',
          status: 'ready',
          promptVersion: 'hmo-render-v1',
        },
      }),
    ).toBe(false);
  });
});

describe('isHmoRenderUpdateMessage', () => {
  it('accepts a proposed-layout status push', () => {
    expect(
      isHmoRenderUpdateMessage({
        type: 'HMO_RENDER_UPDATE',
        jobId: 'deal_1',
        schemeId: 'students',
        rendering: {
          kind: 'proposed_floor_plan',
          status: 'pending',
          promptVersion: 'hmo-render-v1',
        },
      }),
    ).toBe(true);
  });

  it('rejects deal completion pushes', () => {
    expect(
      isHmoRenderUpdateMessage({
        type: 'DEAL_UPDATE',
        jobId: 'deal_1',
        status: 'COMPLETED',
        scores: { overall: 70, financial: 70, compliance: 70, marketDemand: 70, location: 70, refurb: 70 },
      }),
    ).toBe(false);
  });
});
