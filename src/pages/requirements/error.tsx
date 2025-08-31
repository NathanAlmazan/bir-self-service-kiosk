import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type ErrorSnackbarProps = {
  open: boolean;
  message: string;
  handleClose: () => void;
};

export default function ErrorSnackbar({
  open,
  message,
  handleClose,
}: ErrorSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="error"
        variant="outlined"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
