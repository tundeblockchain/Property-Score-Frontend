import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SectionHeading } from '@/components/landing/SectionHeading';
import {
  CREDIT_PACK_PLANS,
  FREE_PLAN_SUMMARY,
  SUBSCRIPTION_PLANS,
} from '@/lib/plans';

const TEASER_ROWS = [
  { title: FREE_PLAN_SUMMARY.title, creditsLabel: FREE_PLAN_SUMMARY.creditsLabel },
  ...SUBSCRIPTION_PLANS.map((plan) => ({
    title: plan.title,
    creditsLabel: plan.creditsLabel,
  })),
  ...CREDIT_PACK_PLANS.slice(0, 2).map((plan) => ({
    title: plan.title,
    creditsLabel: plan.creditsLabel,
  })),
];

export function PlansTeaser() {
  return (
    <Stack spacing={3}>
      <SectionHeading
        eyebrow="Pricing"
        title="Start free, scale when you are screening more"
        subtitle="One credit per analysis. Proposed layouts use three credits from the same balance."
      />
      <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2.5}>
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
            {TEASER_ROWS.map((row) => (
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
