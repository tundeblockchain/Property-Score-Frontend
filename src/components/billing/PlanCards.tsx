import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePricing } from '@/hooks/usePricing';
import {
  isPaidPlanSwitch,
  isPaidSubscriptionProduct,
  isSubscriptionDowngrade,
  subscriptionProductForTier,
  type PlanSummary,
} from '@/lib/plans';
import {
  liveCopyForPlans,
  PRICE_UNAVAILABLE_LABEL,
  type LivePlanCopy,
} from '@/lib/pricing';
import type { CheckoutPlanCatalogItem, CheckoutProduct, UserTier } from '@/models';

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

export function CurrentPlanButton() {
  return (
    <Button variant="outlined" disabled>
      Current plan
    </Button>
  );
}

interface PlanCardShellProps extends PlanSummary {
  priceLabel?: ReactNode;
  valueLabel?: string;
  savePercent?: number;
  /** Call to action rendered at the bottom of the card. */
  action: ReactNode;
}

function PriceSlotSkeleton() {
  return (
    <Skeleton
      variant="text"
      width="7rem"
      role="status"
      aria-label="Loading price"
    />
  );
}

function liveFieldsForCard(
  pricing: ReturnType<typeof usePricing>,
  liveCopy: Map<CheckoutProduct, LivePlanCopy> | null,
  product: CheckoutProduct,
): {
  priceLabel: ReactNode;
  valueLabel?: string;
  savePercent?: number;
} {
  if (pricing.isPending) {
    return { priceLabel: <PriceSlotSkeleton /> };
  }

  const copy = liveCopy?.get(product);
  return {
    priceLabel: copy?.priceLabel ?? PRICE_UNAVAILABLE_LABEL,
    valueLabel: copy?.valueLabel ?? undefined,
    savePercent: copy?.savePercent ?? undefined,
  };
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
      {priceLabel != null && priceLabel !== '' ? (
        <Typography variant="body2" color="text.secondary">
          {priceLabel}
        </Typography>
      ) : null}
      <Typography fontWeight={600}>{creditsLabel}</Typography>
      {valueLabel ? (
        <Typography variant="body2" color="success.dark" fontWeight={600}>
          {valueLabel}
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
  currentTier?: UserTier;
  live: {
    priceLabel: ReactNode;
    valueLabel?: string;
    savePercent?: number;
  };
}

export function PlanCard({
  plan,
  loadingProduct,
  onSelect,
  currentTier,
  live,
}: PlanCardProps) {
  const isLoading = loadingProduct === plan.product;
  const isSubscription = isPaidSubscriptionProduct(plan.product);
  const currentProduct = currentTier
    ? subscriptionProductForTier(currentTier)
    : undefined;
  const isCurrent = isSubscription && currentProduct === plan.product;

  let action: ReactNode;
  if (isCurrent) {
    action = <CurrentPlanButton />;
  } else {
    action = (
      <Button
        variant={plan.highlight ? 'contained' : 'outlined'}
        disabled={Boolean(loadingProduct)}
        onClick={() => onSelect(plan.product)}
        aria-label={`Choose ${plan.title}`}
      >
        {isLoading ? 'Redirecting…' : 'Choose'}
      </Button>
    );
  }

  return (
    <PlanCardShell
      title={plan.title}
      priceLabel={live.priceLabel}
      creditsLabel={plan.creditsLabel}
      description={plan.description}
      comparison={plan.comparison}
      features={plan.features}
      valueLabel={live.valueLabel}
      savePercent={live.savePercent}
      highlight={plan.highlight}
      action={action}
    />
  );
}

interface PlanCardsProps {
  plans: CheckoutPlanCatalogItem[];
  loadingProduct: CheckoutProduct | null;
  error: unknown;
  onSelect: (product: CheckoutProduct) => void;
  currentTier?: UserTier;
  /** Extra card rendered before the paid plans, e.g. the free tier. */
  leadingCard?: ReactNode;
}

export function PlanCards({
  plans,
  loadingProduct,
  error,
  onSelect,
  currentTier,
  leadingCard,
}: PlanCardsProps) {
  const pricing = usePricing();
  const liveCopy =
    pricing.data != null ? liveCopyForPlans(pricing.data, plans) : null;
  const [pendingSwitch, setPendingSwitch] =
    useState<CheckoutPlanCatalogItem | null>(null);
  const isDowngrade =
    pendingSwitch != null &&
    currentTier != null &&
    isSubscriptionDowngrade(currentTier, pendingSwitch.product);

  function handleSelect(product: CheckoutProduct): void {
    const plan = plans.find((item) => item.product === product);
    if (currentTier && plan && isPaidPlanSwitch(currentTier, product)) {
      setPendingSwitch(plan);
      return;
    }
    onSelect(product);
  }

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
              onSelect={handleSelect}
              currentTier={currentTier}
              live={liveFieldsForCard(pricing, liveCopy, plan.product)}
            />
          </Stack>
        ))}
      </Stack>
      {error ? <ErrorAlert error={error} /> : null}
      <ConfirmDialog
        open={pendingSwitch != null}
        title={`Switch to ${pendingSwitch?.title ?? 'this plan'}?`}
        description={
          isDowngrade
            ? "You'll lose features that are only on your current plan. Analyses already on your account stay with you, and Stripe will adjust your billing for the rest of the month."
            : "You'll get the extra features on this plan. Analyses already on your account stay with you, and Stripe will adjust your billing for the rest of the month."
        }
        confirmLabel={`Switch to ${pendingSwitch?.title ?? 'this plan'}`}
        confirmColor="primary"
        pending={
          pendingSwitch != null && loadingProduct === pendingSwitch.product
        }
        pendingLabel="Redirecting…"
        onClose={() => setPendingSwitch(null)}
        onConfirm={() => {
          if (pendingSwitch) {
            onSelect(pendingSwitch.product);
          }
        }}
      />
    </Stack>
  );
}
