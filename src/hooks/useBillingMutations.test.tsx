import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCheckout } from '@/api/billing';
import { queryKeys } from '@/hooks/queryKeys';
import { useCheckout } from '@/hooks/useBillingMutations';
import { CHECKOUT_PRODUCT } from '@/lib/plans';
import { buildBillingPlans } from '@/test/factories';

const rememberPendingCheckout = vi.fn();
const trackInitiateCheckout = vi.fn();

vi.mock('@/api/billing', () => ({
  createCheckout: vi.fn(),
  createPortal: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({
  rememberPendingCheckout: (...args: unknown[]) => rememberPendingCheckout(...args),
  trackInitiateCheckout: (...args: unknown[]) => trackInitiateCheckout(...args),
}));

describe('useCheckout', () => {
  beforeEach(() => {
    rememberPendingCheckout.mockClear();
    trackInitiateCheckout.mockClear();
    vi.mocked(createCheckout).mockResolvedValue({
      checkoutUrl: 'https://checkout.stripe.com/cs_test',
      sessionId: 'cs_test',
    });
    vi.stubGlobal(
      'location',
      Object.create(window.location, {
        assign: { value: vi.fn(), configurable: true },
      }),
    );
  });

  it('records the selected plan and fires InitiateCheckout before redirecting', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(queryKeys.billingPlans, buildBillingPlans());

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
    }

    const { result } = renderHook(() => useCheckout(), { wrapper: Wrapper });
    result.current.mutate(CHECKOUT_PRODUCT.PRO_SUBSCRIPTION);

    await waitFor(() => {
      expect(rememberPendingCheckout).toHaveBeenCalledWith({
        product: CHECKOUT_PRODUCT.PRO_SUBSCRIPTION,
        value: 99,
        contentName: 'Pro',
        sessionId: 'cs_test',
      });
    });
    expect(trackInitiateCheckout).toHaveBeenCalledWith({
      product: CHECKOUT_PRODUCT.PRO_SUBSCRIPTION,
      value: 99,
      contentName: 'Pro',
      sessionId: 'cs_test',
    });
  });
});
