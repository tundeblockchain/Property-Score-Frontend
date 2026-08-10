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

describe('buildReportSections', () => {
  it('returns nothing for a deal with no analysis content', () => {
    expect(buildReportSections(buildDealDetail())).toEqual([]);
  });

  it('only includes sections whose data is present', () => {
    const sections = buildReportSections(
      buildDealDetail({
        scores: buildScoreBreakdown(),
        financialModel: buildFinancialModel(),
      }),
    );

    expect(sections.map((section) => section.id)).toEqual([
      'score-breakdown',
      'financial-model',
    ]);
  });

  it('orders the report from evidence through to conclusions', () => {
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
      'property-images',
      'floor-plans',
      'listing-description',
      'score-breakdown',
      'financial-model',
      'narrative',
      'action-plan',
    ]);
  });

  it('puts the small fact panels in the aside column', () => {
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

    const asideIds = sections
      .filter((section) => section.column === 'aside')
      .map((section) => section.id);

    expect(asideIds).toEqual(['epc', 'sold-comparables', 'transport', 'schools']);
    expect(
      sections.find((section) => section.id === 'score-breakdown')?.column,
    ).toBe('main');
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
      buildDealDetail({ hmoPlanner: buildHmoPlanner({ schemes: [] }) }),
    );

    expect(sections).toEqual([]);
  });

  it('shows area insights when any single area signal is present', () => {
    const sections = buildReportSections(
      buildDealDetail({
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
});
