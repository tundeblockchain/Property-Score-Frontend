import { Box, Chip, Stack, Typography } from '@mui/material';
import { resolveAnalysisStrategy } from '@/lib/analysisStrategy';
import { formatCurrency, formatPercent } from '@/lib/format';
import { resolveHmoHeadline } from '@/lib/hmoHeadline';
import type {
  AnalysisStrategy,
  FinancialModel,
  HmoHeadlineReturns,
  HmoPlannerResult,
  HmoSchemeHeadlineReturns,
} from '@/models';

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

function occupancyKpi(bedrooms: number, targetId: string): Kpi {
  return {
    label: 'Occupancy',
    value: `${bedrooms}-bed AST`,
    hint: 'family let',
    targetId,
  };
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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function schemeRefurbNote(headline: HmoSchemeHeadlineReturns): string {
  const { refurbEstimateLowGbp, refurbEstimateHighGbp } = headline;
  if (
    isFiniteNumber(refurbEstimateLowGbp) &&
    isFiniteNumber(refurbEstimateHighGbp)
  ) {
    return `Refurb est. ${formatCurrency(refurbEstimateLowGbp)}–${formatCurrency(refurbEstimateHighGbp)}`;
  }
  return 'before conversion costs';
}

function buildKpis({
  financialModel,
  hmoPlanner,
  strategy,
  bedrooms,
  headline,
}: DealKpiStripProps & { headline?: HmoHeadlineReturns }): Kpi[] {
  const money = headline ?? financialModel;
  const netCashFlow = money?.netCashFlowAnnual;

  const kpis: Kpi[] = [
    {
      label: 'Gross yield',
      value: formatPercent(money?.grossYield),
      targetId: 'financial-model',
    },
    {
      label: 'Est. monthly rent',
      value: formatCurrency(money?.estimatedRentMonthly),
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
      value: formatPercent(money?.estimatedRoi),
      targetId: 'financial-model',
    },
  ];

  if (headline?.basis === 'family_let') {
    const occupancyBeds = hmoPlanner?.asListedBedrooms ?? bedrooms;
    if (occupancyBeds != null) {
      kpis.push(occupancyKpi(occupancyBeds, 'hmo-overview'));
    }
  } else if (headline?.basis === 'scheme') {
    kpis.push({
      label: 'HMO rooms',
      value: String(headline.lettingRooms),
      hint: 'best return',
      targetId: 'hmo-overview',
    });
  } else if (hmoPlanner) {
    const lettingRooms = recommendedLettingRooms(hmoPlanner);
    if (lettingRooms != null) {
      kpis.push({
        label: 'HMO rooms',
        value: String(lettingRooms),
        hint: 'best fit',
        targetId: 'hmo-overview',
      });
    }
  } else if (
    resolveAnalysisStrategy(strategy) === 'buy_to_let' &&
    bedrooms != null
  ) {
    kpis.push(occupancyKpi(bedrooms, 'financial-model'));
  }

  return kpis;
}

export function DealKpiStrip({
  financialModel,
  hmoPlanner,
  strategy,
  bedrooms,
}: DealKpiStripProps) {
  const headline = resolveHmoHeadline(hmoPlanner);
  const kpis = buildKpis({
    financialModel,
    hmoPlanner,
    strategy,
    bedrooms,
    headline,
  });
  const refurbNote =
    headline?.basis === 'scheme' ? schemeRefurbNote(headline) : undefined;

  return (
    <Stack spacing={1.5}>
      {headline ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          flexWrap="wrap"
          useFlexGap
          sx={{ alignSelf: 'flex-start' }}
        >
          <Chip
            size="small"
            color="success"
            variant="outlined"
            label={`Best return: ${headline.label}`}
            title="Highest annual cash flow"
            sx={{ alignSelf: 'flex-start' }}
          />
          {refurbNote ? (
            <Typography variant="caption" color="text.secondary">
              {refurbNote}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
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
    </Stack>
  );
}
