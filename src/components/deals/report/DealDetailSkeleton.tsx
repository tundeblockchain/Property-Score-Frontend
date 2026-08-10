import { Box, Divider, Paper, Skeleton, Stack } from '@mui/material';

const KPI_TILE_COUNT = 4;
const SECTION_COUNT = 4;

/**
 * Mirrors the shape of the loaded report — header, hero and section list — so
 * the page does not jump when the data arrives.
 */
export function DealDetailSkeleton() {
  return (
    <Stack spacing={3} role="status" aria-label="Loading property">
      <Stack spacing={1}>
        <Skeleton variant="text" width={120} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
        >
          <Skeleton variant="text" width="60%" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="rounded" width={148} height={36} />
        </Stack>
        <Skeleton variant="text" width={220} />
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Skeleton
              variant="rounded"
              sx={{
                width: { xs: '100%', sm: 200 },
                aspectRatio: '4 / 3',
                flexShrink: 0,
              }}
            />
            <Stack spacing={1.5} sx={{ flex: 1, width: '100%' }}>
              <Skeleton variant="text" width="40%" sx={{ fontSize: '1.5rem' }} />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={72} height={24} />
                <Skeleton variant="rounded" width={64} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Stack>
              <Skeleton variant="text" width={140} />
            </Stack>
            <Skeleton variant="circular" width={132} height={132} />
          </Stack>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: `repeat(${KPI_TILE_COUNT}, minmax(0, 1fr))`,
              },
            }}
          >
            {Array.from({ length: KPI_TILE_COUNT }, (_, index) => (
              <Stack key={index} spacing={0.5}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" sx={{ fontSize: '1.5rem' }} />
              </Stack>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {Array.from({ length: SECTION_COUNT }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={64} />
        ))}
      </Stack>
    </Stack>
  );
}
