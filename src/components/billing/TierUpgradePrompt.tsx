import type { ReactNode } from 'react';
import { TierLockedOverlay } from '@/components/billing/TierLockedOverlay';

interface TierUpgradePromptProps {
  title: string;
  description: string;
  /** Optional preview content shown blurred beneath the upgrade prompt. */
  preview?: ReactNode;
}

export function TierUpgradePrompt({ title, description, preview }: TierUpgradePromptProps) {
  if (preview) {
    return (
      <TierLockedOverlay title={title} description={description}>
        {preview}
      </TierLockedOverlay>
    );
  }

  return (
    <TierLockedOverlay title={title} description={description}>
      <div style={{ minHeight: 48 }} />
    </TierLockedOverlay>
  );
}
