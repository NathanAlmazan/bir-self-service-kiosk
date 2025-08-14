import * as React from "react";
// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// Icons
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

const PrintChecklistDialog = React.lazy(() => import("./print-checklist"));

type HeaderProps = {
  title: string;
  duration: string;
  fee: string;
  checklist?: string;
};

export default function RequirementsHeader({
  title,
  duration,
  fee,
  checklist,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Stack spacing={2} direction="column">
        <Typography component="div" variant="h3">
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2
          }}
        >
          <Stack spacing={1} direction="row">
            <TimerOutlinedIcon />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {`${duration} Total Processing Time`}
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row">
            <PaymentOutlinedIcon />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {fee}
            </Typography>
          </Stack>
          {checklist && (
            <Button
              size="large"
              variant="text"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<PrintOutlinedIcon />}
            >
              Print Checklist of Requirements
            </Button>
          )}
        </Box>
      </Stack>
      {checklist && (
        <PrintChecklistDialog
          open={open}
          handleClose={() => setOpen(false)}
          checklistUrl={checklist}
        />
      )}
    </>
  );
}
