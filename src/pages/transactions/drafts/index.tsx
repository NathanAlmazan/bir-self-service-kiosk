import * as React from "react";
// Router
import { useRouter } from "src/routes/hooks";
// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
// Firebase
import { db } from "src/firebase";
import { collection, getDocs } from "firebase/firestore";
// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// Components
import TransactionCard from "./card";
import Fallback from "src/components/fallback";

export type Service =
  | "CERTIFICATE & CLEARANCE"
  | "COMPLIANCE & ENFORCEMENT"
  | "FILING & PAYMENT"
  | "REGISTRATION"
  | "AUDIT & INVESTIGATION";

export type Transaction = {
  id: string;
  name: string;
  fee: string;
  duration: string;
  service: string;
  category?: string;
  checklist?: string;
};

const services: Service[] = [
  "REGISTRATION",
  "FILING & PAYMENT",
  "CERTIFICATE & CLEARANCE",
];

export default function DraftTransactionsPage() {
  // Tabs
  const [tabValue, setTabValue] = React.useState<number>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  // Navigation
  const router = useRouter();
  // Transactions
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [filtered, setFiltered] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);

        const querySnapshot = await getDocs(collection(db, "charter"));

        const serviceTransactions: Transaction[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            name: doc.data().title,
            duration: doc.data().duration,
            fee: doc.data().fee,
            service: doc.data().service,
            category: doc.data().category,
          })
        );

        setTransactions(serviceTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        router.push("/500");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [router]);

  React.useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(true);

      setFiltered(
        transactions.filter(
          (t) =>
            t.service === services[tabValue] &&
            t.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setIsLoading(false);
    }
  }, [transactions, tabValue, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectTransaction = (
    _: React.MouseEvent<HTMLButtonElement>,
    transaction?: string
  ) => {
    if (transaction) {
      router.push(`/encode/${transaction}`);
    } else {
      router.push(`/encode`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Fallback />
      ) : (
        <Container maxWidth="lg" sx={{ zIndex: 2, marginBottom: 8 }}>
          <Grid container spacing={3} maxWidth="lg" alignItems="stretch">
            {/* Page Header */}
            <Grid size={{ sm: 12, md: 6, lg: 8 }}>
              <Typography component="div" variant="h3">
                Transactions
              </Typography>
            </Grid>
            {/* Transaction Search */}
            <Grid size={{ sm: 12, md: 6, lg: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Transaction"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleSelectTransaction}
                >
                  Create
                </Button>
              </Box>
            </Grid>
            {/* Services */}
            <Grid size={12}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {services.map((category) => (
                  <Tab key={category} label={category} />
                ))}
              </Tabs>
            </Grid>
            {/* Transaction Cards */}
            <Grid size={12}>
              <Grid container spacing={3} maxWidth="lg" alignItems="stretch">
                {filtered.map((transaction) => (
                  <Grid key={transaction.id} size={{ sm: 12, md: 6, lg: 4 }}>
                    <TransactionCard
                      id={transaction.id}
                      title={transaction.name}
                      duration={transaction.duration}
                      fee={transaction.fee}
                      category={transaction.category}
                      handleClick={handleSelectTransaction}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* No Transactions Found */}
            {filtered.length === 0 && (
              <Grid size={12}>
                {searchQuery.length > 0 ? (
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: "text.secondary", my: 5 }}
                  >
                    {`No transactions found for "${searchQuery}". Please try a different search term.`}
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ color: "text.secondary", my: 5 }}
                  >
                    {"No transactions found."}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </>
  );
}
