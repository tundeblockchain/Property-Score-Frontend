import { Stack } from '@mui/material';
import { ReportSection } from '@/components/deals/ReportSection';
import type { HmoLayoutScheme } from '@/models';
import { ConversionPlanSection } from './ConversionPlanSection';
import { LicensingPathSection } from './LicensingPathSection';
import { SchemeNotesSection } from './SchemeNotesSection';
import { SchemeOverviewSection } from './SchemeOverviewSection';

interface SchemeAccordionProps {
  scheme: HmoLayoutScheme;
}

export function SchemeAccordion({ scheme }: SchemeAccordionProps) {
  return (
    <Stack spacing={1.5}>
      <ReportSection title="Overview & rooms" defaultExpanded>
        <SchemeOverviewSection scheme={scheme} />
      </ReportSection>

      {scheme.conversionPlan ? (
        <ReportSection title="Conversion plan">
          <ConversionPlanSection plan={scheme.conversionPlan} />
        </ReportSection>
      ) : null}

      <ReportSection title="Licensing path">
        <LicensingPathSection licensing={scheme.licensing} />
      </ReportSection>

      <ReportSection title="Notes & compliance">
        <SchemeNotesSection scheme={scheme} />
      </ReportSection>
    </Stack>
  );
}
