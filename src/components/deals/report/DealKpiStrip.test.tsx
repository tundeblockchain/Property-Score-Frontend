import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealKpiStrip } from '@/components/deals/report/DealKpiStrip';
import {
  buildFamilyLetHeadline,
  buildFinancialModel,
  buildHmoHeadline,
  buildHmoMoneyComparison,
  buildHmoMoneySnapshot,
  buildHmoPlanner,
  buildHmoScheme,
  buildSchemeWithMoney,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

function roomsTile() {
  return screen.getByRole('link', { name: /HMO rooms/ });
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
            refurbEstimateLowGbp: 30_000,
            refurbEstimateHighGbp: 45_000,
          }),
          schemes: [
            buildSchemeWithMoney(
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
    expect(screen.getByText('Refurb est. £30,000–£45,000')).toBeInTheDocument();
    expect(screen.getByText('11.2%')).toBeInTheDocument();
    expect(screen.getByText('£2,400')).toBeInTheDocument();
    expect(screen.getByText('£9,800')).toBeInTheDocument();
    expect(screen.getByText('14.1%')).toBeInTheDocument();
    expect(within(roomsTile()).getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('8.6%')).not.toBeInTheDocument();
    expect(roomsTile()).toHaveAttribute('href', '#hmo-overview');
  });

  it('says before conversion costs when a scheme headline has no refurb range', () => {
    renderWithProviders(
      <DealKpiStrip
        hmoPlanner={buildHmoPlanner({
          headline: buildHmoHeadline({
            lettingRooms: 5,
            refurbEstimateLowGbp: undefined,
            refurbEstimateHighGbp: undefined,
          }),
        })}
      />,
    );

    expect(screen.getByText('Best return: Workers HMO')).toBeInTheDocument();
    expect(screen.getByText('before conversion costs')).toBeInTheDocument();
    expect(screen.queryByText(/Refurb est\./)).not.toBeInTheDocument();
  });

  it('derives the cash-flow winner for older deals without a headline', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        hmoPlanner={buildHmoPlanner({
          schemes: [
            buildSchemeWithMoney(
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
            buildSchemeWithMoney(
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
    expect(within(roomsTile()).getByText('5')).toBeInTheDocument();
    expect(within(roomsTile()).queryByText('4')).not.toBeInTheDocument();
  });

  it('breaks a cash-flow tie with the higher ROI on older deals', () => {
    renderWithProviders(
      <DealKpiStrip
        hmoPlanner={buildHmoPlanner({
          schemes: [
            buildSchemeWithMoney('students', 'students', {
              netCashFlowAnnual: 8_000,
              estimatedRoi: 12,
            }),
            buildSchemeWithMoney(
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
    expect(within(roomsTile()).getByText('6')).toBeInTheDocument();
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
    expect(screen.queryByText(/Refurb est\./)).not.toBeInTheDocument();
    expect(screen.queryByText('before conversion costs')).not.toBeInTheDocument();
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
            buildSchemeWithMoney('workers', 'workers', {
              netCashFlowAnnual: 1_200,
              estimatedRoi: 4,
            }),
          ],
          moneyComparison: buildHmoMoneyComparison({
            asListedFamily: buildHmoMoneySnapshot({
              estimatedRentMonthly: 850,
              grossYield: 6.4,
              netCashFlowAnnual: 3_100,
              estimatedRoi: 7.2,
            }),
          }),
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

  it('keeps the recommended scheme rooms when no headline can be derived', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        hmoPlanner={buildHmoPlanner({
          recommendedSchemeId: 'missing',
          schemes: [
            buildHmoScheme({
              id: 'workers',
              lettingRooms: 6,
              recommended: false,
              financials: {
                voidRateAssumed: 0.08,
                roomRentWeeklyAssumed: 110,
                occupiedRoomsAssumed: 6,
              },
            }),
            buildHmoScheme({
              id: 'students',
              lettingRooms: 7,
              recommended: true,
              financials: {
                voidRateAssumed: 0.08,
                roomRentWeeklyAssumed: 110,
                occupiedRoomsAssumed: 7,
              },
            }),
          ],
        })}
      />,
    );

    expect(screen.queryByText(/Best return:/)).not.toBeInTheDocument();
    expect(within(roomsTile()).getByText('7')).toBeInTheDocument();
    expect(within(roomsTile()).getByText('best fit')).toBeInTheDocument();
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
