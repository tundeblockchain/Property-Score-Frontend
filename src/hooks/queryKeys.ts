export const queryKeys = {
  billing: ['billing'] as const,
  deals: ['deals'] as const,
  deal: (dealId: string) => ['deals', dealId] as const,
  schemeRender: (dealId: string, schemeId: string) =>
    ['deals', dealId, 'render', schemeId] as const,
  analysis: (jobId: string) => ['analysis', jobId] as const,
};
