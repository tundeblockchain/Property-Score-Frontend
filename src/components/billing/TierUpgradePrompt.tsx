import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface TierUpgradePromptProps {
  title: string;
  description: string;
}

export function TierUpgradePrompt({ title, description }: TierUpgradePromptProps) {
  return (
    <Alert
      severity="info"
      action={
        <Button component={RouterLink} to="/pricing" color="inherit" size="small">
          View plans
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
      </Stack>
    </Alert>
  );
}
