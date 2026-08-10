import { Box, Chip, Stack, Typography } from '@mui/material';
import type { GeometryConversionPlan } from '@/models';
import { NoteList } from './NoteList';
import { conversionActionLabel } from './labels';

interface ConversionPlanSectionProps {
  plan: GeometryConversionPlan;
}

export function ConversionPlanSection({ plan }: ConversionPlanSectionProps) {
  const activeSteps = plan.steps.filter(
    (step) =>
      step.action === 'convert_to_bedroom' ||
      step.action === 'add_ensuite' ||
      step.action === 'staff_room' ||
      step.action === 'keep_communal',
  );

  return (
    <Stack spacing={1.5}>
      <Chip
        size="small"
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
        label={`As built ${plan.asBuiltBedrooms} → ${plan.proposedLettingRooms} letting rooms`}
      />

      <Stack spacing={1}>
        {activeSteps.map((step) => (
          <Box
            key={`${step.sourceLabel}-${step.action}`}
            sx={{
              borderLeft: 3,
              borderColor:
                step.action === 'convert_to_bedroom' ||
                step.action === 'add_ensuite'
                  ? 'secondary.main'
                  : 'divider',
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
              <Typography fontWeight={600}>{step.sourceLabel}</Typography>
              <Chip size="small" label={conversionActionLabel(step.action)} />
              {step.estimatedAreaSqM != null ? (
                <Typography variant="body2" color="text.secondary">
                  ~{step.estimatedAreaSqM} m²
                </Typography>
              ) : null}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {step.rationale}
              {step.estimatedCostGbpHigh > 0
                ? ` · est. £${step.estimatedCostGbpLow.toLocaleString()}–£${step.estimatedCostGbpHigh.toLocaleString()}`
                : ''}
            </Typography>
          </Box>
        ))}
      </Stack>

      {plan.blocked.length > 0 ? (
        <NoteList title="Blocked conversions" items={plan.blocked} />
      ) : null}
    </Stack>
  );
}
