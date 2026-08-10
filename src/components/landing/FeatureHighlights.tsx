import { Box, Stack, Typography } from '@mui/material';
import { SectionHeading } from '@/components/landing/SectionHeading';

const FEATURES = [
  {
    title: 'Financial model',
    description:
      'Estimated rent, gross yield, annual net cash flow and return on investment against the asking price.',
  },
  {
    title: 'Compliance & licensing',
    description:
      'HMO licensing paths, local authority scheme checks and a fire escape assessment.',
  },
  {
    title: 'Floor plan intelligence',
    description:
      'Room detection, space standards and extension potential read from the listing floor plans.',
  },
  {
    title: 'Area enrichment',
    description:
      'EPC, planning applications, sold prices, crime, schools, transport and broadband for the postcode.',
  },
  {
    title: 'HMO planner',
    description:
      'Conversion schemes with room mixes, refurb bill of quantities and money comparisons.',
  },
  {
    title: 'Shareable report',
    description:
      'Export the full report as a PDF for partners, brokers or lenders.',
  },
];

export function FeatureHighlights() {
  return (
    <Stack spacing={3}>
      <SectionHeading
        eyebrow="What is inside"
        title="Everything you would check manually, in one report"
        subtitle="Each analysis is stored under your properties so you can compare deals later."
      />
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={2.5}
      >
        {FEATURES.map((feature) => (
          <Stack
            key={feature.title}
            spacing={1}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" component="h3" fontWeight={700}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}
