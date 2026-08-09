import { ReportSection } from '@/components/deals/ReportSection';
import type { HmoLayoutScheme, HmoPlannerResult, HmoUseCase } from '@/models';
import { HmoOverviewSection } from './HmoOverviewSection';
import { SchemeAccordion } from './SchemeAccordion';

interface HmoPlannerPanelProps {
  planner: HmoPlannerResult;
}

const USE_CASE_ORDER: HmoUseCase[] = ['students', 'workers', 'social_care'];

const fullWidth = { gridColumn: '1 / -1' } as const;

export function HmoPlannerPanel({ planner }: HmoPlannerPanelProps) {
  const schemesByUseCase = new Map(
    planner.schemes.map((scheme) => [scheme.useCase, scheme]),
  );
  const orderedSchemes = USE_CASE_ORDER.map((useCase) =>
    schemesByUseCase.get(useCase),
  ).filter((scheme): scheme is HmoLayoutScheme => scheme != null);

  if (orderedSchemes.length === 0) {
    return null;
  }

  return (
    <>
      <ReportSection title="HMO overview" defaultExpanded sx={fullWidth}>
        <HmoOverviewSection planner={planner} />
      </ReportSection>

      {orderedSchemes.map((scheme) => (
        <ReportSection
          key={scheme.id}
          title={
            scheme.recommended ? `${scheme.title} · recommended` : scheme.title
          }
          defaultExpanded={scheme.recommended}
          sx={fullWidth}
        >
          <SchemeAccordion scheme={scheme} />
        </ReportSection>
      ))}
    </>
  );
}
