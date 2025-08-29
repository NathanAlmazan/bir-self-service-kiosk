import * as React from "react";
import { useParams } from "react-router";
// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
// utils
import { varAlpha } from "minimal-shared/utils";
// icons
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
// firebase
import { db } from "src/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "src/routes/hooks";
// Types
import { TransactionsStatus } from "src/pages/requirements/types";

export default function VerificationPage() {
  const { uuid } = useParams();

  const router = useRouter();
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
        // update the taxpayer document with the verification
        const taxpayerDocRef = doc(db, "taxpayers", uuid);
        await updateDoc(taxpayerDocRef, {
          status: TransactionsStatus.RECEIVED_REQUIREMENTS,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error submitting verification:", error);
        setErrorMessage("Failed to verify transaction. Please try again.");
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [uuid]);

  const handleNavigateBack = () => {
    router.push("/dashboard/home");
  };

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
          <Button
            color="primary"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handleNavigateBack}
            sx={{ mt: 2 }}
          >
            {"Go back"}
          </Button>
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
          <Button
            color="primary"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handleNavigateBack}
            sx={{ mt: 2 }}
          >
            {"Go back"}
          </Button>
        </>
      )}
    </Box>
  );
}
