import { publicGet } from '@/api/client';
import type { PricingResponse } from '@/models';

export function getPricing(): Promise<PricingResponse> {
  return publicGet<PricingResponse>('/api/pricing');
}
