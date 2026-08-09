import { Stack, Typography } from '@mui/material';

interface NoteListProps {
  title?: string;
  items: string[];
}

export function NoteList({ title, items }: NoteListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Stack spacing={0.75}>
      {title ? (
        <Typography variant="subtitle2" color="primary.dark">
          {title}
        </Typography>
      ) : null}
      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            variant="body2"
            color="primary.dark"
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
