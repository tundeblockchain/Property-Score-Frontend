import { describe, expect, it } from 'vitest';
import { dealPollInterval } from '@/hooks/useDealDetail';

describe('dealPollInterval', () => {
  const now = 1_000_000;

  it('polls only while the deal is still processing', () => {
    expect(dealPollInterval('PROCESSING', now, now)).toBe(5000);
    expect(dealPollInterval('COMPLETED', now, now)).toBe(false);
    expect(dealPollInterval('FAILED', now, now)).toBe(false);
    expect(dealPollInterval(undefined, now, now)).toBe(false);
  });

  it('stops polling once the watch window has elapsed', () => {
    const watchingSince = now - 10 * 60 * 1000 - 1;

    expect(dealPollInterval('PROCESSING', watchingSince, now)).toBe(false);
  });

  it('keeps polling inside the watch window', () => {
    const watchingSince = now - 60_000;

    expect(dealPollInterval('PROCESSING', watchingSince, now)).toBe(5000);
  });
});
