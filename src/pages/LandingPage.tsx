import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaqSection } from '@/components/landing/FaqSection';
import { FeatureHighlights } from '@/components/landing/FeatureHighlights';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingHero } from '@/components/landing/LandingHero';
import { PlansTeaser } from '@/components/landing/PlansTeaser';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { TryItPanel } from '@/components/landing/TryItPanel';

export function LandingPage() {
  const { hash } = useLocation();

  // Anchors such as /#faq arrive from the header on other routes, where the
  // browser cannot scroll to a section that had not rendered yet.
  useEffect(() => {
    if (!hash) {
      return;
    }
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <Stack spacing={{ xs: 6, md: 9 }} pt={{ xs: 1, md: 3 }} pb={{ xs: 4, md: 6 }}>
      <LandingHero />
      <TryItPanel />
      <HowItWorks />
      <FeatureHighlights />
      <TestimonialsSection />
      <PlansTeaser />
      <FaqSection />
    </Stack>
  );
}
