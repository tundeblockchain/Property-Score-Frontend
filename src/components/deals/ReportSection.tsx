import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface ReportSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  sx?: SxProps<Theme>;
}

function ExpandIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"
      />
    </svg>
  );
}

export function ReportSection({
  title,
  children,
  defaultExpanded = false,
  sx,
}: ReportSectionProps) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={[
        {
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 1,
          borderLeft: '3px solid',
          borderLeftColor: 'primary.main',
          '&:before': { display: 'none' },
          overflow: 'hidden',
          bgcolor: 'background.paper',
          '&.Mui-expanded': {
            borderColor: 'primary.main',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon />}
        aria-controls={`${slug}-content`}
        id={`${slug}-header`}
        sx={{
          px: 3,
          py: 0.5,
          bgcolor: 'background.paper',
          color: 'primary.dark',
          '&.Mui-expanded': {
            borderBottom: '1px solid',
            borderBottomColor: (theme) => alpha(theme.palette.primary.main, 0.18),
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'primary.main',
          },
          '& .MuiAccordionSummary-content': {
            my: 1.5,
          },
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{ textTransform: 'capitalize', color: 'primary.dark' }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pt: 2, pb: 3 }}>{children}</AccordionDetails>
    </Accordion>
  );
}
