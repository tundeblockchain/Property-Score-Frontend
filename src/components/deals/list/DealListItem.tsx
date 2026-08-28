import { Box, CardActionArea, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AnalysisStrategyChip } from '@/components/deals/common/AnalysisStrategyChip';
import { DealStatusChip } from '@/components/deals/common/DealStatusChip';
import { OverallScoreBadge } from '@/components/deals/common/OverallScoreBadge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { DealSummary } from '@/models';

interface DealListItemProps {
  deal: DealSummary;
}

export function DealListItem({ deal }: DealListItemProps) {
  const address =
    deal.listing?.address ?? deal.listing?.postcode ?? 'Property listing';
  const price = deal.listing?.price;

  return (
    <CardActionArea
      component={RouterLink}
      to={`/deals/${deal.dealId}`}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {deal.scores ? (
          <OverallScoreBadge score={deal.scores.overall} size="sm" />
        ) : (
          <Box
            aria-hidden
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              flexShrink: 0,
            }}
          />
        )}
        <Stack spacing={0.5} flex={1} minWidth={0}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" noWrap fontWeight={600}>
              {address}
            </Typography>
            <DealStatusChip status={deal.status} />
            <AnalysisStrategyChip strategy={deal.strategy} />
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatCurrency(price)} · {formatDate(deal.createdAt)}
          </Typography>
        </Stack>
      </Stack>
    </CardActionArea>
  );
}
