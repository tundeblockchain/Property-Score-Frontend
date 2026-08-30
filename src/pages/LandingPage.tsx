import { Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ScrollToHash } from '@/components/common/ScrollToHash';
import { FaqSection } from '@/components/landing/FaqSection';
import { FeatureHighlights } from '@/components/landing/FeatureHighlights';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LandingHero } from '@/components/landing/LandingHero';
import { PlansTeaser } from '@/components/landing/PlansTeaser';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { TryItPanel } from '@/components/landing/TryItPanel';

export function LandingPage() {
  const { hash } = useLocation();

  return (
    <>
      <Stack spacing={{ xs: 6, md: 9 }} pt={{ xs: 1, md: 3 }} pb={{ xs: 4, md: 6 }}>
        <LandingHero />
        <TryItPanel />
        <HowItWorks />
        <FeatureHighlights />
        <TestimonialsSection />
        <PlansTeaser />
        <FaqSection />
      </Stack>
      <ScrollToHash key={hash} hash={hash} />
    </>
  );
}
