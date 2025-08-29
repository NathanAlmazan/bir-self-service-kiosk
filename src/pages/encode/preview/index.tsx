import * as React from "react";
// Router
import { useParams } from "react-router-dom";
import { useRouter } from "src/routes/hooks";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Animation
import { motion, AnimatePresence } from "motion/react";
// Firebase
import { db } from "src/firebase";
import { doc, getDoc } from "firebase/firestore";
// Components
import Fallback from "src/components/fallback";
import RequirementsHeader from "src/pages/requirements/header";
import RequirementsCategories from "src/pages/requirements/conditions";
import RequirementsChecklist from "src/pages/requirements/checklist";
// Types
import type {
  Requirements,
  TransactionNode,
  Transaction,
} from "src/pages/requirements/types";

const RequirementsQRCode = React.lazy(
  () => import("src/pages/requirements/qr-code")
);

// utility function to compare requirements and find missing ones
const getMissingRequirements = (
  allRequirements: Requirements[],
  checkedRequirementsIds: string[]
): Requirements[] => {
  const checkedRequirements = allRequirements.filter((req) =>
    checkedRequirementsIds.includes(req.id)
  );
  const selectedReq = new Set(checkedRequirements.map((req) => req.id));
  const selectedGrp = new Set(
    checkedRequirements.filter((req) => req.group).map((req) => req.group)
  );

  return allRequirements.filter(
    (req) =>
      !selectedReq.has(req.id) &&
      !req.optional &&
      !(req.group && selectedGrp.has(req.group))
  );
};

const findNodeById = (
  id: string,
  node: TransactionNode
): TransactionNode | null => {
  if (node.id === id) return node;

  for (const child of node.children || []) {
    const result = findNodeById(id, child);
    if (result) return result;
  }

  return null;
};

const root: TransactionNode = {
  id: "",
  name: "",
  type: "condition",
  children: [],
};

export default function RequirementsPage() {
  const { uuid } = useParams();

  // ========================= Navigation =========================
  const router = useRouter();

  // ===================== Transaction Data =====================
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transaction, setTransaction] = React.useState<Transaction>();
  const [currentNode, setCurrentNode] = React.useState<TransactionNode>(root);
  const [nodeQueue, setNodeQueue] = React.useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = React.useState<string[]>([]);
  const [transactionNode, setTransactionNode] =
    React.useState<TransactionNode>(root);

  React.useEffect(() => {
    const fetchTransaction = async () => {
      if (!uuid) {
        router.push("/404");
        return;
      }

      try {
        setIsLoading(true);
        const transactionRef = doc(db, "charter", uuid);
        const transactionSnap = await getDoc(transactionRef);

        if (transactionSnap.exists()) {
          const data = transactionSnap.data();

          // initialize nodes
          setTransaction({
            id: transactionSnap.id,
            title: data.title,
            fee: data.fee,
            duration: data.duration,
            service: data.service,
            category: data.category,
          });

          setTransactionNode({
            id: "root",
            name: data.title,
            type: "condition",
            format: data.format,
            fee: data.fee,
            duration: data.duration,
            service: data.service,
            category: data.category,
            children: data.requirements || [],
          });

          setCurrentNode({
            id: "root",
            name: data.title,
            type: "condition",
            format: data.format,
            fee: data.fee,
            duration: data.duration,
            service: data.service,
            category: data.category,
            children: data.requirements || [],
          });

          // initialize queue
          setNodeQueue(["root"]);

          // initialize selection
          setSelectedNodes(["root"]);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [uuid, router]);

  // ====================== Requirements Categories State ======================
  const [requirements, setRequirements] = React.useState<Requirements[]>([]);

  const handleToggleNodes = (id: string, queue: boolean) => {
    // update selected node
    setSelectedNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );

    if (queue) {
      setNodeQueue((prev) =>
        prev.includes(id)
          ? prev.filter((nodeId) => nodeId !== id)
          : [...prev, id]
      );
    }
  };

  const handleQueueForward = () => {
    const queue = nodeQueue.slice(1);

    setNodeQueue(queue);

    if (queue.length > 0) {
      const nextNode = findNodeById(queue[0], transactionNode);
      setCurrentNode(nextNode || root);
    } else {
      const reqs: Requirements[] = [];

      for (const nodeId of selectedNodes) {
        const node = findNodeById(nodeId, transactionNode);
        if (node && node.type === "condition") {
          reqs.push(
            ...(node.children
              ?.filter((child) => child.type === "requirement")
              .map((req) => ({
                id: req.id,
                name: req.name,
                note: req.note,
                group: req.group,
                optional: req.optional,
                source: req.source,
              })) || [])
          );
        }
      }

      setRequirements(reqs);
      setCurrentNode(transactionNode);
      setActiveStep((step) => step + 1);
    }
  };

  // ======================= Page Tab State =======================
  const [steps, setSteps] = React.useState<string[]>([]);
  const [activeStep, setActiveStep] = React.useState<number>(0);

  // dynamically set steps based on available categories
  React.useEffect(() => {
    const baseSteps = ["Verify Requirements", "Provide Details", "Get Receipt"];

    if (
      transactionNode?.children &&
      transactionNode.children.filter((child) => child.type === "condition")
        .length > 0
    ) {
      setSteps(["Select Category", ...baseSteps]);
    } else {
      setSteps(baseSteps);
    }
  }, [transactionNode]);

  const handlePreviousStep = () => {
    // allow resetting conditions if going back to category selection
    if (activeStep === 1) {
      // reset selection
      setSelectedNodes([]);

      // reset current node
      setCurrentNode(transactionNode);

      // initialize queue
      setNodeQueue((prev) => [...prev, "root"]);

      // initialize selection
      setSelectedNodes((prev) => [...prev, "root"]);
    }

    if (activeStep > 0) {
      setActiveStep((step) => step - 1);
    } else {
      handleLeavePreview();
    }
  };

  // ======================= Requirements State =======================
  const [checkedRequirements, setCheckedRequirements] = React.useState<
    string[]
  >([]);
  const [missingRequirements, setMissingRequirements] = React.useState<
    Requirements[]
  >([]);

  // handle missing requirements
  React.useEffect(() => {
    if (requirements.length > 0 && checkedRequirements.length > 0) {
      const missing = getMissingRequirements(requirements, checkedRequirements);

      if (missing.length === 0) {
        setMissingRequirements([]);
      } else {
        setMissingRequirements(missing);
      }
    }
  }, [requirements, checkedRequirements]);

  const handleToggleRequirements = (value: string) => () => {
    const currentIndex = checkedRequirements.indexOf(value);
    const newChecked = [...checkedRequirements];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedRequirements(newChecked);
  };

  // ======================= Modal State =======================
  const [openModal, setOpenModal] = React.useState(false);
  const [qrCodeDetails, setQRCodeDetails] = React.useState<{
    label: string;
    link: string;
  }>();
  const toggleModal = () => {
    setOpenModal(!openModal);
  };
  const showQRCode = (label: string, link: string) => {
    setQRCodeDetails({ label, link });
    toggleModal();
  };

  const handleLeavePreview = () => {
    router.push("/dashboard/encode/" + uuid);
  };

  return (
    <>
      {isLoading || !transaction || steps.length === 0 ? (
        <Fallback />
      ) : (
        <Container maxWidth="lg" sx={{ zIndex: 2, marginBottom: 8 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 1,
              width: "100%",
              mb: 2,
            }}
          >
            <IconButton onClick={handleLeavePreview}>
              <ArrowBackIcon sx={{ color: "text.disabled" }} />
            </IconButton>
            <Typography variant="h4" sx={{ color: "text.disabled" }}>
              Preview Mode
            </Typography>
          </Box>
          <Grid
            container
            spacing={4}
            sx={{ border: "1px solid #818589", borderRadius: 2, padding: 2 }}
          >
            {/* Page Header */}
            <Grid size={12}>
              <RequirementsHeader
                title={transaction.title}
                duration={transaction.duration}
                fee={transaction.fee}
                checklist={transaction.checklist}
              />
            </Grid>
            {/* Transaction Steps */}
            <Grid size={12}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <AnimatePresence mode="wait">
                  {/* Select Categories Step */}
                  {steps[activeStep] === "Select Category" && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RequirementsCategories
                        node={currentNode}
                        selected={selectedNodes}
                        toggleNodes={handleToggleNodes}
                        handlePreviousStep={handlePreviousStep}
                        handleNextStep={handleQueueForward}
                      />
                    </motion.div>
                  )}

                  {/* Verify Requirements Step */}
                  {steps[activeStep] === "Verify Requirements" && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RequirementsChecklist
                        checked={checkedRequirements}
                        requirements={requirements}
                        missingRequirements={missingRequirements}
                        handleToggle={handleToggleRequirements}
                        handleNextStep={handleLeavePreview}
                        showQRCode={showQRCode}
                        handlePreviousStep={handlePreviousStep}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Grid>
          </Grid>

          {qrCodeDetails && (
            <React.Suspense>
              <RequirementsQRCode
                open={openModal}
                label={qrCodeDetails.label}
                link={qrCodeDetails.link}
                handleClose={toggleModal}
              />
            </React.Suspense>
          )}
        </Container>
      )}
    </>
  );
}
