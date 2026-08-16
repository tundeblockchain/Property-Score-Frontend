import { describe, expect, it } from 'vitest';
import { PROPERTIES_PATH, resolvePostLoginPath } from '@/lib/paths';

describe('resolvePostLoginPath', () => {
  it('sends a direct login to Properties', () => {
    expect(resolvePostLoginPath(undefined)).toBe(PROPERTIES_PATH);
    expect(resolvePostLoginPath('/login')).toBe(PROPERTIES_PATH);
  });

  it('returns the protected page the user was trying to open', () => {
    expect(resolvePostLoginPath('/account')).toBe('/account');
    expect(resolvePostLoginPath('/analyse')).toBe('/analyse');
  });

  it('ignores unsafe or non-path values', () => {
    expect(resolvePostLoginPath('https://example.com')).toBe(PROPERTIES_PATH);
    expect(resolvePostLoginPath('//example.com')).toBe(PROPERTIES_PATH);
  });
});
