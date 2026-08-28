import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AnalysisStrategyChip } from '@/components/deals/common/AnalysisStrategyChip';
import { DealStatusChip } from '@/components/deals/common/DealStatusChip';
import { analysisStrategyLabel } from '@/lib/analysisStrategy';
import { formatDate } from '@/lib/format';
import type { AnalysisStrategy, DealStatus } from '@/models';

interface DealReportHeaderProps {
  address: string;
  status: DealStatus;
  strategy?: AnalysisStrategy;
  updatedAt?: string;
  action?: ReactNode;
}

export function DealReportHeader({
  address,
  status,
  strategy,
  updatedAt,
  action,
}: DealReportHeaderProps) {
  return (
    <Stack spacing={2}>
      <Link
        component={RouterLink}
        to="/deals"
        underline="hover"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          alignSelf: 'flex-start',
          fontWeight: 600,
        }}
      >
        <ArrowBackIcon fontSize="small" aria-hidden />
        All properties
      </Link>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            lineHeight={1.4}
          >
            {analysisStrategyLabel(strategy)} report
          </Typography>
          <Typography variant="h4" component="h1">
            {address}
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <DealStatusChip status={status} />
            <AnalysisStrategyChip strategy={strategy} />
            <Typography variant="body2" color="text.secondary">
              Updated {formatDate(updatedAt)}
            </Typography>
          </Stack>
        </Stack>

        {action ? (
          <Stack spacing={1} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
            {action}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
