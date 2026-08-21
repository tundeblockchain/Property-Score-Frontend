import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { Chip, Typography, type SvgIconProps } from '@mui/material';
import type { ComponentType, ReactNode } from 'react';
import { TierUpgradePrompt } from '@/components/billing/TierUpgradePrompt';
import { ScoreBreakdownBars } from '@/components/deals/common/ScoreBreakdownBars';
import {
  HmoOverviewSection,
  ProposedLayoutGallery,
  SchemeAccordion,
  orderedHmoSchemes,
  schemesWithReadyProposedLayout,
} from '@/components/deals/hmoPlanner';
import { ActionPlanList } from '@/components/deals/panels/ActionPlanList';
import { AreaInsightsPanel } from '@/components/deals/panels/AreaInsightsPanel';
import { ComparablesPanel } from '@/components/deals/panels/ComparablesPanel';
import { EpcPanel } from '@/components/deals/panels/EpcPanel';
import { FinancialModelPanel } from '@/components/deals/panels/FinancialModelPanel';
import { FloorPlans } from '@/components/deals/panels/FloorPlans';
import { ListingDescription } from '@/components/deals/panels/ListingDescription';
import { PropertyImages } from '@/components/deals/panels/PropertyImages';
import { SchoolsPanel } from '@/components/deals/panels/SchoolsPanel';
import { TransportPanel } from '@/components/deals/panels/TransportPanel';
import { SectionUnavailable } from '@/components/deals/report/SectionUnavailable';
import type { DealDetail } from '@/models';

type UpgradePlan = 'Starter' | 'Pro';

export interface ReportSectionSpec {
  /** Anchor id, also used as the React key and the nav target. */
  readonly id: string;
  readonly title: string;
  readonly defaultExpanded: boolean;
  readonly icon: ComponentType<SvgIconProps>;
  readonly badge?: ReactNode;
  /** Called only once the section is open, so a closed one costs nothing. */
  readonly render: () => ReactNode;
}

function isFeatureLocked(allowed: boolean | undefined): boolean {
  return allowed === false;
}

function lockBadge(plan: UpgradePlan): ReactNode {
  return (
    <Chip
      icon={<LockOutlinedIcon />}
      label={plan}
      size="small"
      variant="outlined"
    />
  );
}

/**
 * Placeholder for a check we run on every property but which returned nothing,
 * so its absence reads as a result rather than as a missing feature.
 */
function unavailableSection(
  id: string,
  title: string,
  icon: ComponentType<SvgIconProps>,
): ReportSectionSpec {
  return {
    id,
    title,
    defaultExpanded: false,
    icon,
    render: () => <SectionUnavailable />,
  };
}

function lockedSection(
  id: string,
  title: string,
  icon: ComponentType<SvgIconProps>,
  plan: UpgradePlan,
  description: string,
): ReportSectionSpec {
  return {
    id,
    title,
    defaultExpanded: false,
    icon,
    badge: lockBadge(plan),
    render: () => (
      <TierUpgradePrompt title={title} description={description} />
    ),
  };
}

function completeGatedSection(options: {
  id: string;
  title: string;
  icon: ComponentType<SvgIconProps>;
  isComplete: boolean;
  hasData: boolean;
  allowed: boolean | undefined;
  plan: UpgradePlan;
  lockDescription: string;
  render: () => ReactNode;
}): ReportSectionSpec | undefined {
  const {
    id,
    title,
    icon,
    isComplete,
    hasData,
    allowed,
    plan,
    lockDescription,
    render,
  } = options;

  if (hasData) {
    return {
      id,
      title,
      defaultExpanded: false,
      icon,
      render,
    };
  }

  if (!isComplete) {
    return undefined;
  }

  if (isFeatureLocked(allowed)) {
    return lockedSection(id, title, icon, plan, lockDescription);
  }

  return unavailableSection(id, title, icon);
}

/**
 * Builds the report as a single ordered column: listing visuals first (closed),
 * then the analysis (open), then supporting evidence (closed), then narrative
 * and action plan (open) at the bottom.
 *
 * The checks that run for every property keep their place once the analysis is
 * complete, even with no data. Until then there is nothing to report, and
 * genuinely optional content stays conditional either way.
 */
export function buildReportSections(deal: DealDetail): ReportSectionSpec[] {
  const { listing, scores, financialModel, hmoPlanner, narrative, actionPlan } =
    deal;
  const enrichment = deal.enrichment;
  const access = deal.tierAccess;
  const isComplete = deal.status === 'COMPLETED';
  const sections: ReportSectionSpec[] = [];

  if (listing?.imageUrls && listing.imageUrls.length > 0) {
    const imageUrls = listing.imageUrls;
    sections.push({
      id: 'property-images',
      title: 'Property images',
      defaultExpanded: false,
      icon: PhotoLibraryOutlinedIcon,
      render: () => <PropertyImages imageUrls={imageUrls} />,
    });
  }

  if (listing?.description) {
    const description = listing.description;
    sections.push({
      id: 'listing-description',
      title: 'Listing description',
      defaultExpanded: false,
      icon: DescriptionOutlinedIcon,
      render: () => <ListingDescription description={description} />,
    });
  }

  if (listing?.floorPlanUrls && listing.floorPlanUrls.length > 0) {
    const floorPlanUrls = listing.floorPlanUrls;
    sections.push({
      id: 'floor-plans',
      title: 'Floor plans',
      defaultExpanded: false,
      icon: ArchitectureOutlinedIcon,
      render: () => <FloorPlans floorPlanUrls={floorPlanUrls} />,
    });
  }

  const readyProposedLayouts = hmoPlanner
    ? schemesWithReadyProposedLayout(hmoPlanner)
    : [];
  if (readyProposedLayouts.length > 0) {
    sections.push({
      id: 'proposed-layout',
      title: 'Proposed layout',
      defaultExpanded: true,
      icon: AutoAwesomeOutlinedIcon,
      render: () => (
        <ProposedLayoutGallery
          dealId={deal.dealId}
          schemes={readyProposedLayouts}
        />
      ),
    });
  }

  if (scores) {
    sections.push({
      id: 'score-breakdown',
      title: 'Score breakdown',
      defaultExpanded: true,
      icon: InsightsOutlinedIcon,
      render: () => (
        <ScoreBreakdownBars
          scores={scores}
          includeOverall={false}
          tierAccess={deal.tierAccess}
        />
      ),
    });
  } else if (isComplete) {
    sections.push(
      unavailableSection(
        'score-breakdown',
        'Score breakdown',
        InsightsOutlinedIcon,
      ),
    );
  }

  if (financialModel) {
    sections.push({
      id: 'financial-model',
      title: 'Financial model',
      defaultExpanded: true,
      icon: PaymentsOutlinedIcon,
      render: () => <FinancialModelPanel model={financialModel} />,
    });
  } else if (isComplete) {
    sections.push(
      unavailableSection(
        'financial-model',
        'Financial model',
        PaymentsOutlinedIcon,
      ),
    );
  }

  if (hmoPlanner) {
    const schemes = orderedHmoSchemes(hmoPlanner);

    if (schemes.length > 0) {
      sections.push({
        id: 'hmo-overview',
        title: 'HMO overview',
        defaultExpanded: true,
        icon: HomeWorkOutlinedIcon,
        render: () => (
          <HmoOverviewSection planner={hmoPlanner} tierAccess={access} />
        ),
      });

      for (const scheme of schemes) {
        sections.push({
          id: `hmo-scheme-${scheme.id}`,
          title: scheme.title,
          defaultExpanded: scheme.recommended,
          icon: LayersOutlinedIcon,
          badge: scheme.recommended ? (
            <Chip label="Recommended" color="success" size="small" />
          ) : undefined,
          render: () => (
            <SchemeAccordion scheme={scheme} tierAccess={access} />
          ),
        });
      }
    }
  }

  const hasAreaInsights = Boolean(
    enrichment?.broadband ||
      enrichment?.planning ||
      enrichment?.market ||
      enrichment?.crime ||
      enrichment?.demographics,
  );

  const areaInsights = completeGatedSection({
    id: 'area-insights',
    title: 'Area insights',
    icon: PlaceOutlinedIcon,
    isComplete,
    hasData: Boolean(hasAreaInsights && enrichment),
    allowed: access?.fullAreaInsights,
    plan: 'Pro',
    lockDescription:
      'Upgrade to Pro to unlock planning, crime, broadband and local-area data.',
    render: () => (
      <AreaInsightsPanel
        broadband={enrichment?.broadband}
        planning={enrichment?.planning}
        market={enrichment?.market}
        crime={enrichment?.crime}
        demographics={enrichment?.demographics}
      />
    ),
  });
  if (areaInsights) {
    sections.push(areaInsights);
  }

  if (enrichment?.epc) {
    const epc = enrichment.epc;
    sections.push({
      id: 'epc',
      title: 'EPC',
      defaultExpanded: false,
      icon: BoltOutlinedIcon,
      render: () => <EpcPanel epc={epc} />,
    });
  } else if (isComplete) {
    sections.push(unavailableSection('epc', 'EPC', BoltOutlinedIcon));
  }

  if (enrichment?.soldPrices) {
    const soldPrices = enrichment.soldPrices;
    sections.push({
      id: 'sold-comparables',
      title: 'Sold comparables',
      defaultExpanded: false,
      icon: SellOutlinedIcon,
      render: () => <ComparablesPanel soldPrices={soldPrices} />,
    });
  } else if (isComplete) {
    sections.push(
      unavailableSection('sold-comparables', 'Sold comparables', SellOutlinedIcon),
    );
  }

  const transportData = enrichment?.transport;
  const transport = completeGatedSection({
    id: 'transport',
    title: 'Transport',
    icon: DirectionsTransitOutlinedIcon,
    isComplete,
    hasData: Boolean(transportData),
    allowed: access?.standardAreaInsights,
    plan: 'Starter',
    lockDescription:
      'Upgrade to Starter to unlock nearest-station times and local transport.',
    render: () =>
      transportData ? (
        <TransportPanel transport={transportData} />
      ) : (
        <SectionUnavailable />
      ),
  });
  if (transport) {
    sections.push(transport);
  }

  const schoolsData = enrichment?.schools;
  const schools = completeGatedSection({
    id: 'schools',
    title: 'Schools',
    icon: SchoolOutlinedIcon,
    isComplete,
    hasData: Boolean(schoolsData),
    allowed: access?.standardAreaInsights,
    plan: 'Starter',
    lockDescription:
      'Upgrade to Starter to unlock nearby schools and Ofsted ratings.',
    render: () =>
      schoolsData ? (
        <SchoolsPanel schools={schoolsData} />
      ) : (
        <SectionUnavailable />
      ),
  });
  if (schools) {
    sections.push(schools);
  }

  if (narrative) {
    sections.push({
      id: 'narrative',
      title: 'Narrative',
      defaultExpanded: true,
      icon: NotesOutlinedIcon,
      render: () => (
        <Typography color="text.primary" whiteSpace="pre-wrap">
          {narrative}
        </Typography>
      ),
    });
  } else if (isComplete && isFeatureLocked(access?.narrativeActionPlan)) {
    sections.push(
      lockedSection(
        'narrative',
        'Narrative',
        NotesOutlinedIcon,
        'Starter',
        'Upgrade to Starter to unlock the investment narrative.',
      ),
    );
  }

  if (actionPlan && actionPlan.length > 0) {
    sections.push({
      id: 'action-plan',
      title: 'Action plan',
      defaultExpanded: true,
      icon: ChecklistOutlinedIcon,
      render: () => <ActionPlanList items={actionPlan} />,
    });
  } else if (isComplete && isFeatureLocked(access?.narrativeActionPlan)) {
    sections.push(
      lockedSection(
        'action-plan',
        'Action plan',
        ChecklistOutlinedIcon,
        'Starter',
        'Upgrade to Starter to unlock recommended next steps.',
      ),
    );
  }

  return sections;
}
