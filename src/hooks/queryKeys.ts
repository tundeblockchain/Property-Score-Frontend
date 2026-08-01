export const queryKeys = {
  billing: ['billing'] as const,
  deals: ['deals'] as const,
  deal: (dealId: string) => ['deals', dealId] as const,
  analysis: (jobId: string) => ['analysis', jobId] as const,
};
