import { describe, expect, it } from 'vitest';
import { buildReportSections } from '@/components/deals/report/reportSections';
import {
  buildDealDetail,
  buildEpcEnrichment,
  buildFinancialModel,
  buildHmoPlanner,
  buildHmoScheme,
  buildListing,
  buildSchoolsEnrichment,
  buildScoreBreakdown,
  buildSoldPricesEnrichment,
  buildTransportEnrichment,
} from '@/test/factories';

const ALWAYS_RUN_SECTION_IDS = [
  'score-breakdown',
  'financial-model',
  'area-insights',
  'epc',
  'sold-comparables',
  'transport',
  'schools',
] as const;

describe('buildReportSections', () => {
  it('returns nothing while analysis is still running and has no content yet', () => {
    expect(
      buildReportSections(buildDealDetail({ status: 'PROCESSING' })),
    ).toEqual([]);
  });

  it('keeps the always-run checks visible on a completed deal with no data', () => {
    const sections = buildReportSections(buildDealDetail());

    expect(sections.map((section) => section.id)).toEqual([
      ...ALWAYS_RUN_SECTION_IDS,
    ]);
  });

  it('only includes present sections while a deal is still processing', () => {
    const sections = buildReportSections(
      buildDealDetail({
        status: 'PROCESSING',
        scores: buildScoreBreakdown(),
        financialModel: buildFinancialModel(),
      }),
    );

    expect(sections.map((section) => section.id)).toEqual([
      'score-breakdown',
      'financial-model',
    ]);
  });

  it('leads with the analysis and puts the raw listing material last', () => {
    const sections = buildReportSections(
      buildDealDetail({
        listing: buildListing({
          imageUrls: ['https://example.com/a.jpg'],
          floorPlanUrls: ['https://example.com/plan.png'],
          description: 'A four bed terrace.',
        }),
        scores: buildScoreBreakdown(),
        financialModel: buildFinancialModel(),
        narrative: 'Solid yield for the area.',
        actionPlan: ['Book a viewing'],
      }),
    );

    expect(sections.map((section) => section.id)).toEqual([
      'score-breakdown',
      'financial-model',
      'narrative',
      'action-plan',
      'area-insights',
      'epc',
      'sold-comparables',
      'transport',
      'schools',
      'property-images',
      'floor-plans',
      'listing-description',
    ]);
  });

  it('places the supporting evidence panels after the analysis', () => {
    const sections = buildReportSections(
      buildDealDetail({
        scores: buildScoreBreakdown(),
        enrichment: {
          epc: buildEpcEnrichment(),
          soldPrices: buildSoldPricesEnrichment(),
          transport: buildTransportEnrichment(),
          schools: buildSchoolsEnrichment(),
        },
      }),
    );

    expect(sections.map((section) => section.id)).toEqual([
      'score-breakdown',
      'financial-model',
      'area-insights',
      'epc',
      'sold-comparables',
      'transport',
      'schools',
    ]);
  });

  it('expands the sections that answer the investment question by default', () => {
    const sections = buildReportSections(
      buildDealDetail({
        listing: buildListing({ imageUrls: ['https://example.com/a.jpg'] }),
        scores: buildScoreBreakdown(),
        financialModel: buildFinancialModel(),
        enrichment: { epc: buildEpcEnrichment() },
      }),
    );

    const expandedByDefault = sections
      .filter((section) => section.defaultExpanded)
      .map((section) => section.id);

    expect(expandedByDefault).toEqual(['score-breakdown', 'financial-model']);
  });

  it('adds an overview plus one section per HMO scheme in product order', () => {
    const sections = buildReportSections(
      buildDealDetail({
        status: 'PROCESSING',
        hmoPlanner: buildHmoPlanner({
          schemes: [
            buildHmoScheme({
              id: 'care',
              useCase: 'social_care',
              title: 'Supported living',
              recommended: false,
            }),
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              title: 'Student share',
              recommended: true,
            }),
          ],
        }),
      }),
    );

    expect(sections.map((section) => section.id)).toEqual([
      'hmo-overview',
      'hmo-scheme-students',
      'hmo-scheme-care',
    ]);
  });

  it('badges the recommended scheme instead of renaming it', () => {
    const sections = buildReportSections(
      buildDealDetail({
        status: 'PROCESSING',
        hmoPlanner: buildHmoPlanner({
          schemes: [
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              title: 'Student share',
              recommended: true,
            }),
            buildHmoScheme({
              id: 'workers',
              useCase: 'workers',
              title: 'Professional share',
              recommended: false,
            }),
          ],
        }),
      }),
    );

    const recommended = sections.find(
      (section) => section.id === 'hmo-scheme-students',
    );
    const other = sections.find(
      (section) => section.id === 'hmo-scheme-workers',
    );

    expect(recommended?.title).toBe('Student share');
    expect(recommended?.badge).toBeDefined();
    expect(recommended?.defaultExpanded).toBe(true);
    expect(other?.badge).toBeUndefined();
    expect(other?.defaultExpanded).toBe(false);
  });

  it('skips the HMO sections when the planner returned no usable schemes', () => {
    const sections = buildReportSections(
      buildDealDetail({
        status: 'PROCESSING',
        hmoPlanner: buildHmoPlanner({ schemes: [] }),
      }),
    );

    expect(sections).toEqual([]);
  });

  it('shows area insights when any single area signal is present', () => {
    const sections = buildReportSections(
      buildDealDetail({
        status: 'PROCESSING',
        enrichment: {
          crime: {
            postcode: 'LS1 1AA',
            latitude: 53.8,
            longitude: -1.55,
            crimesLast12m: 120,
            crimeRatePer1000: 44,
            dominantCategories: ['burglary'],
            monthsSampled: 6,
            notes: 'Police data.',
          },
        },
      }),
    );

    expect(sections.map((section) => section.id)).toEqual(['area-insights']);
  });

  it('gives every section a unique anchor id', () => {
    const sections = buildReportSections(
      buildDealDetail({
        listing: buildListing({
          imageUrls: ['https://example.com/a.jpg'],
          description: 'A four bed terrace.',
        }),
        scores: buildScoreBreakdown(),
        financialModel: buildFinancialModel(),
        hmoPlanner: buildHmoPlanner(),
        narrative: 'Solid yield.',
        actionPlan: ['Book a viewing'],
        enrichment: {
          epc: buildEpcEnrichment(),
          transport: buildTransportEnrichment(),
        },
      }),
    );

    const ids = sections.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('leaves optional listing content out rather than marking it unavailable', () => {
    const sections = buildReportSections(buildDealDetail());

    expect(
      sections.map((section) => section.id),
    ).not.toContain('property-images');
    expect(sections.map((section) => section.id)).not.toContain('floor-plans');
    expect(sections.map((section) => section.id)).not.toContain(
      'listing-description',
    );
    expect(sections.map((section) => section.id)).not.toContain('hmo-overview');
  });
});
