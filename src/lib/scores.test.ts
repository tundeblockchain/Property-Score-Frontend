import { describe, expect, it } from 'vitest';
import { clampScore, scoreBandLabel, scoreTone } from '@/lib/scores';

describe('clampScore', () => {
  it.each([
    [-10, 0],
    [0, 0],
    [55, 55],
    [100, 100],
    [130, 100],
  ])('clamps %i to %i', (input, expected) => {
    expect(clampScore(input)).toBe(expected);
  });

  it('treats NaN as zero', () => {
    expect(clampScore(Number.NaN)).toBe(0);
  });
});

describe('scoreTone', () => {
  it.each([
    [0, 'error'],
    [49, 'error'],
    [50, 'warning'],
    [64, 'warning'],
    [65, 'info'],
    [79, 'info'],
    [80, 'success'],
    [100, 'success'],
  ])('maps %i to the %s band', (score, expected) => {
    expect(scoreTone(score)).toBe(expected);
  });

  it('clamps out-of-range scores into the nearest band', () => {
    expect(scoreTone(-5)).toBe('error');
    expect(scoreTone(140)).toBe('success');
  });
});

describe('scoreBandLabel', () => {
  it.each([
    [20, 'Weak'],
    [55, 'Marginal'],
    [70, 'Fair'],
    [90, 'Strong'],
  ])('labels %i as %s', (score, expected) => {
    expect(scoreBandLabel(score)).toBe(expected);
  });
});
