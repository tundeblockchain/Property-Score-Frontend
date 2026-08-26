import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { useBillingPlans } from '@/hooks/useBillingPlans';

export function PlansTeaser() {
  const plans = useBillingPlans();
  const catalog = plans.data;
  const teaserRows = catalog
    ? [
        {
          title: catalog.freePlan.title,
          creditsLabel: catalog.freePlan.creditsLabel,
        },
        ...catalog.subscriptionPlans.map((plan) => ({
          title: plan.title,
          creditsLabel: plan.creditsLabel,
        })),
        ...catalog.creditPacks.slice(0, 2).map((plan) => ({
          title: plan.title,
          creditsLabel: plan.creditsLabel,
        })),
      ]
    : [];

  return (
    <Stack spacing={3}>
      <SectionHeading
        eyebrow="Pricing"
        title="Start free, scale when you are screening more"
        subtitle="One analysis per listing. Proposed layouts use three from the same balance."
      />
      <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2.5}>
          {teaserRows.length > 0 ? (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={0}
              divider={
                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                />
              }
            >
              {teaserRows.map((row) => (
                <Stack
                  key={row.title}
                  spacing={0.5}
                  flex={1}
                  sx={{ py: { xs: 1, sm: 0 }, px: { sm: 2 } }}
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    {row.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.creditsLabel}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button
              component={RouterLink}
              to="/pricing"
              variant="contained"
              size="large"
            >
              Compare plans
            </Button>
            <Button component="a" href="#try" size="large">
              Analyse a listing first
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
