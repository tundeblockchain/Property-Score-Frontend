import type {
  BillingPlansResponse,
  BillingSummaryResponse,
  Price,
  PricingResponse,
  DealDetail,
  DealSummary,
  EpcEnrichment,
  FinancialModel,
  GeometryConversionPlan,
  HmoFamilyLetHeadlineReturns,
  HmoLayoutScheme,
  HmoMoneyComparison,
  HmoSchemeHeadlineReturns,
  HmoLicensingPath,
  HmoMoneySnapshot,
  HmoPlannerResult,
  HmoUseCase,
  HmoSchemeRendering,
  HmoLeaseRentYear,
  HmoSupportedLiving,
  LicensingCheck,
  PropertyListingSummary,
  PublicTestimonial,
  ScoreBreakdown,
  SchoolsEnrichment,
  SoldPricesEnrichment,
  TierAccess,
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

function buildLicensingPath(
  overrides: Partial<HmoLicensingPath> = {},
): HmoLicensingPath {
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
    ...overrides,
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

/**
 * Property-Score planner: weeklyRentPerRoomGbp = round(weekly),
 * annualRentGbp = round(unrounded weekly * lettingRooms * 52).
 */
export function buildSupportedLivingLeaseRent(
  weeklyRentPerRoomGbp: number,
  lettingRooms: number,
  termYears: number,
  cpiUpliftPct: number,
): HmoLeaseRentYear[] {
  const rows: HmoLeaseRentYear[] = [];
  let weekly = weeklyRentPerRoomGbp;
  for (let year = 1; year <= termYears; year += 1) {
    rows.push({
      year,
      weeklyRentPerRoomGbp: Math.round(weekly),
      annualRentGbp: Math.round(weekly * lettingRooms * 52),
    });
    weekly *= 1 + cpiUpliftPct / 100;
  }
  return rows;
}

export function buildSupportedLiving(
  overrides: Partial<HmoSupportedLiving> = {},
): HmoSupportedLiving {
  const defaults: HmoSupportedLiving = {
    inputs: {
      rentPerRoomWeekly: { value: 280, isEstimate: true },
      leaseTermYears: { value: 5, isEstimate: true },
      breakYear: { value: 3, isEstimate: true },
      cpiUpliftPct: { value: 2, isEstimate: true },
      fri: { value: true, isEstimate: false },
      vacantPossessionValueGbp: { value: 275000, isEstimate: true },
      refurbLowGbp: { value: 40000, isEstimate: true },
      refurbHighGbp: { value: 65000, isEstimate: true },
      complianceLumpSumGbp: { value: 12000, isEstimate: true },
      staffEnsuiteRentPremiumWeekly: { value: 25, isEstimate: true },
    },
    leaseRentByYear: buildSupportedLivingLeaseRent(280, 4, 5, 2),
    yieldOnVacantPossession: 8.4,
    premiumOverNormalLetAnnualGbp: 18600,
    providerFailureNetCashFlowAnnual: -4200,
    staffRoomOption: 'with_ensuite',
    staffRoomOptionReason:
      'Overnight cover needs a staff room; the 7.2 m² rear single is below the letting space standard. An ensuite keeps staff self-contained.',
    staffRoomOptions: {
      withEnsuite: {
        option: 'with_ensuite',
        netCashFlowAnnual: 18600,
        estimatedRoi: 9.1,
      },
      withoutEnsuite: {
        option: 'without_ensuite',
        netCashFlowAnnual: 14200,
        estimatedRoi: 8.2,
      },
    },
    residentRoomOption: 'standard',
    residentRoomOptionReason:
      'Chose resident rooms as standard shared bathrooms: net cash flow £12,000 vs £8,000; ROI on deposit 6.0% vs 4.0%. Higher net cash flow wins.',
    residentRoomOptions: {
      standard: {
        option: 'standard',
        netCashFlowAnnual: 12000,
        estimatedRoi: 6,
      },
      ensuite: {
        option: 'ensuite',
        netCashFlowAnnual: 8000,
        estimatedRoi: 4,
      },
    },
    riskBadge: 'Provider / regulatory risk: Medium-High',
    planningNote: 'Sleep-in staff may need C2 planning permission.',
  };

  return {
    ...defaults,
    ...overrides,
    inputs: { ...defaults.inputs, ...overrides.inputs },
    staffRoomOptions: {
      ...defaults.staffRoomOptions,
      ...overrides.staffRoomOptions,
    },
    residentRoomOptions: {
      ...defaults.residentRoomOptions,
      ...overrides.residentRoomOptions,
    },
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

export function buildSupportedLivingScheme(
  overrides: Partial<HmoLayoutScheme> = {},
): HmoLayoutScheme {
  return buildHmoScheme({
    id: 'social_care',
    useCase: 'social_care',
    title: 'Supported living · 4-bed supported living',
    summary: 'Four supported-living rooms on a leased FRI contract.',
    lettingRooms: 4,
    recommended: false,
    licensing: buildLicensingPath({
      useClass: 'unclear',
      occupancyBand: 'care_model',
    }),
    supportedLiving: buildSupportedLiving(),
    ...overrides,
  });
}

export function buildHmoMoneySnapshot(
  overrides: Partial<HmoMoneySnapshot> = {},
): HmoMoneySnapshot {
  return {
    label: 'Family let (as listed)',
    ...buildFinancialModel(),
    voidRateAssumed: 0.04,
    occupancyBasis: '4-bed AST',
    ...overrides,
  };
}

export function buildHmoHeadline(
  overrides: Partial<Omit<HmoSchemeHeadlineReturns, 'basis'>> = {},
): HmoSchemeHeadlineReturns {
  return {
    basis: 'scheme',
    schemeId: 'workers',
    label: 'Workers HMO',
    lettingRooms: 6,
    estimatedRentMonthly: 2400,
    grossYield: 11.2,
    netCashFlowAnnual: 9800,
    estimatedRoi: 14.1,
    ...overrides,
  };
}

export function buildFamilyLetHeadline(
  overrides: Partial<Omit<HmoFamilyLetHeadlineReturns, 'basis'>> = {},
): HmoFamilyLetHeadlineReturns {
  return {
    basis: 'family_let',
    label: 'Family let (as listed)',
    estimatedRentMonthly: 850,
    grossYield: 6.4,
    netCashFlowAnnual: 3100,
    estimatedRoi: 7.2,
    ...overrides,
  };
}

export function buildSchemeWithMoney(
  id: string,
  useCase: HmoUseCase,
  money: Partial<FinancialModel> = {},
  extras: Partial<
    Pick<
      HmoLayoutScheme,
      | 'lettingRooms'
      | 'recommended'
      | 'estimatedRefurbLowGbp'
      | 'estimatedRefurbHighGbp'
    >
  > = {},
): HmoLayoutScheme {
  const lettingRooms = extras.lettingRooms ?? 5;
  return buildHmoScheme({
    id,
    useCase,
    lettingRooms,
    recommended: extras.recommended ?? false,
    financials: {
      ...buildFinancialModel(money),
      voidRateAssumed: 0.08,
      roomRentWeeklyAssumed: 110,
      occupiedRoomsAssumed: lettingRooms,
    },
    ...extras,
  });
}

export function buildHmoMoneyComparison(
  overrides: Partial<HmoMoneyComparison> = {},
): HmoMoneyComparison {
  return {
    asListedFamily: buildHmoMoneySnapshot(),
    bestHmo: {
      ...buildHmoMoneySnapshot(),
      schemeId: 'workers',
      schemeTitle: 'Workers HMO',
    },
    delta: {
      monthlyRentGbp: 0,
      grossYieldPts: 0,
      netCashFlowAnnualGbp: 0,
      estimatedRoiPts: 0,
    },
    notes: [],
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
    goodOrOutstandingWithin2Miles: 4,
    nearbySchools: [
      { name: 'Example Primary', miles: 0.4, phase: 'Primary', ofstedRating: 'Good' },
    ],
    notes: 'Live school locations from DfE Get Information About Schools.',
    ...overrides,
  };
}

export function buildTierAccess(
  overrides: Partial<TierAccess> = {},
): TierAccess {
  return {
    scoreBreakdown: true,
    pdfExport: true,
    narrativeActionPlan: true,
    fullHmoPlanner: true,
    standardAreaInsights: true,
    fullAreaInsights: true,
    moneyComparison: true,
    ...overrides,
  };
}

export function buildBillingSummary(
  overrides: Partial<BillingSummaryResponse> = {},
): BillingSummaryResponse {
  return {
    email: 'investor@example.com',
    tier: 'FREE',
    creditsRemaining: 4,
    monthlyAllowance: 5,
    analysisCreditCost: 1,
    proposedLayoutCreditCost: 3,
    tierAccess: buildTierAccess({
      scoreBreakdown: false,
      pdfExport: false,
      narrativeActionPlan: false,
      fullHmoPlanner: false,
      standardAreaInsights: false,
      fullAreaInsights: false,
      moneyComparison: false,
    }),
    ...overrides,
  };
}

export function buildPrice(overrides: Partial<Price> = {}): Price {
  return {
    priceId: 'price_starter',
    unitAmount: 3900,
    currency: 'gbp',
    interval: 'month',
    ...overrides,
  };
}

export function buildPricing(
  overrides: Partial<PricingResponse> = {},
): PricingResponse {
  return {
    plans: {
      starter: buildPrice({
        priceId: 'price_starter',
        unitAmount: 3900,
        interval: 'month',
      }),
      pro: buildPrice({
        priceId: 'price_pro',
        unitAmount: 9900,
        interval: 'month',
      }),
    },
    creditPacks: [
      {
        credits: 5,
        price: buildPrice({
          priceId: 'price_credits_5',
          unitAmount: 1400,
          interval: null,
        }),
      },
    ],
    ...overrides,
  };
}

export function buildBillingPlans(
  overrides: Partial<BillingPlansResponse> = {},
): BillingPlansResponse {
  return {
    analysisCreditCost: 1,
    proposedLayoutCreditCost: 3,
    freePlan: {
      title: 'Free',
      creditsLabel: '5 listing analyses to start',
      description: 'Try the core score and comparables.',
      comparison: { included: ['Overall score'], missing: ['PDF export'] },
    },
    subscriptionPlans: [
      {
        product: 'starter_subscription',
        title: 'Starter',
        creditsLabel: '20 listing analyses / month',
        description: 'Full reports.',
        comparison: { included: ['PDF export'], missing: [] },
      },
      {
        product: 'pro_subscription',
        title: 'Pro',
        creditsLabel: '60 listing analyses / month',
        description: 'Higher volume screening.',
        comparison: { included: ['Money comparison'], missing: [] },
        highlight: true,
      },
    ],
    creditPacks: [
      {
        product: 'credits_5',
        title: '5 extra analyses',
        creditsLabel: '+5 listing analyses',
        description: 'Quick top-up.',
        features: ['Adds 5 listing analyses to your balance'],
      },
    ],
    ...overrides,
  };
}

/** Minimal deal list item; opt into listing and scores per test. */
export function buildDealSummary(
  overrides: Partial<DealSummary> = {},
): DealSummary {
  return {
    dealId: 'deal-1',
    status: 'COMPLETED',
    listingUrl: 'https://www.rightmove.co.uk/properties/123456',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-12T14:30:00.000Z',
    ...overrides,
  };
}

/** Minimal completed deal; opt into listing, scores and enrichment per test. */
export function buildDealDetail(overrides: Partial<DealDetail> = {}): DealDetail {
  return {
    ...buildDealSummary(),
    tierAccess: buildTierAccess(),
    ...overrides,
  };
}

export function buildPublicTestimonial(
  overrides: Partial<PublicTestimonial> = {},
): PublicTestimonial {
  return {
    id: 'testimonial_1',
    displayName: 'James',
    role: 'HMO investor, Manchester',
    quote:
      'The report saved me a weekend of spreadsheet work before the viewing.',
    createdAt: '2026-08-16T09:00:00.000Z',
    ...overrides,
  };
}
