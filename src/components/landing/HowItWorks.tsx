import { Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SectionHeading } from '@/components/landing/SectionHeading';

const STEPS = [
  {
    title: 'Paste the listing',
    description:
      'Copy any rightmove.co.uk/properties link into the box above and start the analysis.',
  },
  {
    title: 'We gather the evidence',
    description:
      'EPC records, planning history, sold comparables, crime, schools, transport, broadband and the listing floor plans are pulled in automatically.',
  },
  {
    title: 'Read the score',
    description:
      'An overall score plus financial, compliance, market demand, location and refurb breakdowns — usually within 15–40 seconds.',
  },
];

export function HowItWorks() {
  return (
    <Stack spacing={3}>
      <SectionHeading
        eyebrow="How it works"
        title="From listing link to investment view"
        subtitle="One listing, one report. No spreadsheets to maintain."
      />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
        {STEPS.map((step, index) => (
          <Stack
            key={step.title}
            spacing={1.25}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.dark',
                fontWeight: 700,
              }}
              aria-hidden
            >
              {index + 1}
            </Stack>
            <Typography variant="h6" component="h3">
              {step.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step.description}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
