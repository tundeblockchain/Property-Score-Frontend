import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { ReportSectionSpec } from '@/components/deals/report/reportSections';
import { useSectionInView } from '@/hooks/useSectionInView';

interface ReportNavProps {
  sections: readonly ReportSectionSpec[];
  /** Called before the anchor jump, so a collapsed target can be opened. */
  onSelect: (id: string) => void;
  sx?: SxProps<Theme>;
}

export function ReportNav({ sections, onSelect, sx }: ReportNavProps) {
  /**
   * Tracked here rather than by the report, so scrolling only re-renders this
   * list instead of every open section.
   */
  const activeId = useSectionInView(sections.map((section) => section.id));

  if (sections.length === 0) {
    return null;
  }

  return (
    <Box
      component="nav"
      aria-label="Report sections"
      sx={[
        {
          position: 'sticky',
          top: '88px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <List disablePadding dense>
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const Icon = section.icon;

          return (
            <ListItem key={section.id} disablePadding>
              <ListItemButton
                component="a"
                href={`#${section.id}`}
                onClick={() => onSelect(section.id)}
                aria-current={isActive ? 'true' : undefined}
                sx={{
                  borderRadius: 1,
                  gap: 1,
                  color: isActive ? 'primary.dark' : 'text.secondary',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                }}
              >
                <Icon fontSize="small" aria-hidden />
                <ListItemText
                  primary={section.title}
                  slotProps={{
                    primary: {
                      variant: 'body2',
                      fontWeight: isActive ? 700 : 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
