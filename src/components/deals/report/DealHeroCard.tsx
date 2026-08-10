import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { ListingSummary } from '@/components/deals/common/ListingSummary';
import { OverallScoreBadge } from '@/components/deals/common/OverallScoreBadge';
import { DealKpiStrip } from '@/components/deals/report/DealKpiStrip';
import type {
  FinancialModel,
  HmoPlannerResult,
  PropertyListingSummary,
  ScoreBreakdown,
} from '@/models';

interface DealHeroCardProps {
  listing?: PropertyListingSummary;
  listingUrl?: string;
  scores?: ScoreBreakdown;
  financialModel?: FinancialModel;
  hmoPlanner?: HmoPlannerResult;
}

export function DealHeroCard({
  listing,
  listingUrl,
  scores,
  financialModel,
  hmoPlanner,
}: DealHeroCardProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            {listing ? (
              <ListingSummary
                listing={listing}
                listingUrl={listingUrl}
                showAddress={false}
              />
            ) : (
              <Typography color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {listingUrl}
              </Typography>
            )}
          </Box>
          {scores ? (
            <OverallScoreBadge score={scores.overall} size="lg" showBand />
          ) : null}
        </Stack>

        <Divider />

        <DealKpiStrip
          financialModel={financialModel}
          hmoPlanner={hmoPlanner}
        />
      </Stack>
    </Paper>
  );
}
