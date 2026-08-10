import { Stack, Typography } from '@mui/material';
import type { FloorPlanAnalysis, HmoPlannerResult } from '@/models';
import { Fact } from '@/components/deals/common/Fact';
import { MoneyComparisonSection } from './MoneyComparisonSection';
import { sourceLabel } from './labels';

interface HmoOverviewSectionProps {
  planner: HmoPlannerResult;
}

function VisionSummary({ analysis }: { analysis: FloorPlanAnalysis }) {
  const extensions = [
    analysis.extensionPotential.loft ? 'loft' : null,
    analysis.extensionPotential.rear ? 'rear' : null,
    analysis.extensionPotential.garage ? 'garage' : null,
  ].filter((item): item is string => item != null);

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Floor-plan vision</Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Detected beds / baths"
          value={`${analysis.currentBedrooms} / ${analysis.currentBathrooms}`}
        />
        <Fact
          label="Extra bedroom potential"
          value={String(analysis.potentialExtraBedrooms)}
        />
        {analysis.layoutEfficiencyScore != null ? (
          <Fact
            label="Layout efficiency"
            value={`${analysis.layoutEfficiencyScore}/10`}
          />
        ) : null}
        {extensions.length > 0 ? (
          <Fact label="Extension angles" value={extensions.join(', ')} />
        ) : null}
      </Stack>
      {analysis.convertibleRooms.length > 0 ? (
        <Typography variant="body2">
          Convertible: {analysis.convertibleRooms.join(', ')}
        </Typography>
      ) : null}
      {analysis.fireEscapeNotes ? (
        <Typography variant="body2" color="text.secondary">
          Fire / escape: {analysis.fireEscapeNotes}
        </Typography>
      ) : null}
    </Stack>
  );
}

export function HmoOverviewSection({ planner }: HmoOverviewSectionProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="As listed"
          value={`${planner.asListedBedrooms} beds / ${planner.asListedBathrooms} baths`}
        />
        <Fact
          label="Floor plans on listing"
          value={String(planner.floorPlanCount)}
        />
        <Fact label="Layout source" value={sourceLabel(planner.source)} />
      </Stack>

      {planner.moneyComparison ? (
        <MoneyComparisonSection comparison={planner.moneyComparison} />
      ) : null}

      {planner.floorPlanAnalysis ? (
        <VisionSummary analysis={planner.floorPlanAnalysis} />
      ) : null}

      <Typography variant="caption" color="text.secondary">
        {planner.disclaimer}
      </Typography>
    </Stack>
  );
}
