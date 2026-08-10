import { Stack } from '@mui/material';
import { ReportSection } from '@/components/deals/report/ReportSection';
import type { HmoLayoutScheme } from '@/models';
import { ConversionPlanSection } from './ConversionPlanSection';
import { FireEscapeSection } from './FireEscapeSection';
import { LicensingPathSection } from './LicensingPathSection';
import { RefurbBoqSection } from './RefurbBoqSection';
import { SchemeNotesSection } from './SchemeNotesSection';
import { SchemeOverviewSection } from './SchemeOverviewSection';

interface SchemeAccordionProps {
  scheme: HmoLayoutScheme;
}

export function SchemeAccordion({ scheme }: SchemeAccordionProps) {
  return (
    <Stack spacing={1.5}>
      <ReportSection title="Overview & rooms" headingLevel="h3" defaultExpanded>
        <SchemeOverviewSection scheme={scheme} />
      </ReportSection>

      {scheme.conversionPlan ? (
        <ReportSection title="Conversion plan" headingLevel="h3">
          <ConversionPlanSection plan={scheme.conversionPlan} />
        </ReportSection>
      ) : null}

      {scheme.refurbBoq ? (
        <ReportSection title="Refurb BoQ" headingLevel="h3">
          <RefurbBoqSection boq={scheme.refurbBoq} />
        </ReportSection>
      ) : null}

      <ReportSection title="Licensing path" headingLevel="h3">
        <LicensingPathSection licensing={scheme.licensing} />
      </ReportSection>

      {scheme.fireEscape ? (
        <ReportSection title="Fire / escape" headingLevel="h3">
          <FireEscapeSection fireEscape={scheme.fireEscape} />
        </ReportSection>
      ) : null}

      <ReportSection title="Notes & compliance" headingLevel="h3">
        <SchemeNotesSection scheme={scheme} />
      </ReportSection>
    </Stack>
  );
}
