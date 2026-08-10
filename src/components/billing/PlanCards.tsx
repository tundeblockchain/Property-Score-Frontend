import { Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';
import type { PlanOption } from '@/lib/plans';
import type { CheckoutProduct } from '@/models';

interface PlanCardShellProps {
  title: string;
  priceLabel: string;
  creditsLabel: string;
  description: string;
  highlight?: boolean;
  /** Call to action rendered at the bottom of the card. */
  action: ReactNode;
}

export function PlanCardShell({
  title,
  priceLabel,
  creditsLabel,
  description,
  highlight = false,
  action,
}: PlanCardShellProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: highlight ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {priceLabel}
      </Typography>
      <Typography fontWeight={600}>{creditsLabel}</Typography>
      <Typography variant="body2" color="text.secondary" flex={1}>
        {description}
      </Typography>
      {action}
    </Stack>
  );
}

interface PlanCardProps {
  plan: PlanOption;
  loadingProduct: CheckoutProduct | null;
  onSelect: (product: CheckoutProduct) => void;
}

export function PlanCard({ plan, loadingProduct, onSelect }: PlanCardProps) {
  const isLoading = loadingProduct === plan.product;

  return (
    <PlanCardShell
      title={plan.title}
      priceLabel={plan.priceLabel}
      creditsLabel={plan.creditsLabel}
      description={plan.description}
      highlight={plan.highlight}
      action={
        <Button
          variant={plan.highlight ? 'contained' : 'outlined'}
          disabled={Boolean(loadingProduct)}
          onClick={() => onSelect(plan.product)}
        >
          {isLoading ? 'Redirecting…' : 'Choose'}
        </Button>
      }
    />
  );
}

interface PlanCardsProps {
  plans: PlanOption[];
  loadingProduct: CheckoutProduct | null;
  error: unknown;
  onSelect: (product: CheckoutProduct) => void;
  /** Extra card rendered before the paid plans, e.g. the free tier. */
  leadingCard?: ReactNode;
}

export function PlanCards({
  plans,
  loadingProduct,
  error,
  onSelect,
  leadingCard,
}: PlanCardsProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
        {leadingCard ? <Stack flex={1}>{leadingCard}</Stack> : null}
        {plans.map((plan) => (
          <Stack key={plan.product} flex={1}>
            <PlanCard
              plan={plan}
              loadingProduct={loadingProduct}
              onSelect={onSelect}
            />
          </Stack>
        ))}
      </Stack>
      {error ? <ErrorAlert error={error} /> : null}
    </Stack>
  );
}
