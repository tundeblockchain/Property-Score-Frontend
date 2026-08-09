import { Chip, Stack, Typography } from '@mui/material';
import type { HmoFireEscapeAssessment } from '@/models';
import { Fact } from './Fact';
import { NoteList } from './NoteList';
import { fireCheckChipColor, fireCheckStatusLabel, fireRiskLabel } from './labels';

interface FireEscapeSectionProps {
  fireEscape: HmoFireEscapeAssessment;
}

function storeySourceLabel(source: HmoFireEscapeAssessment['storeySource']): string {
  switch (source) {
    case 'floor_plan_rooms':
      return 'Floor-plan rooms';
    case 'listing_heuristic':
      return 'Listing heuristic';
    case 'loft_adjusted':
      return 'Loft-adjusted';
  }
}

export function FireEscapeSection({ fireEscape }: FireEscapeSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip
          label={`${fireRiskLabel(fireEscape.riskBand)} risk`}
          size="small"
          color={
            fireEscape.riskBand === 'higher'
              ? 'error'
              : fireEscape.riskBand === 'medium'
                ? 'warning'
                : 'success'
          }
        />
        <Chip
          label={`${fireEscape.confidence} confidence`}
          size="small"
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Est. storeys"
          value={String(fireEscape.estimatedStoreys)}
        />
        <Fact
          label="Storey source"
          value={storeySourceLabel(fireEscape.storeySource)}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.dark">
          Checklist
        </Typography>
        {fireEscape.items.map((item) => (
          <Stack key={item.id} spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography fontWeight={600} color="primary.dark">
                {item.title}
              </Typography>
              <Chip
                size="small"
                color={fireCheckChipColor(item.status)}
                label={fireCheckStatusLabel(item.status)}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {item.detail}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {fireEscape.visionNotes ? (
        <Typography variant="body2" color="primary.dark">
          Vision note: {fireEscape.visionNotes}
        </Typography>
      ) : null}

      <NoteList title="Fire / escape actions" items={fireEscape.actionItems} />
      <Typography variant="caption" color="text.secondary">
        {fireEscape.disclaimer}
      </Typography>
    </Stack>
  );
}
