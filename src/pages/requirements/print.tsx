import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import type { Requirements } from ".";

import ReceiptPreview from "./preview";

type PrintReceiptProps = {
  complete: boolean;
  missingReqs: Requirements[];
  handleNextStep: () => void;
};

export default function PrintReceiptForm(props: PrintReceiptProps) {
  return (
    <Stack
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ px: 8 }}
    >
      <ReceiptPreview />
      {props.complete ? (
        <Box sx={{ pt: 2 }}>
          <Typography variant="h4" align="center">
            {"All set! You've completed the requirements."}
          </Typography>
          <Typography variant="h6" align="center">
            {
              "You may now proceed with your transaction. Don't forget to bring your printed receipt with you."
            }
          </Typography>
        </Box>
      ) : (
        <Box sx={{ pt: 2 }}>
          <Typography variant="h4" align="center">
            {"Some requirements are missing."}
          </Typography>
          <Typography variant="h6" align="center">
            {
              "Please check the receipt for the list of what's needed. For assistance, feel free to approach the Public Assistance & Compliance Desk."
            }
          </Typography>
        </Box>
      )}
      <Button variant="contained" size="large" onClick={props.handleNextStep}>
        Review Self-Service Kiosk
      </Button>
    </Stack>
  );
}
