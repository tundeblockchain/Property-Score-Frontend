import { Stack } from '@mui/material';
import { TierUpgradePrompt } from '@/components/billing/TierUpgradePrompt';
import { ReportSection } from '@/components/deals/report/ReportSection';
import type { HmoLayoutScheme, TierAccess } from '@/models';
import { ConversionPlanSection } from './ConversionPlanSection';
import { FireEscapeSection } from './FireEscapeSection';
import { LicensingPathSection } from './LicensingPathSection';
import { RefurbBoqSection } from './RefurbBoqSection';
import { SchemeNotesSection } from './SchemeNotesSection';
import { SchemeOverviewSection } from './SchemeOverviewSection';

interface SchemeAccordionProps {
  scheme: HmoLayoutScheme;
  tierAccess?: TierAccess;
}

export function SchemeAccordion({ scheme, tierAccess }: SchemeAccordionProps) {
  const plannerLocked = tierAccess?.fullHmoPlanner === false;

  return (
    <Stack spacing={1.5}>
      <ReportSection title="Overview & rooms" headingLevel="h3" defaultExpanded>
        <SchemeOverviewSection scheme={scheme} />
      </ReportSection>

      {scheme.conversionPlan ? (
        <ReportSection title="Conversion plan" headingLevel="h3">
          <ConversionPlanSection plan={scheme.conversionPlan} />
        </ReportSection>
      ) : plannerLocked ? (
        <ReportSection title="Conversion plan" headingLevel="h3">
          <TierUpgradePrompt
            title="Conversion plan"
            description="Upgrade to Starter to unlock conversion steps, BoQ and fire checks."
          />
        </ReportSection>
      ) : null}

      {scheme.refurbBoq ? (
        <ReportSection title="Refurb BoQ" headingLevel="h3">
          <RefurbBoqSection boq={scheme.refurbBoq} />
        </ReportSection>
      ) : plannerLocked ? (
        <ReportSection title="Refurb BoQ" headingLevel="h3">
          <TierUpgradePrompt
            title="Refurb BoQ"
            description="Upgrade to Starter to unlock the indicative refurb BoQ."
          />
        </ReportSection>
      ) : null}

      <ReportSection title="Licensing path" headingLevel="h3">
        <LicensingPathSection licensing={scheme.licensing} />
      </ReportSection>

      {scheme.fireEscape ? (
        <ReportSection title="Fire / escape" headingLevel="h3">
          <FireEscapeSection fireEscape={scheme.fireEscape} />
        </ReportSection>
      ) : plannerLocked ? (
        <ReportSection title="Fire / escape" headingLevel="h3">
          <TierUpgradePrompt
            title="Fire / escape"
            description="Upgrade to Starter to unlock fire and escape checks."
          />
        </ReportSection>
      ) : null}

      <ReportSection title="Notes & compliance" headingLevel="h3">
        <SchemeNotesSection scheme={scheme} />
      </ReportSection>
    </Stack>
  );
}
