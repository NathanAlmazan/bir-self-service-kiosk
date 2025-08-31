import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { db } from "src/firebase";
import { useAppSelector } from "src/store/hooks";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { offices } from "src/pages/auth/offices";
import { UserRole } from "src/store/types";
import { TransactionsStatus } from "../requirements/types";

type TransactionFormProps = {
  selected: string | null;
  open: boolean;
  onClose: () => void;
};

type TransactionFormData = {
  transaction: string;
  service: string;
  category?: string;
  rdo: string;
  contact: string;
  firstName: string;
  lastName: string;
  taxpayerTIN: string;
  taxpayerName: string;
  submittedAt: Timestamp;
  status: TransactionsStatus;
  rating: number;
  checked: string[];
};

export default function TransactionForm({
  selected,
  open,
  onClose,
}: TransactionFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const { role } = useAppSelector((state) => state.user);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<TransactionFormData>({
    transaction: "",
    service: "",
    category: "",
    rdo: "",
    contact: "",
    firstName: "",
    lastName: "",
    taxpayerTIN: "",
    taxpayerName: "",
    submittedAt: Timestamp.now(),
    status: TransactionsStatus.COMPLETE_REQUIREMENTS,
    rating: 0,
    checked: [],
  });

  React.useEffect(() => {
    const fetchTransaction = async () => {
      if (selected) {
        setLoading(true);
        try {
          const taxpayerDocRef = doc(db, "taxpayers", selected);
          const docSnap = await getDoc(taxpayerDocRef);

          if (docSnap.exists()) {
            setFormData(docSnap.data() as TransactionFormData);
            setChanged(false);
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

    fetchTransaction();
  }, [selected]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setChanged(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selected) {
          setLoading(true);
          try {
            // update the taxpayer document with the verification
            const taxpayerDocRef = doc(db, "taxpayers", selected);
            await updateDoc(taxpayerDocRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                taxpayerTIN: formData.taxpayerTIN,
                taxpayerName: formData.taxpayerName,
                status: formData.status,
                contact: formData.contact,
                rdo: formData.rdo
            });

            onClose();
    
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

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  return (
    <>
      <Dialog maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>
          {selected?.split("-").slice(1).join("-")}
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
          <Grid
            component="form"
            id="transaction-update-form"
            container
            spacing={3}
            onSubmit={handleSubmit}
            sx={{ pt: 3 }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading || role !== UserRole.ADMIN}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading || role !== UserRole.ADMIN}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                name="transaction"
                label="Transaction"
                value={formData.transaction}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Service"
                name="service"
                variant="outlined"
                fullWidth
                value={formData.service}
                onChange={handleInputChange}
                disabled
                select
              >
                <MenuItem value="REGISTRATION">Registration</MenuItem>
                <MenuItem value="FILING & PAYMENT">Filing & Payment</MenuItem>
                <MenuItem value="CERTIFICATE & CLEARANCE">
                  Certificate & Clearance
                </MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Category"
                name="category"
                variant="outlined"
                fullWidth
                value={formData.category}
                onChange={handleInputChange}
                disabled
                select
              >
                <MenuItem value="TIN APPLICATION">TIN Application</MenuItem>
                <MenuItem value="BUSINESS OR BRANCH REGISTRATION">
                  Business or Branch Registration
                </MenuItem>
                <MenuItem value="SYSTEM OR PERMIT REGISTRATION">
                  System or Permit Registration
                </MenuItem>
                <MenuItem value="CLOSURE OF BUSINESS OR CANCELLATION OF REGISTRATION">
                  Closure of Business or Cancellation of Registration
                </MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                name="taxpayerName"
                label="Taxpayer Name"
                value={formData.taxpayerName}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading || role !== UserRole.ADMIN}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                name="taxpayerTIN"
                label="Taxpayer Identification Number (TIN)"
                value={formData.taxpayerTIN}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading || role !== UserRole.ADMIN}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                name="contact"
                label="Contact Information"
                value={formData.contact}
                onChange={handleInputChange}
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading || role !== UserRole.ADMIN}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Revenue District Office (RDO)"
                name="rdo"
                variant="outlined"
                fullWidth
                value={formData.rdo}
                onChange={handleInputChange}
                disabled={loading || role !== UserRole.ADMIN}
                select
              >
                {offices.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name + " - " + option.area}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Status"
                name="status"
                variant="outlined"
                fullWidth
                value={formData.status}
                onChange={handleInputChange}
                disabled={loading}
                select
              >
                {Object.values(TransactionsStatus).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.disabled", mb: 1 }}
              >
                Taxpayer Service Rating
              </Typography>
              <Rating name="rating" value={formData.rating} readOnly />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!changed}
            type="submit"
            form="transaction-update-form"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}
