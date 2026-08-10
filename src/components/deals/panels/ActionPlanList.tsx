import { List, ListItem, ListItemText } from '@mui/material';

interface ActionPlanListProps {
  items: string[];
}

export function ActionPlanList({ items }: ActionPlanListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem key={item} disableGutters alignItems="flex-start">
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
}
