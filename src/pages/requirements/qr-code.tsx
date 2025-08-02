import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import QRCode from "react-qr-code";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type QRCodeProps = {
  open: boolean;
  label: string;
  link: string;
  handleClose: () => void;
};

export default function RequirementsQRCode({
  open,
  label,
  link,
  handleClose,
}: QRCodeProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{label}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ paddingBottom: 3 }}
        >
          Scan the QR Code below to access the link:
        </Typography>
        <QRCode size={256} value={link} />
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CloseOutlinedIcon />}
          onClick={handleClose}
          color="primary"
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
