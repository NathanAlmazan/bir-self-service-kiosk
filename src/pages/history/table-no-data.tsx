import type { TableRowProps } from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
};

export default function TableNoData({
  searchQuery,
  ...other
}: TableNoDataProps) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 3, textAlign: "center" }}>
          <img alt="no-content" width="280px" src="/bg/no-content.svg" />

          <Typography variant="h6" sx={{ mb: 1 }}>
            No Data Found
          </Typography>

          {searchQuery.length > 0 ? (
            <Typography variant="body2">
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> Try checking for typos or using complete words.
          </Typography>
          ) : (
            <Typography variant="body2">
              There is no data yet.
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
