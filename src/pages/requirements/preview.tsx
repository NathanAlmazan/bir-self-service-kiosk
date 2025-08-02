import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

export default function ReceiptPreview() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 300,
        padding: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ paddingBottom: 2 }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 1,
          }}
        >
          <Box
            component="img"
            src="/logo/bir-logo-full.png"
            style={{ width: 180, height: 25 }}
          />
        </Box>
        <Typography fontWeight="bold" fontSize={12} textAlign="center">
          {"SELF-SERVICE KIOSK"}
        </Typography>
      </Box>
      <Box sx={{ py: 2 }}>
        <Typography fontSize={10} textAlign="left">
          {"YOUR TRANSACTION NUMBER:"}
        </Typography>
        <Typography fontWeight="bold" fontSize={28} textAlign="center">
          A-0005
        </Typography>
        <Typography fontWeight="bold" fontSize={12} textAlign="center">
          <b>{"STATUS :"}</b>
          <Typography
            component="span"
            fontSize={12}
            color={theme.palette.success.main}
          >
            {" COMPLETE REQUIREMENTS"}
          </Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          py: 2,
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <Typography fontSize={12}>
          <b>{"RDO :"}</b>
          {" 029"}
        </Typography>
        <Typography fontSize={12}>
          <b>{"SERVICE TYPE :"}</b>
          {" REGISTRATION - TIN APPLICATION"}
        </Typography>
      </Box>
      <Box sx={{ py: 2 }}>
        <Typography fontSize={12} textAlign="center">
          <b>{"DATE :"}</b>
          {" July 16, 2025"}
        </Typography>
        <Typography fontSize={12} textAlign="center">
          <b>{"TIME :"}</b>
          {" 08:10 AM"}
        </Typography>
      </Box>
      <Stack spacing={2}>
        <Typography fontSize={10} textAlign="center">
          {
            "PLEASE PROCEED TO THE RDO'S CONCERNED SECTION, WHICH WILL PROCESS THE SERVICE IMMEDIATELY."
          }
        </Typography>
        <Typography fontSize={10} textAlign="center" fontStyle="italic">
          {
            "For assistance, approach the Public Assistance Compliance Desk (PACD)"
          }
        </Typography>
        <Typography
          fontSize={10}
          textAlign="center"
          fontStyle="italic"
          color={theme.palette.primary.main}
        >
          {'"Streamlining Tax Services with Comfort and Care"'}
        </Typography>
      </Stack>
    </Box>
  );
}
