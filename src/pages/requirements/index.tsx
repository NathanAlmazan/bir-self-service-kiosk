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
  getDocs,
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

const ErrorSnackbar = React.lazy(() => import("./error"));
const UserAgreement = React.lazy(() => import("./agreement"));
const RequirementsQRCode = React.lazy(() => import("./qr-code"));

export type Requirements = {
  id: string;
  name: string;
  note?: string;
  group?: string;
  optional?: boolean;
  conditions: string[];
  source?: {
    label: string;
    link: string;
  };
};

export type Transaction = {
  id: string;
  name: string;
  fee: string;
  duration: string;
  service: string;
  category?: string;
  checklist?: {
    pdfLink: string;
    imageLink: string;
  };
  requirements?: Requirements[];
};

export type Taxpayer = {
  uuid: string;
  firstName: string;
  lastName: string;
  rdo: string;
  contact: string;
  taxpayerName: string;
  taxpayerTIN: string;
  submittedAt: string;
  privacyPolicyA: boolean;
  privacyPolicyB: boolean;
  privacyPolicyC: boolean;
};

// utility function to extract unique tags from requirements
type CategoryNode = Record<string, { __children: CategoryNode }>;

function buildCategoryTree(requirements: Requirements[]) {
  const root: CategoryNode = {};
  requirements.forEach((req) => {
    let current: CategoryNode = root;
    req.conditions.forEach((cond) => {
      if (!current[cond]) {
        current[cond] = { __children: {} };
      }
      current = current[cond].__children;
    });
  });
  return root;
}

// utility function to filter requirements by selected conditions
const filterRequirementsByConditions = (
  requirements: Requirements[],
  conditionsMet: string[]
): Requirements[] => {
  if (conditionsMet.length === 0) {
    return requirements; // return all requirements if no conditions are met
  }

  return requirements.filter(
    (req) =>
      req.conditions &&
      req.conditions.every((cond) => conditionsMet.includes(cond))
  );
};

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

type ServiceType =
  | "REGISTRATION"
  | "FILING & PAYMENT"
  | "CERTIFICATE & CLEARANCE"
  | "AUDIT & INVESTIGATION"
  | "COMPLIANCE & ENFORCEMENT";

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
    // get week range
    const now = new Date(submittedAt);
    const dayOfWeek = now.getDay();

    // calculate start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // calculate end of week (Saturday)
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);

    const countQuery = query(
      collection(db, "taxpayers"),
      where("service", "==", service),
      where("submittedAt", ">=", Timestamp.fromDate(startOfWeek)),
      where("submittedAt", "<", Timestamp.fromDate(endOfWeek))
    );

    const snapshot = await getCountFromServer(countQuery);
    const currentCount = snapshot.data().count;

    return `${now.getTime()}-${serviceCode[service]}-${(currentCount + 1)
      .toString()
      .padStart(4, "0")}`;
  } catch (error) {
    throw new Error("Failed to generate UUID: " + error);
  }
};

export default function RequirementsPage() {
  const { uuid } = useParams();

  // ========================= Navigation =========================
  const router = useRouter();
  const handleNavigateBack = () => router.back();
  const handleNavigateHome = () => router.push("/services");

  // ===================== Transaction Data =====================
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transaction, setTransaction] = React.useState<Transaction>();

  React.useEffect(() => {
    const fetchTransaction = async () => {
      if (!uuid) {
        router.push("/404");
        return;
      }

      try {
        setIsLoading(true);
        const transactionRef = doc(db, "transactions", uuid);
        const transactionSnap = await getDoc(transactionRef);

        const requirementsRef = collection(transactionRef, "requirements");
        const requirementsSnap = await getDocs(requirementsRef);

        if (transactionSnap.exists() && !requirementsSnap.empty) {
          const data = {
            id: transactionSnap.id,
            requirements: requirementsSnap.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Requirements)
            ),
            ...transactionSnap.data(),
          } as Transaction;
          setTransaction(data);
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
  const conditionTree = React.useMemo(
    () => buildCategoryTree(transaction?.requirements || []),
    [transaction]
  );
  const [conditionsMet, setConditionsMet] = React.useState<string[]>([]);

  // current node from tree based on path
  const currentNode = React.useMemo(() => {
    let node = conditionTree;
    for (const p of conditionsMet) {
      node = node[p]?.__children || {};
    }
    return node;
  }, [conditionsMet, conditionTree]);

  // automatically add 'DEFAULT' category if available
  React.useEffect(() => {
    if (currentNode["DEFAULT"]) {
      setConditionsMet((prev) => [...prev, "DEFAULT"]);
    }
  }, [currentNode]);

  const toggleCategory = (category: string) => {
    setConditionsMet((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ======================= Page Tab State =======================
  const [steps, setSteps] = React.useState<string[]>([]);
  const [activeStep, setActiveStep] = React.useState<number>(0);

  // dynamically set steps based on available categories
  React.useEffect(() => {
    const baseSteps = ["Verify Requirements", "Provide Details", "Get Receipt"];

    if (transaction?.requirements && transaction.requirements.length > 0) {
      // collect all unique conditions from requirements
      const conditions = new Set<string>();
      transaction.requirements.forEach((req) => {
        req.conditions.forEach((condition) => {
          conditions.add(condition);
        });
      });

      // include "Select Category" step if there are multiple unique conditions
      if (conditions.size > 1) {
        setSteps(["Select Category", ...baseSteps]);
      } else {
        // skip "Select Category" step if only one or no conditions
        setSteps(baseSteps);
      }
    }
  }, [transaction]);

  // automatically go to next step if all available conditions are selected
  React.useEffect(() => {
    if (
      activeStep === 0 &&
      conditionsMet.length > 0 &&
      Object.keys(currentNode).length === 0
    ) {
      setActiveStep((step) => step + 1);
    }
  }, [activeStep, conditionsMet, currentNode]);

  const handleNextStep = () => {
    if (activeStep <= steps.length) {
      setActiveStep((step) => step + 1);
    }
  };

  const handlePreviousStep = () => {
    // allow resetting conditions if going back to category selection
    if (activeStep === 1) {
      setConditionsMet([]);
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
  const [filteredRequirements, setFilteredRequirements] = React.useState<
    Requirements[]
  >([]);
  const [missingRequirements, setMissingRequirements] = React.useState<
    Requirements[]
  >([]);
  const [completeRequirements, setCompleteRequirements] =
    React.useState<boolean>(false);

  // filtered requirements based on selected categories
  React.useEffect(() => {
    if (transaction?.requirements) {
      const filtered = filterRequirementsByConditions(
        transaction.requirements,
        conditionsMet
      );
      setFilteredRequirements(filtered);
    }
  }, [transaction, conditionsMet]);

  // handle missing requirements
  React.useEffect(() => {
    if (filteredRequirements.length > 0 && checkedRequirements.length > 0) {
      const missing = getMissingRequirements(
        filteredRequirements,
        checkedRequirements
      );

      if (missing.length === 0) {
        setCompleteRequirements(true);
        setMissingRequirements([]);
      } else {
        setCompleteRequirements(false);
        setMissingRequirements(missing);
      }
    }
  }, [filteredRequirements, checkedRequirements]);

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
        complete: completeRequirements,
        submittedAt: Timestamp.fromDate(submittedAt),
        transaction: transaction.name,
        checked: checkedRequirements.map((id) =>
          doc(db, "transactions", transaction.id, "requirements", id)
        ),
        // only include missing requirements if not complete
        ...(completeRequirements
          ? {}
          : {
              missing: missingRequirements.map((req) =>
                doc(db, "transactions", transaction.id, "requirements", req.id)
              ),
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
        <Container maxWidth="md" sx={{ zIndex: 2 }}>
          <Grid container spacing={4}>
            {/* Page Header */}
            <Grid size={12}>
              <RequirementsHeader
                title={transaction.name}
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
                        selected={conditionsMet}
                        categories={Object.keys(currentNode)}
                        toggleCategory={toggleCategory}
                        handlePreviousStep={handlePreviousStep}
                        handleNextStep={handleNextStep}
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
                        requirements={filteredRequirements}
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
