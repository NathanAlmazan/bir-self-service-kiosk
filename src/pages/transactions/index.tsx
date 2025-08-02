import * as React from "react";
// Router
import { useParams, useNavigate } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { capitalize } from "es-toolkit";
// Animation
import { AnimatePresence, motion } from "motion/react";
// Firebase
import db from "src/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// Components
import TransactionCard from "./card";

export type Service =
  | "CERTIFICATE & CLEARANCE"
  | "COMPLIANCE & ENFORCEMENT"
  | "FILING & PAYMENT"
  | "REGISTRATION"
  | "AUDIT & INVESTIGATION";

export type Transaction = {
  id: string;
  order: number;
  name: string;
  duration: string;
  service: Service;
  category: string;
  fee: string;
};

const formatServiceName = (service: string | undefined) => {
  return service
    ? service
        .split("-")
        .map((word) => capitalize(word))
        .join(" & ")
    : "";
};

export default function TransactionsPage() {
  const { service } = useParams();
  // Navigations
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate("/");
  // Tabs
  const [tabValue, setTabValue] = React.useState<number>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  // Transactions
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [filtered, setFiltered] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log(
          "Fetching transactions for service:",
          service?.split("-").join(" & ").toUpperCase()
        );

        setIsLoading(true);

        const querySnapshot = await getDocs(
          query(
            collection(db, "transactions"),
            where(
              "service",
              "==",
              service?.split("-").join(" & ").toUpperCase() || ""
            )
          )
        );

        const serviceTransactions = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Transaction)
        );
        const uniqueCategories = Array.from(
          new Set(serviceTransactions.map((t) => t.category))
        );

        setCategories(uniqueCategories);
        setTransactions(serviceTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [service]);

  React.useEffect(() => {
    if (transactions.length > 0) {
      setFiltered(
        transactions.filter(
          (t) =>
            t.category === categories[tabValue] &&
            t.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setIsLoading(false);
  }, [categories, transactions, tabValue, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectTransaction = (
    _: React.MouseEvent<HTMLButtonElement>,
    transaction: string
  ) => {
    navigate(`/requirements/${transaction}`);
  };

  return (
    <Container maxWidth="lg" sx={{ zIndex: 2 }}>
      <Grid container spacing={3} maxWidth="lg" alignItems="stretch">
        {/* Page Header */}
        <Grid size={{ sm: 12, md: 6, lg: 8 }}>
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <IconButton onClick={handleNavigateBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography component="div" variant="h3">
              {formatServiceName(service)}
            </Typography>
          </Stack>
        </Grid>
        {/* Transaction Search */}
        <Grid size={{ sm: 12, md: 6, lg: 4 }}>
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
        </Grid>
        {/* Transaction Categories */}
        {categories.length > 1 && (
          <Grid size={12}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              {categories.map((category) => (
                <Tab key={category} label={category} />
              ))}
            </Tabs>
          </Grid>
        )}
        {/* Transaction Cards */}
        <AnimatePresence>
          {!isLoading &&
            filtered.map((transaction, index) => (
              <Grid key={transaction.id} size={{ sm: 12, md: 6, lg: 4 }}>
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TransactionCard
                    id={index}
                    title={transaction.name}
                    duration={transaction.duration}
                    fee={transaction.fee}
                    handleClick={handleSelectTransaction}
                  />
                </motion.div>
              </Grid>
            ))}
        </AnimatePresence>

        {/* No Transactions Found */}
        {!isLoading && filtered.length === 0 && (
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
  );
}