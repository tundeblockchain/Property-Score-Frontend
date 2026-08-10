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
  /** Anchor target, so the section can be deep-linked and jumped to. */
  id?: string;
  /** Shown beside the title, for status such as a recommended HMO scheme. */
  badge?: ReactNode;
  /** Nested sections pass 'h3' to keep the document outline in order. */
  headingLevel?: 'h2' | 'h3';
  /** Used only while uncontrolled; ignored when `expanded` is supplied. */
  defaultExpanded?: boolean;
  /** Supply with `onExpandedChange` to let the page drive expansion. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
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
  id,
  badge,
  headingLevel = 'h2',
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  sx,
}: ReportSectionProps) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const isControlled = expanded !== undefined;

  return (
    <Accordion
      id={id}
      {...(isControlled
        ? { expanded, onChange: (_, next) => onExpandedChange?.(next) }
        : { defaultExpanded })}
      slotProps={{ heading: { component: headingLevel } }}
      disableGutters
      elevation={0}
      sx={[
        {
          // Clears the sticky app bar when jumped to via an anchor link.
          scrollMarginTop: { xs: '72px', md: '88px' },
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
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          color: 'info.dark',
          '&.Mui-expanded': {
            borderBottom: '1px solid',
            borderBottomColor: (theme) => alpha(theme.palette.info.main, 0.22),
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'info.main',
          },
          '& .MuiAccordionSummary-content': {
            my: 1.5,
            alignItems: 'center',
            gap: 1.5,
            minWidth: 0,
          },
        }}
      >
        {/* The Accordion heading slot already supplies the heading element. */}
        <Typography
          variant="h6"
          component="span"
          sx={{ textTransform: 'capitalize', color: 'info.dark' }}
        >
          {title}
        </Typography>
        {badge}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          fontSize: '1.0625rem',
          '& .MuiTypography-body1': { fontSize: '1.0625rem' },
          '& .MuiTypography-body2': { fontSize: '1rem' },
          '& .MuiTypography-caption': { fontSize: '0.9rem' },
          '& .MuiTypography-subtitle2': { fontSize: '1.0625rem' },
          '& .MuiTableCell-root': { fontSize: '1rem' },
          '& .MuiListItemText-primary': { fontSize: '1.0625rem' },
          '& .MuiChip-label': { fontSize: '0.85rem' },
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
