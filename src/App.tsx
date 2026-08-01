import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AnalysePage } from '@/pages/AnalysePage';
import { BillingPage } from '@/pages/BillingPage';
import {
  BillingCancelPage,
  BillingSuccessPage,
} from '@/pages/BillingReturnPages';
import { DealDetailPage } from '@/pages/DealDetailPage';
import { DealsPage } from '@/pages/DealsPage';
import { LoginPage } from '@/pages/LoginPage';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AnalysePage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deals/:dealId" element={<DealDetailPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/success" element={<BillingSuccessPage />} />
          <Route path="/billing/cancel" element={<BillingCancelPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
