import { Label } from 'src/components/label';

import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined';
import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined';

// ----------------------------------------------------------------------

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <CandlestickChartOutlinedIcon />,
  },
  {
    title: 'Queue',
    path: '/queue',
    icon: <HorizontalSplitOutlinedIcon />,
    info: (
      <Label color="info" variant="inverted">
        +3 New
      </Label>
    ),
  },
  {
    title: 'Charter',
    path: '/charter',
    icon: <ClassOutlinedIcon />,
  },
];
