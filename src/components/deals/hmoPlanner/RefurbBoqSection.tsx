import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatCurrency } from '@/lib/format';
import type { HmoRefurbBoq, RefurbBoqLineItem } from '@/models';
import { Fact } from '@/components/deals/Fact';
import { NoteList } from './NoteList';
import { refurbCategoryLabel } from './labels';

interface RefurbBoqSectionProps {
  boq: HmoRefurbBoq;
}

function lineRange(item: RefurbBoqLineItem): string {
  const low = item.lowGbp * item.quantity;
  const high = item.highGbp * item.quantity;
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

export function RefurbBoqSection({ boq }: RefurbBoqSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="BoQ total"
          value={`${formatCurrency(boq.totalLowGbp)} – ${formatCurrency(boq.totalHighGbp)}`}
        />
        <Fact
          label="Subtotal"
          value={`${formatCurrency(boq.subtotalLowGbp)} – ${formatCurrency(boq.subtotalHighGbp)}`}
        />
        <Fact
          label="Contingency"
          value={`${Math.round(boq.contingencyPct * 100)}%`}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.dark">
          Line items
        </Typography>
        {boq.lineItems.map((item) => (
          <Box
            key={item.id}
            sx={{
              borderLeft: 3,
              borderColor:
                item.category === 'fire_compliance'
                  ? 'warning.main'
                  : item.category === 'contingency'
                    ? 'divider'
                    : 'primary.main',
              pl: 1.5,
              py: 0.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography fontWeight={600} color="primary.dark">
                {item.label}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={refurbCategoryLabel(item.category)}
              />
              {item.quantity > 1 ? (
                <Typography variant="body2" color="primary.main">
                  ×{item.quantity}
                  {item.unit ? ` ${item.unit}` : ''}
                </Typography>
              ) : null}
              <Typography variant="body2" color="primary.dark" fontWeight={600}>
                {lineRange(item)}
              </Typography>
            </Stack>
            {item.notes ? (
              <Typography variant="caption" color="text.secondary">
                {item.notes}
              </Typography>
            ) : null}
          </Box>
        ))}
      </Stack>

      <NoteList items={boq.notes} />
      <Typography variant="caption" color="text.secondary">
        {boq.disclaimer}
      </Typography>
    </Stack>
  );
}
