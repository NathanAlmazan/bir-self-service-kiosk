import * as React from "react";
// MUI
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
// Firebase
import { db } from "src/firebase";
import {
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
// Components
import { useRouter } from "src/routes/hooks";
import { Scrollbar } from "src/components/scrollbar";
import { useAppSelector } from "src/store/hooks";
import Fallback from "src/components/fallback";
import QueueTableToolbar from "./table-toolbar";
import QueueTableRow from "./table-row";
import QueueTableHead from "./table-head";
import TableNoData from "./table-no-data";
// Types
import { TransactionsStatus } from "src/pages/requirements/types";

const FilterDrawer = React.lazy(() => import("./filter-drawer"));

export type QueueRaw = {
  id: string;
  firstName: string;
  lastName: string;
  rdo: string;
  service: string;
  transaction: string;
  status: TransactionsStatus;
  submittedAt: Timestamp;
};

export type Queue = {
  id: string;
  name: string;
  rdo: string;
  transaction: string;
  status: TransactionsStatus;
  submittedAt: Date;
  search: string;
};

export default function QueuePage() {
  const { office } = useAppSelector((state) => state.user);

  // ================ Filter Drawer =================
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<Record<string, string>>({
    service: "ALL",
    status: "ALL",
  });

  const handleToggleFilter = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  // =============== Fetch Queue Data =================
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [rawQueue, setRawQueue] = React.useState<Queue[]>([]);

  React.useEffect(() => {
    const fetchQueue = async () => {
      try {
        setIsLoading(true);

        // get year range
        const now = new Date();
        // start of year
        const startYear = new Date(now.getFullYear(), 0, 1);
        // end of year
        const endYear = new Date(now.getFullYear(), 11, 31);

        const queryBuilder = [
          where("submittedAt", ">=", Timestamp.fromDate(startYear)),
          where("submittedAt", "<", Timestamp.fromDate(endYear)),
        ];

        if (office !== "Administrator") {
          queryBuilder.push(where("rdo", "==", office));
        }

        if (filter.service !== "ALL") {
          queryBuilder.push(where("service", "==", filter.service));
        }

        if (filter.status !== "ALL") {
          queryBuilder.push(where("status", "==", filter.status));
        }

        const unsubscribe = onSnapshot(
          query(collection(db, "taxpayers"), ...queryBuilder),
          (snapshot) => {
            const queueData: Queue[] = snapshot.docs.map((doc) => {
              const data = doc.data() as QueueRaw;
              return {
                id: doc.id,
                name: data.firstName + " " + data.lastName,
                rdo: data.rdo,
                transaction: data.service + " — " + data.transaction,
                status: data.status,
                submittedAt: data.submittedAt.toDate(),
                search: `${data.firstName} ${data.lastName} ${data.rdo} ${data.service} ${data.transaction}`,
              };
            });
            setRawQueue(queueData);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching transaction:", error);
        router.push("/500");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, [router, office, filter]);

  // ==================== Table Pagination ====================
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // =============== Sorting and Filtering =================
  const [filterQuery, setFilterQuery] = React.useState("");
  const [filteredQueue, setFilteredQueue] = React.useState<Queue[]>([]);
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Queue>("id");

  React.useEffect(() => {
    setIsLoading(true);

    const filtered = applyFilter({
      inputData: rawQueue,
      filterQuery,
      orderBy,
      order,
    });

    setFilteredQueue(filtered);
    setIsLoading(false);
    setPage(0);
  }, [rawQueue, filterQuery, orderBy, order]);

  const handleSort = React.useCallback(
    (id: keyof Queue, disable: boolean) => {
      if (!disable) {
        const isAsc = orderBy === id && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  return (
    <>
      {isLoading ? (
        <Fallback />
      ) : (
        <Container maxWidth="lg" sx={{ zIndex: 2, marginBottom: 8 }}>
          <Box
            sx={{
              mb: 5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Transaction History
            </Typography>
          </Box>
          <Card>
            <QueueTableToolbar
              filterQuery={filterQuery}
              handleToggleFilter={handleToggleFilter}
              handleFilterChange={handleFilterQueryChange}
            />
            <Scrollbar>
              <TableContainer sx={{ overflow: "unset" }}>
                <Table sx={{ minWidth: 800 }}>
                  <QueueTableHead
                    order={order}
                    orderBy={orderBy}
                    handleSort={handleSort}
                    headLabel={[
                      { id: "id", label: "Queue No." },
                      { id: "name", label: "Name" },
                      { id: "rdo", label: "Revenue District" },
                      { id: "transaction", label: "Transaction" },
                      { id: "submittedAt", label: "Datetime Submitted" },
                      { id: "status", label: "Status" },
                    ]}
                  />

                  <TableBody>
                    {filteredQueue
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <QueueTableRow key={row.id} row={row} />
                      ))}

                    {filterQuery && filteredQueue.length === 0 && (
                      <TableNoData searchQuery={filterQuery} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={page}
              count={filteredQueue.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 20]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}

      {filterOpen && (
        <FilterDrawer
          open={filterOpen}
          onClose={handleToggleFilter}
          filter={filter}
          setFilter={handleFilterChange}
        />
      )}
    </>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Queue>(
  order: "asc" | "desc",
  orderBy: Key
): (a: Queue, b: Queue) => number {
  return order === "desc"
    ? (a, b) => descendingComparator<Queue>(a, b, orderBy)
    : (a, b) => -descendingComparator<Queue>(a, b, orderBy);
}

type ApplyFilterProps = {
  inputData: Queue[];
  filterQuery: string;
  orderBy: keyof Queue;
  order: "asc" | "desc";
};

function applyFilter({
  inputData,
  filterQuery,
  orderBy,
  order,
}: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const sorted = getComparator(order, orderBy)(a[0], b[0]);
    if (sorted !== 0) return sorted;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterQuery) {
    inputData = inputData.filter(
      (queue) =>
        queue.search.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1
    );
  }

  return inputData;
}
