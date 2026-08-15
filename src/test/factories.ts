import type {
  DealDetail,
  EpcEnrichment,
  FinancialModel,
  GeometryConversionPlan,
  HmoLayoutScheme,
  HmoLicensingPath,
  HmoPlannerResult,
  HmoSchemeRendering,
  LicensingCheck,
  PropertyListingSummary,
  ScoreBreakdown,
  SchoolsEnrichment,
  SoldPricesEnrichment,
  TransportEnrichment,
} from '@/models';

export function buildScoreBreakdown(
  overrides: Partial<ScoreBreakdown> = {},
): ScoreBreakdown {
  return {
    overall: 82,
    financial: 74,
    compliance: 61,
    marketDemand: 88,
    location: 70,
    refurb: 45,
    ...overrides,
  };
}

export function buildListing(
  overrides: Partial<PropertyListingSummary> = {},
): PropertyListingSummary {
  return {
    url: 'https://www.rightmove.co.uk/properties/123456',
    source: 'rightmove',
    address: '12 Example Road, Leeds',
    postcode: 'LS1 1AA',
    price: 250000,
    bedrooms: 4,
    bathrooms: 2,
    propertyType: 'Terraced',
    ...overrides,
  };
}

export function buildFinancialModel(
  overrides: Partial<FinancialModel> = {},
): FinancialModel {
  return {
    askingPrice: 250000,
    estimatedRentMonthly: 1800,
    grossYield: 8.6,
    netCashFlowAnnual: 7200,
    estimatedRoi: 12.4,
    ...overrides,
  };
}

function buildLicensingCheck(): LicensingCheck {
  return { status: 'check_with_la', reason: 'Confirm with the local authority.' };
}

function buildLicensingPath(): HmoLicensingPath {
  return {
    useClass: 'C4',
    occupancyBand: 'small_hmo',
    estimatedOccupants: 5,
    planningPermission: buildLicensingCheck(),
    mandatoryLicence: buildLicensingCheck(),
    additionalLicence: buildLicensingCheck(),
    actionItems: [],
    confidence: 'medium',
    disclaimer: 'Indicative only.',
  };
}

export function buildConversionPlan(
  overrides: Partial<GeometryConversionPlan> = {},
): GeometryConversionPlan {
  return {
    useCase: 'students',
    asBuiltBedrooms: 3,
    proposedLettingRooms: 5,
    steps: [],
    retainedCommunal: ['Kitchen'],
    blocked: [],
    ...overrides,
  };
}

export function buildHmoSchemeRendering(
  overrides: Partial<HmoSchemeRendering> = {},
): HmoSchemeRendering {
  return {
    kind: 'proposed_floor_plan',
    status: 'ready',
    promptVersion: 'hmo-render-v3',
    ...overrides,
  };
}

export function buildHmoScheme(
  overrides: Partial<HmoLayoutScheme> = {},
): HmoLayoutScheme {
  return {
    id: 'scheme-students',
    useCase: 'students',
    title: 'Student share',
    summary: 'Five letting rooms with a shared kitchen.',
    lettingRooms: 5,
    rooms: [],
    amenities: [],
    complianceNotes: [],
    layoutNotes: [],
    estimatedRefurbLowGbp: 30000,
    estimatedRefurbHighGbp: 45000,
    financials: {
      ...buildFinancialModel(),
      voidRateAssumed: 0.08,
      roomRentWeeklyAssumed: 110,
      occupiedRoomsAssumed: 5,
    },
    licensing: buildLicensingPath(),
    fitScore: 78,
    recommended: true,
    ...overrides,
  };
}

export function buildHmoPlanner(
  overrides: Partial<HmoPlannerResult> = {},
): HmoPlannerResult {
  const schemes = overrides.schemes ?? [buildHmoScheme()];
  return {
    source: 'listing_beds',
    floorPlanCount: 1,
    asListedBedrooms: 4,
    asListedBathrooms: 2,
    disclaimer: 'Indicative only.',
    recommendedSchemeId: schemes[0]?.id ?? '',
    ...overrides,
    schemes,
  };
}

export function buildEpcEnrichment(
  overrides: Partial<EpcEnrichment> = {},
): EpcEnrichment {
  return {
    postcode: 'LS1 1AA',
    currentRating: 'D',
    potentialRating: 'B',
    matchedCount: 3,
    notes: 'Nearby certificates only.',
    ...overrides,
  };
}

export function buildSoldPricesEnrichment(
  overrides: Partial<SoldPricesEnrichment> = {},
): SoldPricesEnrichment {
  return {
    postcode: 'LS1 1AA',
    comparableCount: 4,
    notes: 'Land Registry sales.',
    ...overrides,
  };
}

export function buildTransportEnrichment(
  overrides: Partial<TransportEnrichment> = {},
): TransportEnrichment {
  return {
    postcode: 'LS1 1AA',
    latitude: 53.8,
    longitude: -1.55,
    busStopCountWithin500m: 6,
    notes: 'Within walking distance of the station.',
    ...overrides,
  };
}

export function buildSchoolsEnrichment(
  overrides: Partial<SchoolsEnrichment> = {},
): SchoolsEnrichment {
  return {
    postcode: 'LS1 1AA',
    latitude: 53.8,
    longitude: -1.55,
    schoolCountWithin2Miles: 9,
    nearbySchools: [{ name: 'Example Primary', miles: 0.4 }],
    notes: 'Ofsted ratings not included.',
    ...overrides,
  };
}

/** Minimal completed deal; opt into listing, scores and enrichment per test. */
export function buildDealDetail(overrides: Partial<DealDetail> = {}): DealDetail {
  return {
    dealId: 'deal-1',
    status: 'COMPLETED',
    listingUrl: 'https://www.rightmove.co.uk/properties/123456',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-12T14:30:00.000Z',
    ...overrides,
  };
}
