import { Stack } from '@mui/material';
import type { HmoLayoutScheme } from '@/models';
import { NoteList } from './NoteList';

interface SchemeNotesSectionProps {
  scheme: HmoLayoutScheme;
}

export function SchemeNotesSection({ scheme }: SchemeNotesSectionProps) {
  return (
    <Stack spacing={2}>
      <NoteList title="Amenities" items={scheme.amenities} />
      <NoteList title="Layout notes" items={scheme.layoutNotes} />
      <NoteList title="Compliance checks" items={scheme.complianceNotes} />
    </Stack>
  );
}
