import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

// ----------------------------------------------------------------------

type HeaderProps = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  minWidth?: number;
};

type QueueTableHeadProps = {
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (id: string) => void;
  headLabel: HeaderProps[];
};

export default function QueueTableHead({
  order,
  orderBy,
  headLabel,
  handleSort
}: QueueTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => handleSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{
                  border: 0,
                  margin: -1,
                  padding: 0,
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  clip: 'rect(0 0 0 0)',
                }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}