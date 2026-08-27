import { describe, expect, it } from 'vitest';
import {
  isValidListingUrl,
  isValidOnthemarketUrl,
  isValidRightmoveUrl,
  normalizeListingUrl,
} from '@/lib/listingUrl';

describe('listingUrl helpers', () => {
  it('accepts Rightmove property URLs', () => {
    expect(
      isValidRightmoveUrl('https://www.rightmove.co.uk/properties/123456789'),
    ).toBe(true);
    expect(isValidListingUrl('https://www.rightmove.co.uk/properties/123')).toBe(
      true,
    );
  });

  it('accepts OnTheMarket details URLs', () => {
    expect(
      isValidOnthemarketUrl('https://www.onthemarket.com/details/19498710/'),
    ).toBe(true);
    expect(isValidListingUrl('https://onthemarket.com/details/19498710')).toBe(
      true,
    );
  });

  it('rejects Zoopla and search URLs', () => {
    expect(
      isValidListingUrl('https://www.zoopla.co.uk/for-sale/details/123'),
    ).toBe(false);
    expect(
      isValidOnthemarketUrl(
        'https://www.onthemarket.com/for-sale/property/london/',
      ),
    ).toBe(false);
  });

  it('strips hash fragments and query strings', () => {
    expect(
      normalizeListingUrl(
        'https://www.onthemarket.com/details/19498710/?channel=RES_BUY#gallery',
      ),
    ).toBe('https://www.onthemarket.com/details/19498710/');
  });
});
