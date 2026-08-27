import { describe, expect, it } from 'vitest';
import {
  isValidListingUrl,
  isValidOnthemarketUrl,
  isValidRightmoveUrl,
  isValidZooplaUrl,
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

  it('accepts Zoopla sale and rent details URLs', () => {
    expect(
      isValidZooplaUrl('https://www.zoopla.co.uk/for-sale/details/71153465'),
    ).toBe(true);
    expect(
      isValidZooplaUrl('https://zoopla.co.uk/to-rent/details/12345678/'),
    ).toBe(true);
    expect(
      isValidListingUrl('https://www.zoopla.co.uk/for-sale/details/71153465'),
    ).toBe(true);
  });

  it('rejects Zoopla search URLs', () => {
    expect(
      isValidListingUrl('https://www.zoopla.co.uk/for-sale/property/london/'),
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
