import { Chip, Stack, Typography } from '@mui/material';
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="primary.main">
        {label}
      </Typography>
      <Typography fontWeight={600} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  );
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
            />
            <Fact
              label="Double room"
              value={weeklyRent(market.doubleRoomRentWeekly)}
            />
            <Fact
              label="Ensuite double"
              value={weeklyRent(market.ensuiteRoomRentWeekly)}
            />
            <Fact label="Void risk" value={market.voidRisk} />
            <Fact
              label="HMO saturation"
              value={`${Math.round(market.hmoSaturationIndex * 100)}%`}
            />
            {market.region ? (
              <Fact label="Region" value={market.region} />
            ) : null}
          </Stack>
          {market.notes ? (
            <Typography variant="caption" color="text.secondary">
              {market.notes}
            </Typography>
          ) : null}
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
            />
          </Stack>
          {broadband.notes ? (
            <Typography variant="caption" color="text.secondary">
              {broadband.notes}
            </Typography>
          ) : null}
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
            />
            <Fact
              label="Flood risk zones"
              value={
                planning.floodRiskZones && planning.floodRiskZones.length > 0
                  ? planning.floodRiskZones.join(', ')
                  : 'None noted'
              }
            />
          </Stack>
          {planning.notes ? (
            <Typography variant="caption" color="text.secondary">
              {planning.notes}
            </Typography>
          ) : null}
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
            />
            <Fact
              label="Crime rate / 1000"
              value={String(crime.crimeRatePer1000)}
            />
            <Fact
              label="Months sampled"
              value={String(crime.monthsSampled)}
            />
            <Fact
              label="Top categories"
              value={
                crime.dominantCategories.length > 0
                  ? crime.dominantCategories.join(', ')
                  : 'None noted'
              }
            />
          </Stack>
          {crime.notes ? (
            <Typography variant="caption" color="text.secondary">
              {crime.notes}
            </Typography>
          ) : null}
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
            />
            <Fact label="Region" value={demographics.region ?? '—'} />
            <Fact label="Parish" value={demographics.parish ?? '—'} />
            <Fact
              label="Rural/urban"
              value={demographics.ruralUrban ?? '—'}
            />
            <Fact
              label="IMD decile"
              value={
                demographics.imdDecile != null
                  ? String(demographics.imdDecile)
                  : '—'
              }
            />
            <Fact
              label="IMD rank"
              value={
                demographics.imdRank != null
                  ? String(demographics.imdRank)
                  : '—'
              }
            />
            <Fact label="LSOA" value={demographics.lsoa ?? '—'} />
            <Fact label="MSOA" value={demographics.msoa ?? '—'} />
          </Stack>
          {demographics.notes ? (
            <Typography variant="caption" color="text.secondary">
              {demographics.notes}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
