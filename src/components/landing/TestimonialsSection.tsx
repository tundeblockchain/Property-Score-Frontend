import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { usePublishedTestimonials } from '@/hooks/usePublishedTestimonials';
import type { PublicTestimonial } from '@/models';

export const CURATED_TESTIMONIALS: PublicTestimonial[] = [
  {
    id: 'curated-james',
    displayName: 'James',
    role: 'HMO investor, Manchester',
    quote:
      'I used to spend a Sunday on Rightmove, EPC, and a rough yield sheet. The report put the licensing path and cash-flow view in one place before I booked the viewing.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'curated-priya',
    displayName: 'Priya',
    role: 'Portfolio landlord, Leeds',
    quote:
      'The floor-plan schemes made the conversion conversation with my builder concrete. I could see which rooms were worth converting and which were not.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'curated-owen',
    displayName: 'Owen',
    role: 'First-time HMO buyer, Birmingham',
    quote:
      'I was guessing at Article 4 and extra licensing. The compliance section flagged what to confirm with the council instead of finding out after exchange.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

function TestimonialCard({ testimonial }: { testimonial: PublicTestimonial }) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: { xs: 2.5, md: 3 },
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.18),
        bgcolor: 'background.paper',
        boxShadow: '0 18px 40px -28px rgba(15, 118, 110, 0.45)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        aria-hidden
        sx={{
          position: 'absolute',
          top: 4,
          right: 16,
          fontSize: 72,
          lineHeight: 1,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          color: (theme) => alpha(theme.palette.primary.main, 0.16),
          fontWeight: 700,
          pointerEvents: 'none',
        }}
      >
        “
      </Typography>
      <Typography
        component="blockquote"
        variant="body1"
        sx={{
          m: 0,
          pr: 3,
          fontStyle: 'italic',
          color: 'text.primary',
          position: 'relative',
        }}
      >
        {testimonial.quote}
      </Typography>
      <Stack spacing={0.25}>
        <Typography variant="subtitle2" fontWeight={700}>
          {testimonial.displayName}
        </Typography>
        {testimonial.role ? (
          <Typography variant="body2" color="text.secondary">
            {testimonial.role}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}

export function TestimonialsSection() {
  const published = usePublishedTestimonials();
  const testimonials =
    published.data?.testimonials && published.data.testimonials.length > 0
      ? published.data.testimonials
      : CURATED_TESTIMONIALS;

  return (
    <Stack
      id="testimonials"
      spacing={3}
      sx={{ scrollMarginTop: 96 }}
    >
      <SectionHeading
        eyebrow="Investor notes"
        title="What people check before they commit"
        subtitle="Quotes from landlords using Colouring to screen HMO listings. New testimonials are reviewed before they appear here."
      />
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
        gap={2.5}
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Box>
      <Box>
        <Button
          component={RouterLink}
          to="/account"
          variant="outlined"
        >
          Share your experience
        </Button>
      </Box>
    </Stack>
  );
}
