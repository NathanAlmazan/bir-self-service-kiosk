import * as React from "react";
// Router
import { useParams } from "react-router-dom";
import { useRouter } from "src/routes/hooks";
// MUI
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { capitalize } from "es-toolkit";
// Animation
import { AnimatePresence, motion } from "motion/react";
// Firebase
import { db } from "src/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// Components
import TransactionCard from "./card";
import Fallback from "src/components/fallback";
// Types
import type { Transaction } from "src/pages/requirements/types";

const formatServiceName = (service: string | undefined) => {
  return service
    ? service
        .split("-")
        .map((word) => capitalize(word))
        .join(" & ")
    : "";
};

export default function PublishedTransactionsPage() {
  const { service } = useParams();
  // Navigation
  const router = useRouter();
  const handleNavigateBack = () => router.push("/kiosk/services");
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
        setIsLoading(true);

        const querySnapshot = await getDocs(
          query(
            collection(db, "charter"),
            where(
              "service",
              "==",
              service?.split("-").join(" & ").toUpperCase() || ""
            ),
            where("publish", "==", true)
          )
        );

        const serviceTransactions = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Transaction)
        );
        const uniqueCategories = Array.from(
          new Set(
            serviceTransactions
              .filter((t) => t.category)
              .map((t) => t.category || "")
          )
        ).sort((a, b) => a.length - b.length);

        setCategories(uniqueCategories);
        setTransactions(serviceTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [router, service]);

  React.useEffect(() => {
    if (transactions.length > 0) {
      setIsLoading(true);

      setFiltered(
        transactions.filter(
          (t) =>
            (categories.length === 0 || t.category === categories[tabValue]) &&
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setIsLoading(false);
    }
  }, [categories, transactions, tabValue, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectTransaction = (
    _: React.MouseEvent<HTMLButtonElement>,
    transaction: string
  ) => {
    router.push(`/kiosk/requirements/${transaction}`);
  };

  return (
    <>
      {isLoading || (filtered.length === 0 && searchQuery.length === 0) ? (
        <Fallback />
      ) : (
        <Container maxWidth="lg" sx={{ zIndex: 2, marginBottom: 8 }}>
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
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, px: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                >
                  {categories.map((category) => (
                    <Tab key={category} label={category} />
                  ))}
                </Tabs>
                </Box>
              </Grid>
            )}
            {/* Transaction Cards */}
            <Grid size={12}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tabValue}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Grid
                    container
                    spacing={3}
                    maxWidth="lg"
                    alignItems="stretch"
                  >
                    {filtered.map((transaction) => (
                      <Grid
                        key={transaction.id}
                        size={{ sm: 12, md: 6, lg: 4 }}
                      >
                        <TransactionCard
                          id={transaction.id}
                          title={transaction.title}
                          duration={transaction.duration}
                          fee={transaction.fee}
                          handleClick={handleSelectTransaction}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </AnimatePresence>
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
