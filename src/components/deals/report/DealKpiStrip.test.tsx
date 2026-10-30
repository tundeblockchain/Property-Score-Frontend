import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealKpiStrip } from '@/components/deals/report/DealKpiStrip';
import {
  buildFamilyLetHeadline,
  buildFinancialModel,
  buildHmoHeadline,
  buildHmoMoneySnapshot,
  buildHmoPlanner,
  buildHmoScheme,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

function schemeWithMoney(
  id: string,
  useCase: 'students' | 'workers' | 'social_care',
  money: Partial<ReturnType<typeof buildFinancialModel>>,
  extras: { lettingRooms?: number; recommended?: boolean } = {},
) {
  const lettingRooms = extras.lettingRooms ?? 5;
  return buildHmoScheme({
    id,
    useCase,
    lettingRooms,
    recommended: extras.recommended ?? false,
    financials: {
      ...buildFinancialModel(money),
      voidRateAssumed: 0.08,
      roomRentWeeklyAssumed: 110,
      occupiedRoomsAssumed: lettingRooms,
    },
  });
}

function moneyComparison(family: ReturnType<typeof buildHmoMoneySnapshot>) {
  return {
    asListedFamily: family,
    bestHmo: {
      ...buildHmoMoneySnapshot(),
      schemeId: 'workers',
      schemeTitle: 'Workers HMO',
    },
    delta: {
      monthlyRentGbp: 0,
      grossYieldPts: 0,
      netCashFlowAnnualGbp: 0,
      estimatedRoiPts: 0,
    },
    notes: [] as string[],
  };
}

describe('DealKpiStrip', () => {
  it('surfaces the headline financial figures', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    expect(screen.getByText('Gross yield')).toBeInTheDocument();
    expect(screen.getByText('8.6%')).toBeInTheDocument();
    expect(screen.getByText('£1,800')).toBeInTheDocument();
    expect(screen.getByText('£7,200')).toBeInTheDocument();
    expect(screen.getByText('12.4%')).toBeInTheDocument();
  });

  it('links each figure to the section that explains it', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '#financial-model');
    }
  });

  it('keeps every tile present with a placeholder when there is no model', () => {
    renderWithProviders(<DealKpiStrip />);

    expect(screen.getByRole('list', { name: 'Key figures' })).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(4);
  });

  it('uses the planner headline when it is present, even if schemes differ', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        hmoPlanner={buildHmoPlanner({
          headline: buildHmoHeadline({
            schemeId: 'workers',
            label: 'Workers HMO',
            lettingRooms: 6,
            estimatedRentMonthly: 2400,
            grossYield: 11.2,
            netCashFlowAnnual: 9800,
            estimatedRoi: 14.1,
          }),
          schemes: [
            schemeWithMoney(
              'students',
              'students',
              { netCashFlowAnnual: 20_000, estimatedRoi: 30 },
              { lettingRooms: 4, recommended: true },
            ),
          ],
        })}
      />,
    );

    expect(screen.getByText('Best return: Workers HMO')).toBeInTheDocument();
    expect(screen.getByText('11.2%')).toBeInTheDocument();
    expect(screen.getByText('£2,400')).toBeInTheDocument();
    expect(screen.getByText('£9,800')).toBeInTheDocument();
    expect(screen.getByText('14.1%')).toBeInTheDocument();
    expect(screen.getByText('HMO rooms')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('8.6%')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /HMO rooms/ })).toHaveAttribute(
      'href',
      '#hmo-overview',
    );
  });

  it('derives the cash-flow winner for older deals without a headline', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        hmoPlanner={buildHmoPlanner({
          schemes: [
            schemeWithMoney(
              'students',
              'students',
              {
                estimatedRentMonthly: 1600,
                grossYield: 9,
                netCashFlowAnnual: 4_000,
                estimatedRoi: 20,
              },
              { lettingRooms: 4, recommended: true },
            ),
            schemeWithMoney(
              'workers',
              'workers',
              {
                estimatedRentMonthly: 1950,
                grossYield: 14.6,
                netCashFlowAnnual: 8_200,
                estimatedRoi: 16.4,
              },
              { lettingRooms: 5 },
            ),
          ],
        })}
      />,
    );

    expect(screen.getByText('Best return: Workers HMO')).toBeInTheDocument();
    expect(screen.getByText('14.6%')).toBeInTheDocument();
    expect(screen.getByText('£1,950')).toBeInTheDocument();
    expect(screen.getByText('£8,200')).toBeInTheDocument();
    expect(screen.getByText('16.4%')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });

  it('breaks a cash-flow tie with the higher ROI on older deals', () => {
    renderWithProviders(
      <DealKpiStrip
        hmoPlanner={buildHmoPlanner({
          schemes: [
            schemeWithMoney('students', 'students', {
              netCashFlowAnnual: 8_000,
              estimatedRoi: 12,
            }),
            schemeWithMoney(
              'workers',
              'workers',
              {
                estimatedRentMonthly: 2100,
                grossYield: 13.1,
                netCashFlowAnnual: 8_000,
                estimatedRoi: 16.5,
              },
              { lettingRooms: 6 },
            ),
          ],
        })}
      />,
    );

    expect(screen.getByText('Best return: Workers HMO')).toBeInTheDocument();
    expect(screen.getByText('16.5%')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('shows occupancy wording when the family let is the best return', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        bedrooms={3}
        hmoPlanner={buildHmoPlanner({
          asListedBedrooms: 3,
          headline: buildFamilyLetHeadline({
            estimatedRentMonthly: 850,
            grossYield: 6.4,
            netCashFlowAnnual: 3100,
            estimatedRoi: 7.2,
          }),
        })}
      />,
    );

    expect(
      screen.getByText('Best return: Family let (as listed)'),
    ).toBeInTheDocument();
    expect(screen.getByText('6.4%')).toBeInTheDocument();
    expect(screen.getByText('£850')).toBeInTheDocument();
    expect(screen.getByText('£3,100')).toBeInTheDocument();
    expect(screen.getByText('7.2%')).toBeInTheDocument();
    expect(screen.getByText('Occupancy')).toBeInTheDocument();
    expect(screen.getByText('3-bed AST')).toBeInTheDocument();
    expect(screen.getByText('family let')).toBeInTheDocument();
    expect(screen.queryByText('HMO rooms')).not.toBeInTheDocument();
  });

  it('derives a family-let win for older deals without a headline', () => {
    renderWithProviders(
      <DealKpiStrip
        bedrooms={3}
        hmoPlanner={buildHmoPlanner({
          asListedBedrooms: 3,
          schemes: [
            schemeWithMoney('workers', 'workers', {
              netCashFlowAnnual: 1_200,
              estimatedRoi: 4,
            }),
          ],
          moneyComparison: moneyComparison(
            buildHmoMoneySnapshot({
              label: 'Family let (as listed)',
              estimatedRentMonthly: 850,
              grossYield: 6.4,
              netCashFlowAnnual: 3_100,
              estimatedRoi: 7.2,
            }),
          ),
        })}
      />,
    );

    expect(
      screen.getByText('Best return: Family let (as listed)'),
    ).toBeInTheDocument();
    expect(screen.getByText('£850')).toBeInTheDocument();
    expect(screen.getByText('Occupancy')).toBeInTheDocument();
    expect(screen.queryByText('HMO rooms')).not.toBeInTheDocument();
  });

  it('omits the HMO tile for properties without a planner result', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    expect(screen.queryByText('HMO rooms')).not.toBeInTheDocument();
    expect(screen.queryByText(/Best return:/)).not.toBeInTheDocument();
  });

  it('shows family AST occupancy on a buy-to-let analysis', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        strategy="buy_to_let"
        bedrooms={3}
      />,
    );

    expect(screen.getByText('Occupancy')).toBeInTheDocument();
    expect(screen.getByText('3-bed AST')).toBeInTheDocument();
    expect(screen.getByText('family let')).toBeInTheDocument();
    expect(screen.getByText('8.6%')).toBeInTheDocument();
    expect(screen.getByText('£1,800')).toBeInTheDocument();
    expect(screen.queryByText('HMO rooms')).not.toBeInTheDocument();
    expect(screen.queryByText(/Best return:/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Occupancy/ })).toHaveAttribute(
      'href',
      '#financial-model',
    );
  });
});
