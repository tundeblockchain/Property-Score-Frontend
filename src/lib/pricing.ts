import type { CheckoutProduct, Price, PricingResponse } from '@/models';

export const PRICE_UNAVAILABLE_LABEL = 'See pricing at checkout';

export function priceForProduct(
  pricing: PricingResponse,
  product: CheckoutProduct,
): Price | null {
  switch (product) {
    case 'starter_subscription':
      return pricing.plans.starter;
    case 'pro_subscription':
      return pricing.plans.pro;
    case 'credits_5':
      return packPrice(pricing, 5);
    case 'credits_15':
      return packPrice(pricing, 15);
    case 'credits_40':
      return packPrice(pricing, 40);
    case 'credits_100':
      return packPrice(pricing, 100);
  }
}

function packPrice(
  pricing: PricingResponse,
  credits: 5 | 15 | 40 | 100,
): Price | null {
  return (
    pricing.creditPacks.find((pack) => pack.credits === credits)?.price ?? null
  );
}

export function formatPrice(price: Price): string {
  const currency = price.currency.toUpperCase();
  const fractionDigits =
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const majorUnits = price.unitAmount / 10 ** fractionDigits;
  const isWhole = Number.isInteger(majorUnits);
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: isWhole ? 0 : fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(majorUnits);

  if (price.interval === 'month') {
    return `${formatted}/month`;
  }
  if (price.interval === 'year') {
    return `${formatted}/year`;
  }
  return formatted;
}

export function formatPriceLabel(price: Price | null | undefined): string | null {
  if (!price) {
    return null;
  }
  try {
    return formatPrice(price);
  } catch {
    return null;
  }
}
