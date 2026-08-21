import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';
import { perCreditValueLabel, type PlanSummary } from '@/lib/plans';
import type { CheckoutPlanCatalogItem, CheckoutProduct } from '@/models';

interface PlanFeatureListProps {
  title: string;
  items: string[];
  variant: 'included' | 'missing';
}

function PlanFeatureList({ title, items, variant }: PlanFeatureListProps) {
  if (items.length === 0) {
    return null;
  }

  const Icon = variant === 'included' ? CheckOutlinedIcon : CloseOutlinedIcon;
  const iconColor = variant === 'included' ? 'success.main' : 'text.disabled';
  const textColor = variant === 'included' ? 'text.primary' : 'text.secondary';

  return (
    <Stack spacing={0.75}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none' }}>
        {items.map((item) => (
          <Box
            key={item}
            component="li"
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}
          >
            <Icon sx={{ fontSize: 18, color: iconColor, mt: 0.15, flexShrink: 0 }} />
            <Typography variant="body2" color={textColor}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

interface PlanCardShellProps extends PlanSummary {
  /** Call to action rendered at the bottom of the card. */
  action: ReactNode;
}

export function PlanCardShell({
  title,
  priceLabel,
  creditsLabel,
  description,
  comparison,
  features,
  valueLabel,
  savePercent,
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
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="h6">{title}</Typography>
        {savePercent != null && savePercent > 0 ? (
          <Chip
            label={`Save ${savePercent}%`}
            color="success"
            size="small"
            variant="outlined"
          />
        ) : null}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {priceLabel}
      </Typography>
      <Typography fontWeight={600}>{creditsLabel}</Typography>
      {valueLabel ? (
        <Typography variant="body2" color="success.dark" fontWeight={600}>
          {perCreditValueLabel(valueLabel)}
        </Typography>
      ) : null}
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Stack spacing={1.5} flex={1}>
        {comparison ? (
          <>
            <PlanFeatureList
              title="Included"
              items={comparison.included}
              variant="included"
            />
            <PlanFeatureList
              title="Not included"
              items={comparison.missing}
              variant="missing"
            />
          </>
        ) : null}
        {features ? (
          <PlanFeatureList title="Includes" items={features} variant="included" />
        ) : null}
      </Stack>
      {action}
    </Stack>
  );
}

interface PlanCardProps {
  plan: CheckoutPlanCatalogItem;
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
      comparison={plan.comparison}
      features={plan.features}
      valueLabel={plan.valueLabel}
      savePercent={plan.savePercent}
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
  plans: CheckoutPlanCatalogItem[];
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
