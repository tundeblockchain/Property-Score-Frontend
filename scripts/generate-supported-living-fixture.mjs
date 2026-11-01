/**
 * Emit src/test/fixtures/supported-living-scheme.json from the Property-Score
 * planner formula at e02603b:
 *   annualRentGbp = round(weeklyRentPerRoomGbp * lettingRooms * 52)
 *
 * Backend defaults (review 5729319073 / types.ts): leaseTermYears=5,
 * breakYear=3, cpiUpliftPct=2, planningNote =
 * 'Sleep-in staff may need C2 planning permission.'
 *
 * When Property-Score is available, prefer replacing this JSON with the
 * social_care scheme from `buildHmoPlanner` on main@e02603b verbatim:
 *   checkout tundeblockchain/Property-Score @ e02603b
 *   run buildHmoPlanner for a social_care scheme and copy that scheme object
 *
 * Usage: node scripts/generate-supported-living-fixture.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LETTING_ROOMS = 4;
const WEEKLY_RENT = 280;
const TERM_YEARS = 5;
const CPI_UPLIFT_PCT = 2;

function leaseRentByYear() {
  const rows = [];
  let weekly = WEEKLY_RENT;
  for (let year = 1; year <= TERM_YEARS; year += 1) {
    rows.push({
      year,
      weeklyRentPerRoomGbp: weekly,
      annualRentGbp: Math.round(weekly * LETTING_ROOMS * 52),
    });
    weekly *= 1 + CPI_UPLIFT_PCT / 100;
  }
  return rows;
}

const scheme = {
  id: 'social_care',
  useCase: 'social_care',
  title: 'Supported living · 4-bed supported living',
  summary: 'Four supported-living rooms on a leased FRI contract.',
  lettingRooms: LETTING_ROOMS,
  rooms: [
    {
      id: 'room-1',
      label: 'Bedroom 1',
      type: 'double',
      estimatedAreaSqM: 12.4,
      meetsSpaceStandard: true,
    },
    {
      id: 'room-2',
      label: 'Bedroom 2',
      type: 'double',
      estimatedAreaSqM: 11.1,
      meetsSpaceStandard: true,
    },
    {
      id: 'room-3',
      label: 'Bedroom 3',
      type: 'single',
      estimatedAreaSqM: 8.2,
      meetsSpaceStandard: true,
    },
    {
      id: 'room-staff',
      label: 'Staff room',
      type: 'staff',
      estimatedAreaSqM: 7.2,
      meetsSpaceStandard: false,
      notes: 'Retained for overnight cover.',
    },
  ],
  amenities: ['Shared kitchen', 'Staff wet room'],
  complianceNotes: ['Sleep-in staff may need C2 planning permission.'],
  layoutNotes: ['Smallest rear bedroom reserved as the staff room.'],
  estimatedRefurbLowGbp: 40000,
  estimatedRefurbHighGbp: 65000,
  financials: {
    askingPrice: 250000,
    estimatedRentMonthly: 4846,
    grossYield: 23.3,
    netCashFlowAnnual: 18600,
    estimatedRoi: 9.1,
    voidRateAssumed: 0.04,
    roomRentWeeklyAssumed: WEEKLY_RENT,
    occupiedRoomsAssumed: LETTING_ROOMS,
  },
  supportedLiving: {
    inputs: {
      rentPerRoomWeekly: { value: WEEKLY_RENT, isEstimate: true },
      leaseTermYears: { value: TERM_YEARS, isEstimate: true },
      breakYear: { value: 3, isEstimate: true },
      cpiUpliftPct: { value: CPI_UPLIFT_PCT, isEstimate: true },
      fri: { value: true, isEstimate: false },
      vacantPossessionValueGbp: { value: 275000, isEstimate: true },
      refurbLowGbp: { value: 40000, isEstimate: true },
      refurbHighGbp: { value: 65000, isEstimate: true },
      complianceLumpSumGbp: { value: 12000, isEstimate: true },
      staffEnsuiteRentPremiumWeekly: { value: 25, isEstimate: true },
    },
    leaseRentByYear: leaseRentByYear(),
    yieldOnVacantPossession: 8.4,
    premiumOverNormalLetAnnualGbp: 18600,
    providerFailureNetCashFlowAnnual: -4200,
    staffRoomOption: 'with_ensuite',
    staffRoomOptionReason:
      'Overnight cover needs a staff room; the 7.2 m² rear single is below the letting space standard. An ensuite keeps staff self-contained and lifts rent enough to cover the wet-room cost.',
    staffRoomOptions: {
      withEnsuite: { netCashFlowAnnual: 18600, estimatedRoi: 9.1 },
      withoutEnsuite: { netCashFlowAnnual: 14200, estimatedRoi: 8.2 },
    },
    riskBadge: 'Provider / regulatory risk: Medium-High',
    planningNote: 'Sleep-in staff may need C2 planning permission.',
  },
  licensing: {
    useClass: 'unclear',
    occupancyBand: 'care_model',
    estimatedOccupants: 4,
    planningPermission: {
      status: 'check_with_la',
      reason: 'Sleep-in staff may need C2 planning permission.',
    },
    mandatoryLicence: {
      status: 'not_applicable',
      reason: 'Care-model occupancy is outside mandatory HMO licensing.',
    },
    additionalLicence: {
      status: 'not_applicable',
      reason: 'Not an HMO once used as supported living.',
    },
    actionItems: ['Confirm the use class with the local planning authority.'],
    confidence: 'medium',
    disclaimer: 'Indicative only.',
  },
  fireEscape: {
    estimatedStoreys: 2,
    storeySource: 'floor_plan_rooms',
    riskBand: 'medium',
    alarmGrade: 'LD1',
    items: [
      {
        id: 'fire-ld1',
        title: 'LD1 / Grade A alarm',
        status: 'likely_required',
        detail: 'Supported living typically needs a Grade A LD1 system.',
      },
    ],
    actionItems: ['Budget for a Grade A LD1 alarm.'],
    confidence: 'medium',
    disclaimer: 'Indicative only.',
  },
  refurbBoq: {
    lineItems: [
      {
        id: 'boq-ensuite',
        category: 'ensuite_wetroom',
        label: 'Staff ensuite wet room',
        quantity: 1,
        unit: 'item',
        lowGbp: 6500,
        highGbp: 9000,
        source: 'use_case',
      },
      {
        id: 'boq-override',
        category: 'override',
        label: 'Staff ensuite already present — omit wet room',
        quantity: 1,
        lowGbp: -6500,
        highGbp: -6500,
        notes: 'Negative override because the listing already has a staff wet room.',
        source: 'override',
      },
    ],
    subtotalLowGbp: 0,
    subtotalHighGbp: 2500,
    totalLowGbp: 0,
    totalHighGbp: 2750,
    contingencyPct: 0.1,
    notes: ['Override removes the ensuite line when the wet room is already built.'],
    disclaimer: 'Indicative only.',
  },
  conversionPlan: {
    useCase: 'social_care',
    asBuiltBedrooms: 4,
    proposedLettingRooms: 4,
    steps: [
      {
        id: 'step-staff',
        sourceLabel: 'Rear single',
        sourceKind: 'bedroom',
        action: 'staff_room',
        targetType: 'staff',
        estimatedAreaSqM: 7.2,
        rationale:
          'Overnight cover needs a staff room; the 7.2 m² rear single is below the letting space standard and sits next to the bathroom.',
        estimatedCostGbpLow: 0,
        estimatedCostGbpHigh: 400,
      },
    ],
    retainedCommunal: ['Kitchen'],
    blocked: [],
  },
  fitScore: 71,
  recommended: false,
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src/test/fixtures/supported-living-scheme.json',
);
writeFileSync(`${out}`, `${JSON.stringify(scheme, null, 2)}\n`);
process.stdout.write(`Wrote ${out}\n`);
