import { useQuery } from '@tanstack/react-query';
import { listPublishedTestimonials } from '@/api/testimonials';
import { queryKeys } from '@/hooks/queryKeys';

export function usePublishedTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: listPublishedTestimonials,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
