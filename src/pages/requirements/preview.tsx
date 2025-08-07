import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import QRCode from "react-qr-code";

import { useTheme } from "@mui/material/styles";

import type { Transaction, Taxpayer } from ".";

type PreviewProps = {
  transaction: Transaction;
  taxpayer: Taxpayer;
  complete: boolean;
  requirements: string[];
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ReceiptPreview({
  transaction,
  taxpayer,
  complete,
  requirements,
}: PreviewProps) {
  const theme = useTheme();
  return (
    <Box
      id="receipt-preview"
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
          {taxpayer.uuid.split("-").slice(1).join("-")}
        </Typography>
        <Typography fontWeight="bold" fontSize={12} textAlign="center">
          <b>{"STATUS :"}</b>
          <Typography
            component="span"
            fontSize={12}
            color={
              complete ? theme.palette.success.main : theme.palette.error.main
            }
          >
            {" " +
              (complete ? "COMPLETE REQUIREMENTS" : "INCOMPLETE REQUIREMENTS")}
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
          {" " + taxpayer.rdo.split("No.")[1].trim().padStart(3, "0")}
        </Typography>
        <Typography fontSize={12}>
          <b>{"SERVICE TYPE :"}</b>
          {" " +
            transaction.service.toUpperCase() +
            (transaction.category
              ? " - " + transaction.category.toUpperCase()
              : "")}
        </Typography>
      </Box>
      <Box sx={{ py: 2 }}>
        <Typography fontSize={12} textAlign="center">
          <b>{"DATE :"}</b>
          {" " + formatDate(new Date().toISOString())}
        </Typography>
        <Typography fontSize={12} textAlign="center">
          <b>{"TIME :"}</b>
          {" " + formatTime(new Date().toISOString())}
        </Typography>
      </Box>
      {complete ? (
        <Stack spacing={2}>
          <Typography fontSize={10} textAlign="center">
            Please proceed to the <b>RDO'S CONCERNED SECTION</b>, which will
            process the service immediately.
          </Typography>
          <Typography fontSize={10} textAlign="center" fontStyle="italic">
            For assistance, approach the Public Assistance Compliance Desk
            (PACD)
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
      ) : (
        <Stack spacing={2}>
          <Typography fontSize={10} textAlign="center">
            Please proceed to the{" "}
            <b>
              TAXPAYER SERVICE OFFICER (TSO) / PUBLIC ASSISTANCE COMPLIANCE DESK
              (PACD)
            </b>
            , which will assist and guide you on the requirements that you need
            to comply with.
          </Typography>
          <Typography fontSize={10} textAlign="center">
            Once the requirements are <b>Complete</b>, please return to the{" "}
            <b>Taxpayer Lounge</b> as per the type of service being availed.
          </Typography>
          <Box
            sx={{
              py: 2,
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
            }}
          >
            <Typography fontSize={10} textAlign="left" fontWeight="bold">
              {`Checklist of Incomplete ${
                requirements.length > 1 ? "Requirements" : "Requirement"
              }:`}
            </Typography>
            <List dense>
              {requirements.map((requirement, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={
                      <Typography fontSize={10}>{`${
                        index + 1
                      }. ${requirement}`}</Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Typography
            fontSize={10}
            textAlign="center"
            fontStyle="italic"
            color={theme.palette.primary.main}
          >
            {'"Streamlining Tax Services with Comfort and Care"'}
          </Typography>
        </Stack>
      )}
      {complete && taxpayer.uuid && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pt: 3,
          }}
        >
          <QRCode
            value={`${import.meta.env.VITE_BASE_URL}/verify/${btoa(
              taxpayer.uuid
            )}`}
            size={128}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          />
          <Typography
            fontSize={9}
            textAlign="center"
            fontStyle="italic"
            sx={{ pt: 1 }}
          >
            Thank you for using One-Stop Taxpayer Lounge! Taxpayer Service
            Officer will scan the QR Code to mark the start of your transaction.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
