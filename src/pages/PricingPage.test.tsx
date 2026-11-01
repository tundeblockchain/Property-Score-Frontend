import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBillingPlans } from '@/api/billing';
import { getPricing } from '@/api/pricing';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { PRICE_UNAVAILABLE_LABEL } from '@/lib/pricing';
import type { PlanCatalogItem } from '@/models';
import { PricingPage } from '@/pages/PricingPage';
import { buildBillingPlans, buildPrice, buildPricing } from '@/test/factories';
import { theme } from '@/theme/theme';

vi.mock('@/api/billing', () => ({
  getBilling: vi.fn(),
  getBillingPlans: vi.fn(),
  createCheckout: vi.fn(),
  createPortal: vi.fn(),
}));

vi.mock('@/api/pricing', () => ({
  getPricing: vi.fn(),
}));

const authValue: AuthContextValue = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue(null),
};

function renderPricingPage(): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AuthContext.Provider value={authValue}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<PricingPage />, { wrapper: Wrapper });
}

async function findPaidPlanCards() {
  expect(
    await screen.findByRole('heading', { name: 'Subscriptions' }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: 'Starter' }).length).toBeGreaterThan(
    0,
  );
  expect(screen.getAllByRole('heading', { name: 'Pro' }).length).toBeGreaterThan(0);
  expect(
    screen.getByRole('heading', { name: '5 extra analyses' }),
  ).toBeInTheDocument();
}

describe('PricingPage', () => {
  beforeEach(() => {
    vi.mocked(getBillingPlans).mockResolvedValue(buildBillingPlans());
    vi.mocked(getPricing).mockResolvedValue(buildPricing());
  });

  it('shows live prices from the pricing API', async () => {
    renderPricingPage();
    await findPaidPlanCards();

    expect(await screen.findByText('£39/month')).toBeInTheDocument();
    expect(screen.getByText('£99/month')).toBeInTheDocument();
    expect(screen.getByText('£14 one-time')).toBeInTheDocument();
    expect(screen.getByText('£1.95 per analysis')).toBeInTheDocument();
    expect(screen.getByText('£1.65 per analysis')).toBeInTheDocument();
    expect(screen.getByText('£2.80 per analysis')).toBeInTheDocument();
    expect(screen.getByText('Save 15%')).toBeInTheDocument();
    expect(screen.getByText('20 listing analyses / month')).toBeInTheDocument();
    expect(screen.getByText('60 listing analyses / month')).toBeInTheDocument();
    expect(screen.getByText('Full reports.')).toBeInTheDocument();
    expect(screen.getByText('Free', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('£0')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose Starter' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeEnabled();
  });

  it('uses a frontend Free price and does not read catalog price fields', async () => {
    const catalog = buildBillingPlans();
    expect(catalog.freePlan).not.toHaveProperty('priceLabel');
    expect(catalog.freePlan).not.toHaveProperty('priceGbp');
    expect(catalog.freePlan).not.toHaveProperty('valueLabel');
    expect(catalog.freePlan).not.toHaveProperty('savePercent');

    vi.mocked(getBillingPlans).mockResolvedValue({
      ...catalog,
      freePlan: {
        ...catalog.freePlan,
        priceLabel: '£999',
        priceGbp: 999,
        valueLabel: '£199.80 per analysis',
        savePercent: 50,
      } as PlanCatalogItem,
    });

    renderPricingPage();

    expect(await screen.findByText('Free', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('£0')).not.toBeInTheDocument();
    expect(screen.queryByText('£999')).not.toBeInTheDocument();
    expect(screen.queryByText('£199.80 per analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('Save 50%')).not.toBeInTheDocument();
    expect(screen.getByText('5 listing analyses to start')).toBeInTheDocument();
  });

  it('derives pack value and save badges from live prices', async () => {
    vi.mocked(getBillingPlans).mockResolvedValue(
      buildBillingPlans({
        creditPacks: [
          {
            product: 'credits_5',
            title: '5 extra analyses',
            creditsLabel: '+5 listing analyses',
            description: 'Quick top-up.',
          },
          {
            product: 'credits_15',
            title: '15 extra analyses',
            creditsLabel: '+15 listing analyses',
            description: 'Screen a shortlist.',
          },
        ],
      }),
    );
    vi.mocked(getPricing).mockResolvedValue(
      buildPricing({
        creditPacks: [
          {
            credits: 5,
            price: buildPrice({
              priceId: 'price_credits_5',
              unitAmount: 2000,
              interval: null,
            }),
          },
          {
            credits: 15,
            price: buildPrice({
              priceId: 'price_credits_15',
              unitAmount: 4500,
              interval: null,
            }),
          },
        ],
      }),
    );

    renderPricingPage();
    await findPaidPlanCards();

    expect(await screen.findByText('£20 one-time')).toBeInTheDocument();
    expect(screen.getByText('£45 one-time')).toBeInTheDocument();
    expect(screen.getByText('£4 per analysis')).toBeInTheDocument();
    expect(screen.getByText('£3 per analysis')).toBeInTheDocument();
    expect(screen.getByText('Save 25%')).toBeInTheDocument();
    expect(screen.getByText('+5 listing analyses')).toBeInTheDocument();
    expect(screen.getByText('+15 listing analyses')).toBeInTheDocument();
  });

  it('skeletons only the price slot while pricing loads', async () => {
    vi.mocked(getPricing).mockReturnValue(new Promise(() => {}));

    renderPricingPage();
    await findPaidPlanCards();

    const pricePlaceholders = await screen.findAllByRole('status', {
      name: 'Loading price',
    });
    expect(pricePlaceholders.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('20 listing analyses / month')).toBeInTheDocument();
    expect(screen.getByText('Full reports.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose Starter' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeEnabled();
    expect(screen.queryByText('£39/month')).not.toBeInTheDocument();
    expect(screen.queryByText('£2.80 per analysis')).not.toBeInTheDocument();
    expect(screen.getByText('Free', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('£0')).not.toBeInTheDocument();
    expect(screen.queryByText(PRICE_UNAVAILABLE_LABEL)).not.toBeInTheDocument();
  });

  it('keeps cards usable when pricing fails', async () => {
    const user = userEvent.setup();
    vi.mocked(getPricing).mockRejectedValue(new Error('Pricing unavailable'));

    renderPricingPage();
    await findPaidPlanCards();

    expect(
      (await screen.findAllByText(PRICE_UNAVAILABLE_LABEL)).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('£39/month')).not.toBeInTheDocument();
    expect(screen.queryByText('£2.80 per analysis')).not.toBeInTheDocument();
    expect(screen.getByText('Free', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('£0')).not.toBeInTheDocument();
    expect(screen.getByText('20 listing analyses / month')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Choose Starter' }));
    expect(
      screen.getByRole('heading', { name: 'Create account' }),
    ).toBeInTheDocument();
  });

  it('uses fallback copy when a plan price is null', async () => {
    vi.mocked(getPricing).mockResolvedValue(
      buildPricing({
        plans: {
          starter: null,
          pro: buildPricing().plans.pro,
        },
        creditPacks: [],
      }),
    );

    renderPricingPage();
    await findPaidPlanCards();

    expect(await screen.findByText('£99/month')).toBeInTheDocument();
    expect(screen.getAllByText(PRICE_UNAVAILABLE_LABEL).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText('£39/month')).not.toBeInTheDocument();
    expect(screen.queryByText('£1.95 per analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('£2.80 per analysis')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose Starter' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeEnabled();
  });

  it('uses fallback copy when a live amount is malformed', async () => {
    vi.mocked(getPricing).mockResolvedValue(
      buildPricing({
        plans: {
          starter: buildPrice({
            priceId: 'price_starter',
            unitAmount: Number.NaN,
            interval: 'month',
          }),
          pro: buildPrice({
            priceId: 'price_pro',
            unitAmount: -9900,
            interval: 'month',
          }),
        },
      }),
    );

    renderPricingPage();
    await findPaidPlanCards();

    expect(
      (await screen.findAllByText(PRICE_UNAVAILABLE_LABEL)).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/£NaN/)).not.toBeInTheDocument();
    expect(screen.queryByText('£39/month')).not.toBeInTheDocument();
    expect(screen.queryByText('£99/month')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose Starter' })).toBeEnabled();
  });
});
