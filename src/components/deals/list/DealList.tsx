import { Stack } from '@mui/material';
import { DealListItem } from '@/components/deals/list/DealListItem';
import type { DealSummary } from '@/models';

interface DealListProps {
  deals: DealSummary[];
}

export function DealList({ deals }: DealListProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {deals.map((deal) => (
        <li key={deal.dealId}>
          <DealListItem deal={deal} />
        </li>
      ))}
    </Stack>
  );
}
