import { logError } from '@/lib/errors';
import type {
  CheckoutProduct,
  CreditPackSize,
  Price,
  PricingResponse,
} from '@/models';

export const PRICE_UNAVAILABLE_LABEL = 'See pricing at checkout';

export interface LivePlanCopy {
  priceLabel: string | null;
  valueLabel: string | null;
  savePercent: number | null;
}

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
  credits: CreditPackSize,
): Price | null {
  return (
    pricing.creditPacks.find((pack) => pack.credits === credits)?.price ?? null
  );
}

export function isUsablePrice(price: Price): boolean {
  return Number.isFinite(price.unitAmount) && price.unitAmount >= 0;
}

export function analysisCountFromCreditsLabel(
  creditsLabel: string,
): number | null {
  const match = creditsLabel.match(/(\d+)/);
  if (!match) {
    return null;
  }
  const count = Number(match[1]);
  if (!Number.isInteger(count) || count <= 0) {
    return null;
  }
  return count;
}

function currencyFractionDigits(currency: string): number {
  return (
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).resolvedOptions().maximumFractionDigits ?? 2
  );
}

export function majorUnitsFromPrice(price: Price): number {
  if (!isUsablePrice(price)) {
    throw new RangeError('Invalid price amount');
  }
  return price.unitAmount / 10 ** currencyFractionDigits(price.currency);
}

export function formatCurrencyAmount(amount: number, currency: string): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError('Invalid currency amount');
  }
  const digits = currencyFractionDigits(currency);
  const isWhole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: isWhole ? 0 : digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPrice(price: Price): string {
  const formatted = formatCurrencyAmount(
    majorUnitsFromPrice(price),
    price.currency,
  );
  if (price.interval === 'month') {
    return `${formatted}/month`;
  }
  if (price.interval === 'year') {
    return `${formatted}/year`;
  }
  return `${formatted} one-time`;
}

export function formatPriceLabel(
  price: Price | null | undefined,
): string | null {
  if (!price) {
    return null;
  }
  try {
    return formatPrice(price);
  } catch (error) {
    logError(error, 'Unable to format price');
    return null;
  }
}

export function formatPerAnalysisValue(
  price: Price,
  analysisCount: number,
): string | null {
  if (!Number.isInteger(analysisCount) || analysisCount <= 0) {
    return null;
  }
  try {
    const perAnalysis = majorUnitsFromPrice(price) / analysisCount;
    return `${formatCurrencyAmount(perAnalysis, price.currency)} per analysis`;
  } catch (error) {
    logError(error, 'Unable to format per-analysis value');
    return null;
  }
}

export function savePercentFromUnitPrices(
  unitPrice: number,
  baselineUnitPrice: number,
): number | null {
  if (
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(baselineUnitPrice) ||
    unitPrice <= 0 ||
    baselineUnitPrice <= 0 ||
    unitPrice >= baselineUnitPrice
  ) {
    return null;
  }
  const percent = Math.round((1 - unitPrice / baselineUnitPrice) * 100);
  return percent > 0 ? percent : null;
}

export function liveCopyForPlans(
  pricing: PricingResponse,
  plans: ReadonlyArray<{ product: CheckoutProduct; creditsLabel: string }>,
): Map<CheckoutProduct, LivePlanCopy> {
  const copies = new Map<CheckoutProduct, LivePlanCopy>();
  const unitPrices = new Map<CheckoutProduct, number>();

  for (const plan of plans) {
    const price = priceForProduct(pricing, plan.product);
    const priceLabel = formatPriceLabel(price);
    const count = analysisCountFromCreditsLabel(plan.creditsLabel);
    const canDerive = price != null && priceLabel != null && count != null;
    const valueLabel = canDerive
      ? formatPerAnalysisValue(price, count)
      : null;
    if (canDerive) {
      try {
        unitPrices.set(plan.product, majorUnitsFromPrice(price) / count);
      } catch (error) {
        logError(error, 'Unable to compute per-analysis price');
      }
    }
    copies.set(plan.product, {
      priceLabel,
      valueLabel,
      savePercent: null,
    });
  }

  let baseline: number | null = null;
  for (const unitPrice of unitPrices.values()) {
    if (baseline == null || unitPrice > baseline) {
      baseline = unitPrice;
    }
  }

  for (const [product, copy] of copies) {
    const unitPrice = unitPrices.get(product);
    copies.set(product, {
      ...copy,
      savePercent:
        unitPrice != null && baseline != null
          ? savePercentFromUnitPrices(unitPrice, baseline)
          : null,
    });
  }

  return copies;
}
