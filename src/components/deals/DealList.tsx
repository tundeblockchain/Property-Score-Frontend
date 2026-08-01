import { Stack } from '@mui/material';
import { DealListItem } from '@/components/deals/DealListItem';
import { EmptyState } from '@/components/common/Feedback';
import type { DealSummary } from '@/models';

interface DealListProps {
  deals: DealSummary[];
}

export function DealList({ deals }: DealListProps) {
  if (deals.length === 0) {
    return (
      <EmptyState
        title="No deals yet"
        description="Analyse a Rightmove listing to see it here."
      />
    );
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
