import { describe, expect, it } from 'vitest';
import { schemeRenderPollInterval } from '@/hooks/useSchemeRender';
import { buildHmoSchemeRendering } from '@/test/factories';

describe('schemeRenderPollInterval', () => {
  it('polls while generation is in flight', () => {
    expect(
      schemeRenderPollInterval(
        {
          dealId: 'deal-1',
          schemeId: 'students',
          rendering: buildHmoSchemeRendering({ status: 'pending' }),
        },
        undefined,
      ),
    ).toBe(2500);
  });

  it('refreshes a ready image before the presigned URL expires', () => {
    expect(
      schemeRenderPollInterval(
        {
          dealId: 'deal-1',
          schemeId: 'students',
          rendering: buildHmoSchemeRendering({ status: 'ready' }),
          imageUrl: 'https://example.com/plan.png',
          expiresInSeconds: 900,
        },
        undefined,
      ),
    ).toBe(780_000);
  });

  it('treats imageUrls as ready photos when imageUrl is omitted', () => {
    expect(
      schemeRenderPollInterval(
        {
          dealId: 'deal-1',
          schemeId: 'students',
          rendering: buildHmoSchemeRendering({ status: 'ready' }),
          imageUrls: [
            'https://example.com/ground.png',
            'https://example.com/first.png',
          ],
          expiresInSeconds: 900,
        },
        undefined,
      ),
    ).toBe(780_000);
  });

  it('does not poll skipped or failed renders', () => {
    expect(
      schemeRenderPollInterval(
        undefined,
        buildHmoSchemeRendering({ status: 'skipped', skipReason: 'no_api_key' }),
      ),
    ).toBe(false);
  });
});
