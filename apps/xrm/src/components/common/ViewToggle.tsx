import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newView: 'table' | 'card' | null) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="table" aria-label="table view">
        <TableViewIcon />
      </ToggleButton>
      <ToggleButton value="card" aria-label="card view">
        <ViewModuleIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
