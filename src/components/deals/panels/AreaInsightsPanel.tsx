import { Chip, Stack, Typography } from '@mui/material';
import { Fact } from '@/components/deals/common/Fact';
import { formatCurrency } from '@/lib/format';
import type {
  BroadbandEnrichment,
  CrimeEnrichment,
  DemographicsEnrichment,
  MarketEnrichment,
  PlanningEnrichment,
} from '@/models';

interface AreaInsightsPanelProps {
  broadband?: BroadbandEnrichment;
  planning?: PlanningEnrichment;
  market?: MarketEnrichment;
  crime?: CrimeEnrichment;
  demographics?: DemographicsEnrichment;
}

function weeklyRent(value: number | undefined): string {
  if (value == null) {
    return '—';
  }
  return `${formatCurrency(value)} / wk`;
}

export function AreaInsightsPanel({
  broadband,
  planning,
  market,
  crime,
  demographics,
}: AreaInsightsPanelProps) {
  if (!broadband && !planning && !market && !crime && !demographics) {
    return null;
  }

  return (
    <Stack spacing={2.5}>
      {market ? (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" color="primary.dark">
              Room rents
            </Typography>
            {market.stub ? <Chip label="Estimated" size="small" /> : null}
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Fact
              label="Est. room rent"
              value={weeklyRent(market.estimatedRoomRentWeekly)}
              info="Indicative weekly rent for a typical single letting room in this area. Used as a baseline for HMO income screening."
            />
            <Fact
              label="Double room"
              value={weeklyRent(market.doubleRoomRentWeekly)}
              info="Indicative weekly rent where the room can sleep two people."
            />
            <Fact
              label="Ensuite double"
              value={weeklyRent(market.ensuiteRoomRentWeekly)}
              info="Indicative weekly rent for a double room with a private bathroom."
            />
            <Fact
              label="Void risk"
              value={market.voidRisk}
              info="Relative risk of empty rooms between tenancies. Higher void risk means more downtime and lower effective income."
            />
            <Fact
              label="HMO saturation"
              value={`${Math.round(market.hmoSaturationIndex * 100)}%`}
              info="How saturated the local market appears for HMO / room lets. Higher saturation can mean more competition for tenants."
            />
            {market.region ? (
              <Fact label="Region" value={market.region} />
            ) : null}
          </Stack>
        </Stack>
      ) : null}

      {broadband ? (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" color="primary.dark">
              Broadband
            </Typography>
            {broadband.stub ? <Chip label="Estimated" size="small" /> : null}
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Fact
              label="Max download"
              value={
                broadband.maxDownloadMbps != null
                  ? `${broadband.maxDownloadMbps} Mbps`
                  : '—'
              }
              info="Estimated maximum download speed available at or near the property."
            />
            <Fact
              label="Fibre"
              value={
                broadband.fibreAvailable == null
                  ? '—'
                  : broadband.fibreAvailable
                    ? 'Available'
                    : 'Not indicated'
              }
              info="Whether fibre broadband is indicated as available for this location."
            />
          </Stack>
        </Stack>
      ) : null}

      {planning ? (
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="primary.dark">
            Planning
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Fact
              label="Article 4"
              value={
                planning.article4 == null
                  ? '—'
                  : planning.article4
                    ? 'Yes'
                    : 'No'
              }
              info="Article 4 directions can remove permitted development rights, so converting a house to a small HMO may need full planning permission."
            />
            <Fact
              label="Conservation area"
              value={
                planning.conservationArea == null
                  ? '—'
                  : planning.conservationArea
                    ? 'Yes'
                    : 'No'
              }
              info="Properties in conservation areas often face stricter controls on alterations, extensions, and external changes."
            />
            <Fact
              label="Listed nearby"
              value={
                planning.listedBuildingNearby == null
                  ? '—'
                  : planning.listedBuildingNearby
                    ? 'Yes'
                    : 'No'
              }
              info="A listed building nearby can add design and consent constraints that affect works or conversion plans."
            />
            <Fact
              label="Flood risk zones"
              value={
                planning.floodRiskZones && planning.floodRiskZones.length > 0
                  ? planning.floodRiskZones.join(', ')
                  : 'None noted'
              }
              info="Recorded flood-risk designations for the location. Higher risk can affect insurance, lending, and long-term resilience."
            />
          </Stack>
        </Stack>
      ) : null}

      {crime ? (
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="primary.dark">
            Crime
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Fact
              label="Crimes (est. 12m)"
              value={String(crime.crimesLast12m)}
              info="Estimated crime count over about 12 months, annualised from the sampled months of police data."
            />
            <Fact
              label="Crime rate / 1000"
              value={String(crime.crimeRatePer1000)}
              info="Estimated crimes per 1,000 people in the area, for comparing relative crime levels."
            />
            <Fact
              label="Months sampled"
              value={String(crime.monthsSampled)}
              info="How many months of police data were used to build the estimate."
            />
            <Fact
              label="Top categories"
              value={
                crime.dominantCategories.length > 0
                  ? crime.dominantCategories.join(', ')
                  : 'None noted'
              }
              info="The most common crime categories in the sample for this location."
            />
          </Stack>
        </Stack>
      ) : null}

      {demographics ? (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" color="primary.dark">
              Demographics
            </Typography>
            {demographics.stub ? <Chip label="Estimated" size="small" /> : null}
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Fact
              label="Admin district"
              value={demographics.adminDistrict ?? '—'}
              info="Local authority / administrative district for the postcode."
            />
            <Fact label="Region" value={demographics.region ?? '—'} />
            <Fact label="Parish" value={demographics.parish ?? '—'} />
            <Fact
              label="Rural/urban"
              value={demographics.ruralUrban ?? '—'}
              info="Official rural–urban classification for the area, which can affect demand and tenant mix."
            />
            <Fact
              label="IMD decile"
              value={
                demographics.imdDecile != null
                  ? String(demographics.imdDecile)
                  : '—'
              }
              info="Index of Multiple Deprivation decile (1 = most deprived, 10 = least). Useful context for demand and social-care schemes."
            />
            <Fact
              label="IMD rank"
              value={
                demographics.imdRank != null
                  ? String(demographics.imdRank)
                  : '—'
              }
              info="National IMD rank for the neighbourhood. Lower ranks are more deprived."
            />
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
}
