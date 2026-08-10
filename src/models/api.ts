export type UserTier = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export type DealStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type CheckoutProduct =
  | 'starter_subscription'
  | 'pro_subscription'
  | 'credits_10';

export interface AnalyseRequest {
  rightmove_url: string;
}

export interface AnalyseAcceptedResponse {
  jobId: string;
  status: 'PROCESSING';
}

export interface ScoreBreakdown {
  overall: number;
  financial: number;
  compliance: number;
  marketDemand: number;
  location: number;
  refurb: number;
}

export interface PropertyListingSummary {
  url: string;
  source: 'rightmove' | 'zoopla' | 'other';
  address?: string;
  postcode?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  description?: string;
  floorPlanUrls?: string[];
  imageUrls?: string[];
}

export interface AnalyseStatusResponse {
  jobId: string;
  status: DealStatus;
  scores?: ScoreBreakdown;
  listing?: PropertyListingSummary;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialModel {
  askingPrice?: number;
  estimatedRentMonthly?: number;
  grossYield?: number;
  netCashFlowAnnual?: number;
  estimatedRoi?: number;
}

export type HmoUseCase = 'students' | 'workers' | 'social_care';

export type HmoRoomType =
  | 'single'
  | 'double'
  | 'ensuite'
  | 'accessible'
  | 'staff';

export interface HmoLayoutRoom {
  label: string;
  type: HmoRoomType;
  estimatedAreaSqM?: number;
  meetsSpaceStandard?: boolean;
  notes?: string;
}

export interface HmoSchemeFinancials extends FinancialModel {
  voidRateAssumed: number;
  roomRentWeeklyAssumed: number;
  occupiedRoomsAssumed: number;
}

export type LicensingRequirementStatus =
  | 'likely_required'
  | 'likely_not_required'
  | 'check_with_la'
  | 'not_applicable';

export type HmoUseClass = 'C3' | 'C4' | 'sui_generis' | 'unclear';

export type HmoOccupancyBand = 'small_hmo' | 'large_hmo' | 'non_hmo' | 'care_model';

export type LicensingConfidence = 'high' | 'medium' | 'low';

export interface LicensingCheck {
  status: LicensingRequirementStatus;
  reason: string;
}

export interface HmoLicensingPath {
  useClass: HmoUseClass;
  occupancyBand: HmoOccupancyBand;
  estimatedOccupants: number;
  planningPermission: LicensingCheck;
  mandatoryLicence: LicensingCheck;
  additionalLicence: LicensingCheck;
  actionItems: string[];
  confidence: LicensingConfidence;
  disclaimer: string;
}

export type FloorPlanRoomKind =
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living'
  | 'dining'
  | 'hallway'
  | 'storage'
  | 'garage'
  | 'utility'
  | 'other';

export type ConversionAction =
  | 'keep_bedroom'
  | 'convert_to_bedroom'
  | 'add_ensuite'
  | 'keep_communal'
  | 'staff_room';

export interface ConversionStep {
  sourceLabel: string;
  sourceKind: FloorPlanRoomKind;
  action: ConversionAction;
  targetType: HmoRoomType;
  estimatedAreaSqM?: number;
  meetsSpaceStandard?: boolean;
  rationale: string;
  estimatedCostGbpLow: number;
  estimatedCostGbpHigh: number;
}

export interface GeometryConversionPlan {
  useCase: HmoUseCase;
  asBuiltBedrooms: number;
  proposedLettingRooms: number;
  steps: ConversionStep[];
  retainedCommunal: string[];
  blocked: string[];
}

export interface HmoLayoutScheme {
  id: string;
  useCase: HmoUseCase;
  title: string;
  summary: string;
  lettingRooms: number;
  rooms: HmoLayoutRoom[];
  amenities: string[];
  complianceNotes: string[];
  layoutNotes: string[];
  estimatedRefurbLowGbp: number;
  estimatedRefurbHighGbp: number;
  financials: HmoSchemeFinancials;
  licensing: HmoLicensingPath;
  fireEscape?: HmoFireEscapeAssessment;
  refurbBoq?: HmoRefurbBoq;
  conversionPlan?: GeometryConversionPlan;
  fitScore: number;
  recommended: boolean;
}

export type RefurbBoqCategory =
  | 'room_fabric'
  | 'conversion'
  | 'ensuite_wetroom'
  | 'kitchen_communal'
  | 'bathroom'
  | 'fire_compliance'
  | 'care_adaptations'
  | 'contingency';

export type RefurbBoqLineSource =
  | 'base_allowance'
  | 'conversion_step'
  | 'fire_checklist'
  | 'use_case';

export interface RefurbBoqLineItem {
  id: string;
  category: RefurbBoqCategory;
  label: string;
  quantity: number;
  unit?: string;
  lowGbp: number;
  highGbp: number;
  notes?: string;
  source: RefurbBoqLineSource;
}

export interface HmoRefurbBoq {
  lineItems: RefurbBoqLineItem[];
  subtotalLowGbp: number;
  subtotalHighGbp: number;
  totalLowGbp: number;
  totalHighGbp: number;
  contingencyPct: number;
  notes: string[];
  disclaimer: string;
}

export type FireCheckStatus =
  | 'likely_ok'
  | 'likely_required'
  | 'check_on_site'
  | 'not_assessed';

export type FireRiskBand = 'lower' | 'medium' | 'higher';

export type FireAssessmentConfidence = 'high' | 'medium' | 'low';

export type FireStoreySource =
  | 'floor_plan_rooms'
  | 'listing_heuristic'
  | 'loft_adjusted';

export interface FireChecklistItem {
  id: string;
  title: string;
  status: FireCheckStatus;
  detail: string;
}

export interface HmoFireEscapeAssessment {
  estimatedStoreys: number;
  storeySource: FireStoreySource;
  riskBand: FireRiskBand;
  items: FireChecklistItem[];
  actionItems: string[];
  visionNotes?: string;
  confidence: FireAssessmentConfidence;
  disclaimer: string;
}

export interface FloorPlanDetectedRoom {
  label: string;
  kind: FloorPlanRoomKind;
  floor?: string;
  widthM?: number;
  lengthM?: number;
  areaSqM?: number;
  ensuite?: boolean;
  notes?: string;
}

export interface FloorPlanExtensionPotential {
  loft: boolean;
  rear: boolean;
  garage: boolean;
}

export interface FloorPlanAnalysis {
  currentBedrooms: number;
  currentBathrooms: number;
  rooms: FloorPlanDetectedRoom[];
  potentialExtraBedrooms: number;
  convertibleRooms: string[];
  extensionPotential: FloorPlanExtensionPotential;
  fireEscapeNotes?: string;
  layoutEfficiencyScore?: number;
  notes: string[];
  analysedFloorPlanUrls: string[];
  model: string;
  stub?: boolean;
}

export interface HmoMoneySnapshot {
  label: string;
  askingPrice?: number;
  estimatedRentMonthly?: number;
  grossYield?: number;
  netCashFlowAnnual?: number;
  estimatedRoi?: number;
  voidRateAssumed: number;
  occupancyBasis: string;
}

export interface HmoMoneyDelta {
  monthlyRentGbp: number;
  grossYieldPts: number;
  netCashFlowAnnualGbp: number;
  estimatedRoiPts: number;
}

export interface HmoMoneyComparison {
  asListedFamily: HmoMoneySnapshot;
  bestHmo: HmoMoneySnapshot & {
    schemeId: string;
    schemeTitle: string;
  };
  delta: HmoMoneyDelta;
  notes: string[];
}

export interface HmoPlannerResult {
  source: 'listing_beds' | 'floor_plan_vision';
  floorPlanCount: number;
  asListedBedrooms: number;
  asListedBathrooms: number;
  floorPlanAnalysis?: FloorPlanAnalysis;
  schemes: HmoLayoutScheme[];
  recommendedSchemeId: string;
  moneyComparison?: HmoMoneyComparison;
  disclaimer: string;
}

export interface EpcHistoryEntry {
  address?: string;
  currentRating?: string;
  lodgementDate?: string;
  certificateNumber?: string;
}

export interface EpcEnrichment {
  postcode: string;
  currentRating?: string;
  potentialRating?: string;
  currentScore?: number;
  potentialScore?: number;
  address?: string;
  lodgementDate?: string;
  matchedCount: number;
  notes: string;
  stub?: boolean;
  history?: EpcHistoryEntry[];
}

export interface SoldComparable {
  pricePaid?: number;
  transactionDate?: string;
  address?: string;
}

export interface SoldPricesEnrichment {
  postcode: string;
  averageSoldPrice12m?: number;
  medianSoldPrice?: number;
  comparableCount: number;
  latestSaleDate?: string;
  notes: string;
  stub?: boolean;
  comparables?: SoldComparable[];
}

export interface BroadbandEnrichment {
  postcode: string;
  maxDownloadMbps?: number;
  fibreAvailable?: boolean;
  notes: string;
  stub?: boolean;
}

export interface PlanningEnrichment {
  postcode: string;
  article4?: boolean;
  article4Names?: string[];
  conservationArea?: boolean;
  listedBuildingNearby?: boolean;
  floodRiskZones?: string[];
  notes?: string;
}

export interface MarketEnrichment {
  postcode: string;
  region?: string;
  estimatedRoomRentWeekly: number;
  doubleRoomRentWeekly?: number;
  ensuiteRoomRentWeekly?: number;
  hmoSaturationIndex: number;
  voidRisk: 'low' | 'medium' | 'high';
  sampleSize?: number;
  notes: string;
  stub?: boolean;
}

export interface CrimeEnrichment {
  postcode: string;
  latitude: number;
  longitude: number;
  crimesLast12m: number;
  crimeRatePer1000: number;
  dominantCategories: string[];
  monthsSampled: number;
  notes: string;
}

export interface TransportEnrichment {
  postcode: string;
  latitude: number;
  longitude: number;
  nearestStationMinutes?: number;
  nearestStationName?: string;
  nearestStationMeters?: number;
  busStopCountWithin500m: number;
  notes: string;
  stub?: boolean;
}

export interface NearbySchool {
  name: string;
  miles: number;
}

export interface SchoolsEnrichment {
  postcode: string;
  latitude: number;
  longitude: number;
  schoolCountWithin2Miles: number;
  nearestPrimaryMiles?: number;
  nearestSchoolName?: string;
  nearbySchools: NearbySchool[];
  notes: string;
  stub?: boolean;
}

export interface DemographicsEnrichment {
  postcode: string;
  adminDistrict?: string;
  region?: string;
  parish?: string;
  lsoa?: string;
  msoa?: string;
  ruralUrban?: string;
  imdDecile?: number;
  imdRank?: number;
  notes: string;
  stub?: boolean;
}

export interface DealEnrichment {
  epc?: EpcEnrichment;
  soldPrices?: SoldPricesEnrichment;
  broadband?: BroadbandEnrichment;
  planning?: PlanningEnrichment;
  market?: MarketEnrichment;
  crime?: CrimeEnrichment;
  transport?: TransportEnrichment;
  schools?: SchoolsEnrichment;
  demographics?: DemographicsEnrichment;
}

export interface DealSummary {
  dealId: string;
  status: DealStatus;
  listingUrl: string;
  scores?: ScoreBreakdown;
  listing?: PropertyListingSummary;
  createdAt: string;
  updatedAt: string;
}

export interface DealDetail extends DealSummary {
  financialModel?: FinancialModel;
  enrichment?: DealEnrichment;
  hmoPlanner?: HmoPlannerResult;
  narrative?: string;
  actionPlan?: string[];
  errorMessage?: string;
}

export interface DealsListResponse {
  deals: DealSummary[];
}

export interface DealPdfResponse {
  dealId: string;
  reportUrl: string;
  expiresInSeconds: number;
}

export interface BillingSummaryResponse {
  email: string;
  tier: UserTier;
  creditsRemaining: number;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  monthlyAllowance: number;
}

export interface CreateCheckoutRequest {
  product: CheckoutProduct;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface CreatePortalResponse {
  portalUrl: string;
}

export interface ApiErrorBody {
  error: string;
}

export interface DealUpdateSocketMessage {
  type: 'DEAL_UPDATE';
  jobId: string;
  status: 'COMPLETED';
  scores: ScoreBreakdown;
  reportUrl?: string;
}
