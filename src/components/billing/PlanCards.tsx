import { Button, Stack, Typography } from '@mui/material';
import { ErrorAlert } from '@/components/common/Feedback';
import type { PlanOption } from '@/lib/plans';
import type { CheckoutProduct } from '@/models';

interface PlanCardProps {
  plan: PlanOption;
  loadingProduct: CheckoutProduct | null;
  onSelect: (product: CheckoutProduct) => void;
}

export function PlanCard({ plan, loadingProduct, onSelect }: PlanCardProps) {
  const isLoading = loadingProduct === plan.product;

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: plan.highlight ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
      }}
    >
      <Typography variant="h6">{plan.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {plan.priceLabel}
      </Typography>
      <Typography fontWeight={600}>{plan.creditsLabel}</Typography>
      <Typography variant="body2" color="text.secondary" flex={1}>
        {plan.description}
      </Typography>
      <Button
        variant={plan.highlight ? 'contained' : 'outlined'}
        disabled={Boolean(loadingProduct)}
        onClick={() => onSelect(plan.product)}
      >
        {isLoading ? 'Redirecting…' : 'Choose'}
      </Button>
    </Stack>
  );
}

interface PlanCardsProps {
  plans: PlanOption[];
  loadingProduct: CheckoutProduct | null;
  error: unknown;
  onSelect: (product: CheckoutProduct) => void;
}

export function PlanCards({
  plans,
  loadingProduct,
  error,
  onSelect,
}: PlanCardsProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
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
