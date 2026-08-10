import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
  /** Decorative glyph shown before the title; hidden from assistive tech. */
  icon?: ReactNode;
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

export function ReportSection({
  title,
  children,
  id,
  icon,
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
      slotProps={{
        heading: { component: headingLevel },
        /**
         * A closed section keeps only its header in the DOM. Report sections
         * are heavy (tables, image grids, nested scheme accordions), so
         * mounting every one up front is what makes the page feel sluggish.
         */
        transition: { unmountOnExit: true, timeout: 180 },
      }}
      disableGutters
      elevation={0}
      sx={[
        {
          // Clears the sticky app bar when jumped to via an anchor link.
          scrollMarginTop: { xs: '72px', md: '88px' },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          '&:before': { display: 'none' },
          overflow: 'hidden',
          bgcolor: 'background.paper',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${slug}-content`}
        id={`${slug}-header`}
        sx={{
          px: 3,
          py: 0.5,
          bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.04),
          color: 'text.primary',
          '&.Mui-expanded': {
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'text.secondary',
          },
          '& .MuiAccordionSummary-content': {
            my: 1.5,
            alignItems: 'center',
            gap: 1.5,
            minWidth: 0,
          },
        }}
      >
        {icon ? (
          <Box
            aria-hidden
            sx={{ display: 'flex', color: 'text.secondary', flexShrink: 0 }}
          >
            {icon}
          </Box>
        ) : null}
        {/* The Accordion heading slot already supplies the heading element. */}
        <Typography variant="h6" component="span">
          {title}
        </Typography>
        {badge}
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pt: 2, pb: 3 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
