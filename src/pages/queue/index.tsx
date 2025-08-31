import * as React from "react";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { db } from "src/firebase";
import { useAppSelector } from "src/store/hooks";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import ConfirmDialog from "./confirm-dialog";
import { Label, LabelColor } from "src/components/label";
import { TransactionsStatus } from "src/pages/requirements/types";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

export type QueueData = {
  id: string;
  transaction: string;
  firstName: string;
  lastName: string;
  rating: number;
  rdo: string;
  service: string;
  status: TransactionsStatus;
  taxpayerTIN: string;
  contact: string;
  category?: string;
  submittedAt: Timestamp;
  checked?: string[];
};

export default function QueuePage() {
  const { office } = useAppSelector((state) => state.user);

  const [queue, setQueue] = React.useState<QueueData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<QueueData | null>(null);
  const [scan, setScan] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "taxpayers"),
        where("rdo", "==", office),
        where("status", "==", TransactionsStatus.COMPLETE_REQUIREMENTS),
        orderBy("submittedAt", "asc")
      ),
      (snapshot) => {
        setQueue(
          snapshot.docs.map((doc) => {
            const data = doc.data() as QueueData;
            return {
              id: doc.id,
              transaction: data.transaction,
              firstName: data.firstName,
              lastName: data.lastName,
              rating: data.rating,
              rdo: data.rdo,
              service: data.service,
              status: data.status,
              taxpayerTIN: data.taxpayerTIN,
              contact: data.contact,
              submittedAt: data.submittedAt,
              checked: data.checked || [],
              category: data.category,
            };
          })
        );
      }
    );

    return () => unsubscribe();
  }, [office]);

  React.useEffect(() => {
    const fetchQueueTask = async () => {
      const storedId = window.localStorage.getItem("servicing");
      if (storedId) {
        setLoading(true);
        try {
          const taxpayerDocRef = doc(db, "taxpayers", storedId);

          await updateDoc(taxpayerDocRef, {
            status: TransactionsStatus.RECEIVED_REQUIREMENTS,
          });

          const docSnap = await getDoc(taxpayerDocRef);

          if (docSnap.exists() && docSnap.data().rdo === office) {
            const data = docSnap.data() as QueueData;
            setSelected({
              id: docSnap.id,
              transaction: data.transaction,
              firstName: data.firstName,
              lastName: data.lastName,
              rating: data.rating,
              rdo: data.rdo,
              service: data.service,
              status: data.status,
              taxpayerTIN: data.taxpayerTIN,
              contact: data.contact,
              submittedAt: data.submittedAt,
              checked: data.checked || [],
              category: data.category,
            });
          }
        } catch (error) {
          console.error("Error fetching queue task:", error);
          setErrorMessage(
            "Failed to fetch stored task. Please contact support."
          );
          setErrorSnackbarOpen(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQueueTask();
  }, [office]);

  const handleToggleScan = () => {
    setScan((prev) => !prev);
  };

  const handleRejectTransaction = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const handleStartService = async (result: IDetectedBarcode[]) => {
    if (result.length > 0) {
      const code: string = result[0].rawValue;
      const queueId = atob(code).split("/").pop();

      const storedId = window.localStorage.getItem("servicing");

      if (storedId) {
        setErrorMessage("There is an active task stored. Please reload page.");
        setErrorSnackbarOpen(true);
      } else {
        const queueData = queue.find((q) => q.id === queueId);

        if (queueId && queueData) {
          setLoading(true);
          try {
            // update the taxpayer document with the verification
            const taxpayerDocRef = doc(db, "taxpayers", queueId);
            await updateDoc(taxpayerDocRef, {
              status: TransactionsStatus.RECEIVED_REQUIREMENTS,
            });

            window.localStorage.setItem("servicing", queueId);

            setSelected({
              ...queueData,
              status: TransactionsStatus.RECEIVED_REQUIREMENTS,
            });

            setQueue((prev) => prev.filter((q) => q.id !== queueId));
          } catch (error) {
            console.error("Error submitting status:", error);
            setErrorMessage(
              "Failed to update transaction. Please contact support."
            );
            setErrorSnackbarOpen(true);
          } finally {
            setLoading(false);
          }
        } else {
          setErrorMessage(
            "Cannot find transaction. Please make sure that the transaction belongs to your office."
          );
          setErrorSnackbarOpen(true);
        }
      }
    }
  };

  const handleStartTransaction = async () => {
    if (selected) {
      setLoading(true);
      try {
        // update the taxpayer document with the verification
        const taxpayerDocRef = doc(db, "taxpayers", selected.id);
        await updateDoc(taxpayerDocRef, {
          status: TransactionsStatus.VERIFIED_REQUIREMENTS,
        });

        setScan(false);
        setSelected(null);

        window.localStorage.removeItem("servicing");
      } catch (error) {
        console.error("Error submitting status:", error);
        setErrorMessage(
          "Failed to update transaction. Please contact support."
        );
        setErrorSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selected) {
      setLoading(true);
      try {
        // update the taxpayer document with the verification
        const taxpayerDocRef = doc(db, "taxpayers", selected.id);
        await updateDoc(taxpayerDocRef, {
          status: TransactionsStatus.INVALID_REQUIREMENTS,
        });

        setScan(false);
        setSelected(null);

        window.localStorage.removeItem("servicing");
      } catch (error) {
        console.error("Error submitting status:", error);
        setErrorMessage(
          "Failed to update transaction. Please contact support."
        );
        setErrorSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleScannerError = () => {
    setErrorMessage("Failed to scan QR code. Please try again.");
    setErrorSnackbarOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ zIndex: 2, marginBottom: 8 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 7 }} order={{ xs: 1, sm: 2 }}>
          <Typography component="div" variant="h4" sx={{ pb: 3 }}>
            Servicing
          </Typography>
          {selected ? (
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="body1">
                      {selected.id.split("-").slice(1).join("-")}
                    </Typography>
                    <Typography variant="h6">
                      {selected.firstName + " " + selected.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: 1,
                      }}
                    >
                      <AccessTimeRoundedIcon fontSize="small" />
                      <Typography variant="body2">
                        {selected.submittedAt.toDate().toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Label color="default">{selected.service}</Label>
                      {selected.category && (
                        <Label color="default">{selected.category}</Label>
                      )}
                      <Label color={getStatusColor(selected.status)}>
                        {selected.status}
                      </Label>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">
                      {selected.transaction}
                    </Typography>
                    <Typography variant="subtitle2">Transaction</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1">{selected.contact}</Typography>
                    <Typography variant="subtitle2">
                      Contact Information
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body1">
                      {selected.taxpayerTIN || "Not Entered"}
                    </Typography>
                    <Typography variant="subtitle2">TIN</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="h6">
                      Checklist of Requirements
                    </Typography>
                    <List>
                      {selected.checked &&
                        selected.checked.map((req, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary={req.trim()} />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "flex-end", backgroundColor: "#E6F3FF" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRejectTransaction}
                  disabled={loading}
                >
                  Invalid Requirements
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartTransaction}
                  disabled={loading}
                >
                  Start Transaction
                </Button>
              </CardActions>
            </Card>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 360,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {scan ? (
                <Scanner
                  onScan={handleStartService}
                  onError={handleScannerError}
                  scanDelay={300}
                  sound={true}
                  paused={!scan}
                />
              ) : (
                <Typography component="div" textAlign="center" variant="h6">
                  {`No Taxpayer currently being served.${
                    queue.length > 0 ? "  Please scan a receipt to start." : ""
                  }`}
                </Typography>
              )}

              {queue.length > 0 && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={handleToggleScan}
                  disabled={loading}
                >
                  {scan ? "Cancel Scanning" : "Scan Transaction Code"}
                </Button>
              )}
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 5 }} order={{ xs: 2, sm: 1 }}>
          <Typography component="div" variant="h4" sx={{ pb: 3 }}>
            {`Queue (${queue.length})`}
          </Typography>

          {queue.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 360,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img alt="done-tasks" width="280px" src="/bg/done-tasks.svg" />
              <Typography component="div" textAlign="center" variant="h6">
                All done! No queued transactions.
              </Typography>
            </Box>
          )}

          <Stack direction="column" spacing={2} justifyContent="stretch">
            {queue.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Typography variant="body1">
                        {item.id.split("-").slice(1).join("-")}
                      </Typography>
                      <Typography variant="h6">
                        {item.firstName + " " + item.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          gap: 1,
                        }}
                      >
                        <AccessTimeRoundedIcon fontSize="small" />
                        <Typography variant="body2">
                          {item.submittedAt.toDate().toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Label color="default">{item.service}</Label>
                        {item.category && (
                          <Label color="default">{item.category}</Label>
                        )}
                        <Label color={getStatusColor(item.status)}>
                          {item.status}
                        </Label>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={handleConfirmDialogClose}
        handleConfirm={handleConfirmReject}
      />

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseErrorSnackbar}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

function getStatusColor(status: TransactionsStatus): LabelColor {
  switch (status) {
    case TransactionsStatus.COMPLETE_REQUIREMENTS:
      return "primary";
    case TransactionsStatus.INCOMPLETE_REQUIREMENTS:
      return "secondary";
    case TransactionsStatus.RECEIVED_REQUIREMENTS:
      return "warning";
    case TransactionsStatus.VERIFIED_REQUIREMENTS:
      return "success";
    case TransactionsStatus.INVALID_REQUIREMENTS:
      return "error";
    default:
      return "default";
  }
}
