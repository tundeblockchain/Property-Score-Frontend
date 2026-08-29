import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronDownIcon } from '@/components/common/icons';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { LANDING_FAQS } from '@/content/faqs';

export function FaqSection() {
  return (
    <Stack
      id="faq"
      spacing={3}
      sx={{ scrollMarginTop: (theme) => theme.spacing(12) }}
    >
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <Stack>
        {LANDING_FAQS.map((faq, index) => (
          <Accordion
            key={faq.question}
            disableGutters
            sx={{
              '&:not(:last-of-type)': { borderBottom: 0 },
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              id={`faq-${index}-summary`}
              aria-controls={`faq-${index}-details`}
            >
              <Typography component="h3" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={`faq-${index}-details`}>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
}
