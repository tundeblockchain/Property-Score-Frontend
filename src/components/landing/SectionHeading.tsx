import { Stack, Typography } from '@mui/material';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <Stack spacing={1} maxWidth={640}>
      {eyebrow ? (
        <Typography
          variant="overline"
          color="primary.dark"
          fontWeight={700}
          letterSpacing="0.12em"
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
      {subtitle ? (
        <Typography color="text.secondary">{subtitle}</Typography>
      ) : null}
    </Stack>
  );
}
