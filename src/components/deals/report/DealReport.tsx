import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { ReportNav } from '@/components/deals/report/ReportNav';
import { ReportSection } from '@/components/deals/report/ReportSection';
import {
  buildReportSections,
  type ReportSectionSpec,
} from '@/components/deals/report/reportSections';
import { useIsPrinting } from '@/hooks/useIsPrinting';
import type { DealDetail } from '@/models';

interface DealReportProps {
  deal: DealDetail;
}

export function DealReport({ deal }: DealReportProps) {
  const sections = useMemo(() => buildReportSections(deal), [deal]);
  const isPrinting = useIsPrinting();
  /**
   * Only the sections the reader has touched are recorded, so a section that
   * arrives later still opens according to its own default.
   */
  const [expandedOverrides, setExpandedOverrides] = useState<
    Record<string, boolean>
  >({});

  const isExpanded = (section: ReportSectionSpec) =>
    isPrinting || (expandedOverrides[section.id] ?? section.defaultExpanded);

  const allExpanded = sections.length > 0 && sections.every(isExpanded);

  function handleExpandedChange(id: string, expanded: boolean) {
    setExpandedOverrides((previous) => ({ ...previous, [id]: expanded }));
  }

  function handleToggleAll() {
    const expanded = !allExpanded;
    setExpandedOverrides(
      Object.fromEntries(sections.map((section) => [section.id, expanded])),
    );
  }

  function handleNavSelect(id: string) {
    setExpandedOverrides((previous) => ({ ...previous, [id]: true }));
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2} className="deal-report">
      <Button
        onClick={handleToggleAll}
        size="small"
        color="inherit"
        className="deal-report-toolbar"
        startIcon={
          allExpanded ? <UnfoldLessOutlinedIcon /> : <UnfoldMoreOutlinedIcon />
        }
        sx={{
          alignSelf: 'flex-end',
          '@media print': { display: 'none' },
        }}
      >
        {allExpanded ? 'Collapse all' : 'Expand all'}
      </Button>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: '180px minmax(0, 1fr)',
          },
          '@media print': {
            display: 'block',
          },
        }}
      >
        <ReportNav
          sections={sections}
          onSelect={handleNavSelect}
          sx={{
            display: { xs: 'none', lg: 'block' },
            '@media print': { display: 'none' },
          }}
        />

        <Stack spacing={2} sx={{ minWidth: 0 }}>
          {sections.map((section) => (
            <ReportSection
              key={section.id}
              id={section.id}
              title={section.title}
              icon={<section.icon fontSize="small" />}
              badge={section.badge}
              expanded={isExpanded(section)}
              onExpandedChange={(next) =>
                handleExpandedChange(section.id, next)
              }
              sx={{
                '@media print': {
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                },
              }}
            >
              {section.render()}
            </ReportSection>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
