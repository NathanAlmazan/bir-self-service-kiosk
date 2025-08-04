import * as React from "react";
import { useParams } from "react-router";
// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
// utils
import { varAlpha } from "minimal-shared/utils";
// icons
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
// firebase
import { db } from "src/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function VerificationPage() {
  const { uuid } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  React.useEffect(() => {
    const verifyTransaction = async () => {
      if (!uuid) {
        setErrorMessage("Invalid transaction ID.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // update the taxpayer document with the rating
        const taxpayerDocRef = doc(db, "taxpayers", atob(uuid));
        await updateDoc(taxpayerDocRef, {
          verified: true,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error submitting rating:", error);
        setErrorMessage("Failed to verify transaction. Please try again.");
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [uuid]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <>
          <Typography component="div" variant="h6">
            {"Verifying your transaction..."}
          </Typography>
          <LinearProgress
            sx={{
              width: 1,
              maxWidth: 320,
              bgcolor: (theme) =>
                varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
              [`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
            }}
          />
        </>
      ) : errorMessage ? (
        <>
          <DangerousOutlinedIcon
            fontSize="large"
            color="error"
            sx={{ mb: 2 }}
          />
          <Typography component="div" variant="h6">
            {"Sorry, transaction verification failed."}
          </Typography>
        </>
      ) : (
        <>
          <CheckCircleOutlinedIcon
            fontSize="large"
            color="success"
            sx={{ mb: 2 }}
          />
          <Typography component="div" variant="h6">
            {"Transaction verified successfully!"}
          </Typography>
        </>
      )}
    </Box>
  );
}
