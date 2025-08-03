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
} from "firebase/firestore";
// Components
import Fallback from "src/components/fallback";
import RequirementsHeader from "./header";
import RequirementsCategories from "./categories";
import RequirementsChecklist from "./checklist";
import TaxpayerForm from "./form";
import PrintReceiptForm from "./print";
import KioskReviewForm from "./review";

const ErrorSnackbar = React.lazy(() => import("./error"));
const RequirementsQRCode = React.lazy(() => import("./qr-code"));

export type Requirements = {
  name: string;
  note?: string;
  tags: string[];
  source?: string;
};

export type Transaction = {
  id: string;
  name: string;
  duration: string;
  fee: string;
  service: string;
  category: string;
  requirements?: Requirements[];
};

export type Taxpayer = {
  uuid: string;
  firstName: string;
  lastName: string;
  rdo: string;
  contact: string;
  taxpayerName: string;
  tin: string;
  submittedAt: string;
};

// utility function to extract unique tags from requirements
const getUniqueTagsFromRequirements = (
  requirements: Requirements[]
): string[] => {
  const allTags = requirements.flatMap((req) => req.tags || []);
  return Array.from(new Set(allTags)).sort(); // sort alphabetically for consistency
};

// utility function to filter requirements by selected categories/tags
const filterRequirementsByTags = (
  requirements: Requirements[],
  selectedTags: string[]
): Requirements[] => {
  if (selectedTags.length === 0) {
    return requirements; // return all requirements if no tags are selected
  }

  return requirements.filter(
    (req) => req.tags && req.tags.every((tag) => selectedTags.includes(tag))
  );
};

// utility function to compare requirements and find missing ones
const getMissingRequirements = (
  allRequirements: Requirements[],
  checkedRequirementNames: string[]
): Requirements[] => {
  return allRequirements.filter(
    (req) => !checkedRequirementNames.includes(req.name)
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
    REGISTRATION: "A",
    "FILING & PAYMENT": "B",
    "CERTIFICATE & CLEARANCE": "C",
    "AUDIT & INVESTIGATION": "D",
    "COMPLIANCE & ENFORCEMENT": "E",
  };

  try {
    // get date range (start and end of day)
    const today = new Date(submittedAt);
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const countQuery = query(
      collection(db, "taxpayers"),
      where("submittedAt", ">=", startOfDayISO),
      where("submittedAt", "<", endOfDayISO)
    );

    const snapshot = await getCountFromServer(countQuery);
    const currentCount = snapshot.data().count;

    return `${today.getTime()}-${serviceCode[service]}-${(currentCount + 1)
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
  const handleNavigateHome = () => router.push("/");

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
              (doc) => doc.data() as Requirements
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
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    if (transaction?.requirements) {
      // extract unique tags from all requirements
      const uniqueTags = getUniqueTagsFromRequirements(
        transaction.requirements
      );
      setCategories(uniqueTags);
    }
  }, [transaction]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
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

    if (categories.length > 0) {
      // include "Select Category" step if there are categories to choose from
      setSteps(["Select Category", ...baseSteps]);
    } else {
      // skip "Select Category" step if no categories available
      setSteps(baseSteps);
    }
  }, [categories, transaction]);

  const handleNextStep = () => {
    if (activeStep <= steps.length) {
      setActiveStep((step) => step + 1);
    }
  };

  const handlePreviousStep = () => {
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

  // filtered requirements based on selected categories
  React.useEffect(() => {
    if (transaction?.requirements) {
      const filtered = filterRequirementsByTags(
        transaction.requirements,
        selectedCategories
      );
      setFilteredRequirements(filtered);
    }
  }, [transaction, selectedCategories]);

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
    tin: "",
    submittedAt: ""
  });
  const [isSubmittingForm, setIsSubmittingForm] =
    React.useState<boolean>(false);
  const [completeRequirements, setCompleteRequirements] =
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

      // calculate completion status
      const complete = Boolean(
        filteredRequirements.length === checkedRequirements.length
      );
      const missing = complete
        ? []
        : getMissingRequirements(filteredRequirements, checkedRequirements);

      setMissingRequirements(missing);
      setCompleteRequirements(complete);

      const submittedAt = new Date().toISOString();

      // prepare taxpayer data for submission
      const taxpayerSubmissionData = {
        firstName: taxpayerData.firstName,
        lastName: taxpayerData.lastName,
        rdo: taxpayerData.rdo,
        contact: taxpayerData.contact,
        taxpayerName: taxpayerData.taxpayerName,
        tin: taxpayerData.tin,
        complete,
        submittedAt,
        transaction: doc(db, "transactions", transaction.id),
        checked: checkedRequirements,
        categories: selectedCategories,
        // only include missing requirements if not complete
        ...(complete ? {} : { missing: missing.map((req) => req.name) }),
      };

      // use setDoc with the auto-incremented ID instead of addDoc
      const autoIncrementedId = await getNextDocumentId(
        transaction.service as ServiceType,
        submittedAt
      );
      const docRef = doc(db, "taxpayers", autoIncrementedId);
      await setDoc(docRef, taxpayerSubmissionData);

      // update local state with the generated UUID
      setTaxpayerData((prev) => ({
        ...prev,
        submittedAt,
        uuid: autoIncrementedId,
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
                        selected={selectedCategories}
                        categories={categories}
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
                        handleToggle={handleToggleRequirements}
                        handleNextStep={handleNextStep}
                        handlePreviousStep={handlePreviousStep}
                        showQRCode={showQRCode}
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
                        handleSubmit={handleSubmitTaxpayerForm}
                        handlePreviousStep={handlePreviousStep}
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
        </Container>
      )}
    </>
  );
}
