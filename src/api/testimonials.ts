import { publicGet } from '@/api/client';
import type { ListTestimonialsResponse } from '@/models';

export function listPublishedTestimonials(): Promise<ListTestimonialsResponse> {
  return publicGet<ListTestimonialsResponse>('/api/testimonials');
}
