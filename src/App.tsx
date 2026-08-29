import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingState } from '@/components/common/Feedback';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PricingPage } from '@/pages/PricingPage';

const AnalysePage = lazy(() =>
  import('@/pages/AnalysePage').then((module) => ({
    default: module.AnalysePage,
  })),
);
const DealsPage = lazy(() =>
  import('@/pages/DealsPage').then((module) => ({
    default: module.DealsPage,
  })),
);
const DealDetailPage = lazy(() =>
  import('@/pages/DealDetailPage').then((module) => ({
    default: module.DealDetailPage,
  })),
);
const BillingPage = lazy(() =>
  import('@/pages/BillingPage').then((module) => ({
    default: module.BillingPage,
  })),
);
const BillingSuccessPage = lazy(() =>
  import('@/pages/BillingReturnPages').then((module) => ({
    default: module.BillingSuccessPage,
  })),
);
const BillingCancelPage = lazy(() =>
  import('@/pages/BillingReturnPages').then((module) => ({
    default: module.BillingCancelPage,
  })),
);
const AccountPage = lazy(() =>
  import('@/pages/AccountPage').then((module) => ({
    default: module.AccountPage,
  })),
);

export function App() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingState label="Loading page…" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/analyse" element={<AnalysePage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/:dealId" element={<DealDetailPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/billing/success" element={<BillingSuccessPage />} />
          <Route path="/billing/cancel" element={<BillingCancelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
