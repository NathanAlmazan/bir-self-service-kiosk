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
// Animation
import { motion, AnimatePresence } from "motion/react";
// Firebase
import { db } from "src/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getCountFromServer,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
// Components
import Fallback from "src/components/fallback";
import RequirementsHeader from "./header";
import RequirementsCategories from "./conditions";
import RequirementsChecklist from "./checklist";
import TaxpayerForm from "./form";
import PrintReceiptForm from "./print";
import KioskReviewForm from "./review";
// Types
import type {
  Transaction,
  TransactionNode,
  Requirements,
  Taxpayer,
  ServiceType,
} from "./types";
import { TransactionsStatus } from "./types";

const ErrorSnackbar = React.lazy(() => import("./error"));
const UserAgreement = React.lazy(() => import("./agreement"));
const RequirementsQRCode = React.lazy(() => import("./qr-code"));

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

// utility function to get next auto-incremented document ID
const getNextDocumentId = async (
  service: ServiceType,
  submittedAt: string
): Promise<string> => {
  const serviceCode: Record<ServiceType, string> = {
    "REGISTRATION": "A",
    "FILING & PAYMENT": "B",
    "CERTIFICATE & CLEARANCE": "C",
    "AUDIT & INVESTIGATION": "D",
    "COMPLIANCE & ENFORCEMENT": "E",
  };

  try {
    const dateSubmitted = new Date(submittedAt);
    // start of year
    const startYear = new Date(dateSubmitted.getFullYear(), 0, 1);
    // end of year
    const endYear = new Date(dateSubmitted.getFullYear(), 11, 31);

    const countQuery = query(
      collection(db, "taxpayers"),
      where("service", "==", service),
      where("submittedAt", ">=", Timestamp.fromDate(startYear)),
      where("submittedAt", "<", Timestamp.fromDate(endYear))
    );

    const snapshot = await getCountFromServer(countQuery);
    const currentCount = String(snapshot.data().count + 1).padStart(5, "0");
    const month = String(dateSubmitted.getMonth() + 1).padStart(2, "0");
    const year = String(dateSubmitted.getFullYear()).slice(-2);

    return `${dateSubmitted.getTime()}-${
      serviceCode[service]
    }-${month}${year}-${currentCount}`;
  } catch (error) {
    throw new Error("Failed to generate UUID: " + error);
  }
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
  const handleNavigateBack = () => router.back();
  const handleNavigateHome = () => router.push("/kiosk/services");

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

  React.useEffect(() => {
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
  }, [selectedNodes, transactionNode]);

  const handleToggleNodes = (id: string, queue: boolean, forward: boolean) => {
    // update selected node
    setSelectedNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );

    if (queue || forward) {
      let tempQueue = nodeQueue;

      if (queue) {
        tempQueue = tempQueue.includes(id)
          ? tempQueue.filter((nodeId) => nodeId !== id)
          : [...tempQueue, id];
      }

      if (forward) {
        tempQueue = tempQueue.slice(1);

        if (tempQueue.length > 0) {
          const nextNode = findNodeById(tempQueue[0], transactionNode);
          setCurrentNode(nextNode || root);
        } else {
          setCurrentNode(transactionNode);
          setActiveStep((step) => step + 1);
        }
      }

      setNodeQueue(tempQueue);
    }
  };

  const handleQueueForward = () => {
    const queue = nodeQueue.slice(1);

    setNodeQueue(queue);

    if (queue.length > 0) {
      const nextNode = findNodeById(queue[0], transactionNode);
      setCurrentNode(nextNode || root);
    } else {
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
      const reqs: Requirements[] =
        transactionNode.children
          ?.filter((child) => child.type === "requirement")
          .map((req) => ({
            id: req.id,
            name: req.name,
            note: req.note,
            group: req.group,
            optional: req.optional,
            source: req.source,
          })) || [];

      setRequirements(reqs);
      setCurrentNode(transactionNode);
      setSteps(baseSteps);
    }
  }, [transactionNode]);

  const handleNextStep = () => {
    if (activeStep <= steps.length) {
      setActiveStep((step) => step + 1);
    }
  };

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
      handleNavigateBack();
    }
  };

  // ======================= Requirements State =======================
  const [checkedRequirements, setCheckedRequirements] = React.useState<
    string[]
  >([]);
  const [missingRequirements, setMissingRequirements] = React.useState<
    Requirements[]
  >([]);
  const [completeRequirements, setCompleteRequirements] =
    React.useState<boolean>(false);

  // handle missing requirements
  React.useEffect(() => {
    if (requirements.length > 0 && checkedRequirements.length > 0) {
      const missing = getMissingRequirements(requirements, checkedRequirements);

      if (missing.length === 0) {
        setCompleteRequirements(true);
        setMissingRequirements([]);
      } else {
        setCompleteRequirements(false);
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

  // ======================= Form State =======================
  const [taxpayerData, setTaxpayerData] = React.useState<Taxpayer>({
    uuid: "",
    firstName: "",
    lastName: "",
    rdo: "",
    contact: "",
    taxpayerName: "",
    taxpayerTIN: "",
    submittedAt: "",
    privacyPolicyA: false,
    privacyPolicyB: false,
    privacyPolicyC: false,
  });
  const [isSubmittingForm, setIsSubmittingForm] =
    React.useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaxpayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTaxpayerData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmitTaxpayerForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!transaction) {
      setErrorMessage("Transaction data is not available.");
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      setIsSubmittingForm(true);

      const submittedAt = new Date();

      // prepare taxpayer data for submission
      const taxpayerSubmissionData = {
        firstName: taxpayerData.firstName,
        lastName: taxpayerData.lastName,
        rdo: taxpayerData.rdo,
        contact: taxpayerData.contact,
        taxpayerName: taxpayerData.taxpayerName,
        taxpayerTIN: taxpayerData.taxpayerTIN,
        service: transaction.service.toUpperCase(),
        category: transaction.category?.toUpperCase(),
        status: completeRequirements
          ? TransactionsStatus.COMPLETE_REQUIREMENTS
          : TransactionsStatus.INCOMPLETE_REQUIREMENTS,
        submittedAt: Timestamp.fromDate(submittedAt),
        transaction: transaction.title,
        checked: requirements.filter((req) => checkedRequirements.includes(req.id)).map((req) => req.name),
        // only include missing requirements if not complete
        ...(completeRequirements
          ? {}
          : {
              missing: missingRequirements.map((req) => req.name),
            }),
      };

      // use setDoc with the auto-incremented ID instead of addDoc
      const autoIncrementedId = await getNextDocumentId(
        transaction.service.toUpperCase() as ServiceType,
        submittedAt.toISOString()
      );
      const docRef = doc(db, "taxpayers", autoIncrementedId);
      await setDoc(docRef, taxpayerSubmissionData);

      // update local state with the generated UUID
      setTaxpayerData((prev) => ({
        ...prev,
        uuid: autoIncrementedId,
        submittedAt: submittedAt.toISOString(),
      }));

      handleNextStep();
    } catch (error) {
      console.error("Error submitting taxpayer data:", error);
      setErrorMessage(
        "Failed to submit taxpayer data. Please contact support."
      );
      setErrorSnackbarOpen(true);
    } finally {
      setIsSubmittingForm(false);
    }
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

  // ========================== Review Kiosk ===========================
  const handleRatingChange = async (rating: number) => {
    if (!taxpayerData.uuid) {
      setErrorMessage("Unable to submit rating. Please try again.");
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      // update the taxpayer document with the rating
      const taxpayerDocRef = doc(db, "taxpayers", taxpayerData.uuid);
      await updateDoc(taxpayerDocRef, {
        rating: rating,
      });

      handleNavigateHome();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setErrorMessage("Failed to submit rating. Please try again.");
      setErrorSnackbarOpen(true);
    }
  };

  // ========================= Error Handling =========================
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);

  const handleErrorClose = () => {
    setErrorSnackbarOpen(false);
  };

  // ========================= User Aggreeement State =========================
  const [agreementOpen, setAgreementOpen] = React.useState<boolean>(false);

  const handleAgreementOpen = () => {
    setAgreementOpen(true);
  };

  const handleAgreementClose = (agreed: boolean) => {
    setAgreementOpen(false);
    // update local state with privacy policy agreement status
    setTaxpayerData((prev) => ({
      ...prev,
      privacyPolicyA: agreed,
    }));
  };

  return (
    <>
      {isLoading || !transaction || steps.length === 0 ? (
        <Fallback />
      ) : (
        <Container maxWidth="md" sx={{ zIndex: 2, marginBottom: 8 }}>
          <Grid container spacing={4}>
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
                        disabled={requirements.length === 0}
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
                        handleNextStep={handleNextStep}
                        showQRCode={showQRCode}
                        handlePreviousStep={handlePreviousStep}
                      />
                    </motion.div>
                  )}

                  {/* Provide Details Step */}
                  {steps[activeStep] === "Provide Details" && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaxpayerForm
                        taxpayerData={taxpayerData}
                        isSubmitting={isSubmittingForm}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleAgreementOpen={handleAgreementOpen}
                        handleSubmit={handleSubmitTaxpayerForm}
                      />
                    </motion.div>
                  )}

                  {/* Get Receipt */}
                  {steps[activeStep] === "Get Receipt" && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PrintReceiptForm
                        taxpayer={taxpayerData}
                        transaction={transaction}
                        complete={completeRequirements}
                        handleNextStep={handleNextStep}
                        missingRequirements={missingRequirements}
                        showQRCode={showQRCode}
                      />
                    </motion.div>
                  )}

                  {/* Review Kiosk */}
                  {activeStep === steps.length && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <KioskReviewForm
                        handleSubmitRating={handleRatingChange}
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

          {errorSnackbarOpen && errorMessage && (
            <React.Suspense>
              <ErrorSnackbar
                open={errorSnackbarOpen}
                message={errorMessage}
                handleClose={handleErrorClose}
              />
            </React.Suspense>
          )}

          {agreementOpen && (
            <React.Suspense>
              <UserAgreement
                open={agreementOpen}
                handleClose={handleAgreementClose}
              />
            </React.Suspense>
          )}
        </Container>
      )}
    </>
  );
}
