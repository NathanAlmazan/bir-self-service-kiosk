import * as React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import html2canvas from "html2canvas";
import { db, storage } from "src/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import type { Requirements, Transaction, Taxpayer } from "./types";

import ReceiptPreview from "./preview";

type PrintReceiptProps = {
  transaction: Transaction;
  taxpayer: Taxpayer;
  complete: boolean;
  missingRequirements: Requirements[];
  handleNextStep: () => void;
  showQRCode: (label: string, link: string) => void;
};

const captureReceiptAsImage = async (
  elementId: string,
  fileName: string
): Promise<string> => {
  try {
    // get the element to capture
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // capture the element as canvas
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      removeContainer: true,
      height: element.offsetHeight,
      width: element.offsetWidth,
    });

    // convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          }
        },
        "image/png",
        1.0
      );
    });

    // upload to Firebase Storage
    const storageRef = ref(storage, `receipts/${fileName}.png`);
    const snapshot = await uploadBytes(storageRef, blob);

    // get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // update the taxpayer document with the receipt URL
    const taxpayerDocRef = doc(db, "taxpayers", fileName);
    await updateDoc(taxpayerDocRef, {
      receiptUrl: downloadURL,
    });

    return downloadURL;
  } catch (error) {
    console.error("Error capturing receipt:", error);
    throw new Error("Failed to capture receipt: " + error);
  }
};

export default function PrintReceiptForm({
  transaction,
  taxpayer,
  complete,
  missingRequirements,
  handleNextStep,
  showQRCode,
}: PrintReceiptProps) {
  const [loading, setLoading] = React.useState(true);
  const [receiptImageUrl, setReceiptImageUrl] = React.useState<string>();

  React.useEffect(() => {
    if (!taxpayer.uuid) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const imageUrl = await captureReceiptAsImage(
          "receipt-preview",
          taxpayer.uuid
        );
        setReceiptImageUrl(imageUrl);
      } catch (error) {
        console.error("Error capturing receipt image:", error);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [taxpayer]);

  const [groupedRequirements, setGroupedRequirements] = React.useState<
    Record<string, string[]>
  >({});
  const [independentRequirements, setIndependentRequirements] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    const grouped: Record<string, string[]> = {};
    const independent: string[] = [];

    missingRequirements.forEach((req) => {
      if (req.group) {
        if (!grouped[req.group]) {
          grouped[req.group] = [];
        }
        grouped[req.group].push(req.name);
      } else {
        independent.push(req.name);
      }
    });

    setGroupedRequirements(grouped);
    setIndependentRequirements(independent);
  }, [missingRequirements]);

  return (
    <Stack
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ px: 8 }}
    >
      {complete ? (
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" align="center">
            {"All set! You've successfully completed everything."}
          </Typography>
          <Typography variant="body2" align="center">
            You may now proceed with your transaction. Don't forget to take a
            picture or
            <Button
              component="a"
              variant="text"
              size="medium"
              disabled={!receiptImageUrl}
              onClick={() =>
                showQRCode("Download Your Receipt", receiptImageUrl || "")
              }
              sx={{ typography: "body2" }}
            >
              download
            </Button>
            your receipt.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" align="center">
            {"Some requirements are missing."}
          </Typography>
          <Typography variant="body2" align="center">
            Please take a picture or
            <Button
              component="a"
              variant="text"
              size="medium"
              disabled={!receiptImageUrl}
              onClick={() =>
                showQRCode("Download Your Receipt", receiptImageUrl || "")
              }
              sx={{ typography: "body2" }}
            >
              download
            </Button>
            your receipt to check missing{" "}
            {missingRequirements.length > 1 ? "requirements" : "requirement"}.
            For assistance, feel free to approach a{" "}
            <b>Taxpayer Service Officer (TSO)</b> or the{" "}
            <b>Public Assistance Compliance Desk (PACD)</b>.
          </Typography>
        </Box>
      )}
      {loading && !receiptImageUrl && (
        <Box sx={{ width: 300 }}>
          <Typography variant="h6" align="center">
            {"Saving receipt..."}
          </Typography>
          <LinearProgress sx={{ width: "100%" }} />
        </Box>
      )}
      <ReceiptPreview
        complete={complete}
        transaction={transaction}
        taxpayer={taxpayer}
        groupedRequirements={groupedRequirements}
        independentRequirements={independentRequirements}
      />
      <Button size="large" variant="outlined" disabled={!receiptImageUrl} onClick={handleNextStep}>
        Review Self-Service Kiosk
      </Button>
    </Stack>
  );
}
