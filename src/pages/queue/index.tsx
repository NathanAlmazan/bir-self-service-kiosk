import * as React from "react";
// MUI
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// Components
import { Scrollbar } from "src/components/scrollbar";
import QueueTableToolbar from "./table-toolbar";
import QueueTableHead from "./table-head";
// Icons
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { StringValueToken } from "html2canvas/dist/types/css/syntax/tokenizer";

export type Queue = {
  id: string;
  firstName: string;
  lastName: string;
  rdo: string;
  receiptUrl: string;
  service: "REGISTRATION" | "FILING & PAYMENT" | "CERTIFICATE & CLEARANCE";
  transaction: string;
  complete: boolean;
  verified: boolean;
  submittedAt: Date;
};

export type QueueTableRow = {
  id: string;
  name: string;
  rdo: string;
  transaction: {
    name: string;
    service: string;
  };
  status: "COMPLETE REQUIREMENTS" | "INCOMPLETE REQUIREMENTS" | "TRANSACTION STARTED";
  submittedAt: Date;
  receiptUrl: string;
};

export default function QueuePage() {
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('submittedAt');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterQuery, setFilterQuery] = React.useState("");
  const [filteredQueue, setFilteredQueue] = React.useState<QueueTableRow[]>([]);



  const handleFilterQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ zIndex: 2 }}>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Transactin Queue
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<QrCodeScannerIcon />}
        >
          Scan Receipt
        </Button>
      </Box>
      <Card>
        <QueueTableToolbar
          filterQuery={filterQuery}
          handleFilterChange={handleFilterQueryChange}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <QueueTableHead
                orderBy=""
                order="asc"
                headLabel={[
                  { id: 'id', label: 'Queue No.' },
                  { id: 'name', label: 'Name' },
                  { id: 'rdo', label: 'Revenue District' },
                  { id: 'transaction', label: 'Transaction' },
                  { id: 'status', label: 'Status' },
                  { id: 'submittedAt', label: 'Datetime Submitted' },
                  { id: 'receipt', label: '', align: 'right' }
                ]}
                handleSort={() => { }}
              />
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}