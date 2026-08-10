export type ScoreTone = 'error' | 'warning' | 'info' | 'success';

interface ScoreBand {
  /** Lowest score, inclusive, that falls in this band. */
  readonly minScore: number;
  readonly tone: ScoreTone;
  readonly label: string;
}

const WEAK_BAND: ScoreBand = { minScore: 0, tone: 'error', label: 'Weak' };

/** Product-defined traffic-light bands for 0–100 scores, highest first. */
const SCORE_BANDS: readonly ScoreBand[] = [
  { minScore: 80, tone: 'success', label: 'Strong' },
  { minScore: 65, tone: 'info', label: 'Fair' },
  { minScore: 50, tone: 'warning', label: 'Marginal' },
  WEAK_BAND,
];

export function clampScore(score: number): number {
  if (Number.isNaN(score)) {
    return 0;
  }
  return Math.min(100, Math.max(0, score));
}

function scoreBand(score: number): ScoreBand {
  const clamped = clampScore(score);
  return SCORE_BANDS.find((band) => clamped >= band.minScore) ?? WEAK_BAND;
}

export function scoreTone(score: number): ScoreTone {
  return scoreBand(score).tone;
}

/**
 * Word for a score band, so the meaning of a score is never carried by colour
 * alone.
 */
export function scoreBandLabel(score: number): string {
  return scoreBand(score).label;
}
