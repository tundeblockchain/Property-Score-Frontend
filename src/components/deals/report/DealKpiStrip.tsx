import { Box, Typography } from '@mui/material';
import { formatCurrency, formatPercent } from '@/lib/format';
import { resolveAnalysisStrategy } from '@/lib/analysisStrategy';
import type { AnalysisStrategy, FinancialModel, HmoPlannerResult } from '@/models';

interface Kpi {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  /** Anchor id of the section this number is explained in. */
  readonly targetId: string;
  readonly negative?: boolean;
}

interface DealKpiStripProps {
  financialModel?: FinancialModel;
  hmoPlanner?: HmoPlannerResult;
  strategy?: AnalysisStrategy;
  bedrooms?: number;
}

function recommendedLettingRooms(
  planner: HmoPlannerResult | undefined,
): number | undefined {
  if (!planner) {
    return undefined;
  }
  const recommended =
    planner.schemes.find((scheme) => scheme.id === planner.recommendedSchemeId) ??
    planner.schemes.find((scheme) => scheme.recommended);
  return recommended?.lettingRooms;
}

function buildKpis({
  financialModel,
  hmoPlanner,
  strategy,
  bedrooms,
}: DealKpiStripProps): Kpi[] {
  const netCashFlow = financialModel?.netCashFlowAnnual;
  const lettingRooms = recommendedLettingRooms(hmoPlanner);

  const kpis: Kpi[] = [
    {
      label: 'Gross yield',
      value: formatPercent(financialModel?.grossYield),
      targetId: 'financial-model',
    },
    {
      label: 'Est. monthly rent',
      value: formatCurrency(financialModel?.estimatedRentMonthly),
      targetId: 'financial-model',
    },
    {
      label: 'Net cash flow',
      value: formatCurrency(netCashFlow),
      hint: 'per year',
      targetId: 'financial-model',
      negative: netCashFlow != null && netCashFlow < 0,
    },
    {
      label: 'Est. ROI',
      value: formatPercent(financialModel?.estimatedRoi),
      targetId: 'financial-model',
    },
  ];

  if (resolveAnalysisStrategy(strategy) === 'buy_to_let' && bedrooms != null) {
    kpis.push({
      label: 'Occupancy',
      value: `${bedrooms}-bed AST`,
      hint: 'family let',
      targetId: 'financial-model',
    });
  } else if (lettingRooms != null) {
    kpis.push({
      label: 'HMO rooms',
      value: String(lettingRooms),
      hint: 'recommended scheme',
      targetId: 'hmo-overview',
    });
  }

  return kpis;
}

export function DealKpiStrip({
  financialModel,
  hmoPlanner,
  strategy,
  bedrooms,
}: DealKpiStripProps) {
  const kpis = buildKpis({ financialModel, hmoPlanner, strategy, bedrooms });

  return (
    <Box
      component="ul"
      aria-label="Key figures"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          md: `repeat(${kpis.length}, minmax(0, 1fr))`,
        },
      }}
    >
      {kpis.map((kpi) => (
        <Box component="li" key={kpi.label} sx={{ minWidth: 0 }}>
          <Box
            component="a"
            href={`#${kpi.targetId}`}
            sx={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: 1,
              '&:hover .DealKpi-value': {
                textDecoration: 'underline',
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            <Typography variant="body2" color="text.secondary" noWrap>
              {kpi.label}
            </Typography>
            <Typography
              className="DealKpi-value"
              variant="h6"
              component="p"
              fontWeight={700}
              color={kpi.negative ? 'error.dark' : 'text.primary'}
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {kpi.value}
            </Typography>
            {kpi.hint ? (
              <Typography variant="caption" color="text.secondary">
                {kpi.hint}
              </Typography>
            ) : null}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
