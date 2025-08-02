import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { motion, AnimatePresence } from "motion/react";

import RequirementsHeader from "./header";
import RequirementsCategories from "./categories";
import RequirementsChecklist from "./checklist";
import TaxpayerForm from "./form";
import PrintReceiptForm from "./print";
import KioskReviewForm from "./review";

const RequirementsQRCode = React.lazy(() => import("./qr-code"));

export type Requirements = {
  name: string;
  note?: string;
  url?: {
    label: string;
    link: string;
  };
};

export type Taxpayer = {
  firstName: string;
  lastName: string;
  rdo: string;
  contact: string;
  taxpayerName: string;
  tin: string;
};

export default function RequirementsPage() {
  // const { transaction } = useParams();

  // ========================= Navigation =========================
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate(-1);
  const handleNavigateHome = () => navigate("/");

  // ======================= Page Tab State =======================
  const [activeStep, setActiveStep] = React.useState<number>(0);

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

  // ====================== Requirements Categories State ======================
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ======================= Requirements State =======================
  const [checkedReq, setCheckedReq] = React.useState<string[]>([]);
  const handleToggleRequirements = (value: string) => () => {
    const currentIndex = checkedReq.indexOf(value);
    const newChecked = [...checkedReq];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedReq(newChecked);
  };

  // ======================= Form State =======================
  const [taxpayerData, setTaxpayerData] = React.useState<Taxpayer>({
    firstName: "",
    lastName: "",
    rdo: "",
    contact: "",
    taxpayerName: "",
    tin: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaxpayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmitTaxpayerForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Taxpayer Data Submitted:", taxpayerData);
    handleNextStep();
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
  const handleRatingChange = (rating: number) => {
    console.log("Rating submitted:", rating);
    handleNavigateHome();
  };

  return (
    <Container maxWidth="md" sx={{ zIndex: 2 }}>
      <Grid container spacing={4}>
        <Grid size={12}>
          <RequirementsHeader
            title="Application for Taxpayer Identification Number (TIN) of Local Employee - Online thru ORUS"
            duration="3 Days Total Processing Time"
            fee="No Processing Fee"
          />
        </Grid>
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
              {activeStep === 0 && (
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

              {activeStep === 1 && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <RequirementsChecklist
                    checked={checkedReq}
                    requirements={requirements}
                    handleToggle={handleToggleRequirements}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    showQRCode={showQRCode}
                  />
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaxpayerForm
                    taxpayerData={taxpayerData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmitTaxpayerForm}
                    handlePreviousStep={handlePreviousStep}
                  />
                </motion.div>
              )}
              {activeStep === 3 && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <PrintReceiptForm
                    complete={false}
                    missingReqs={[]}
                    handleNextStep={handleNextStep}
                  />
                </motion.div>
              )}

              {activeStep === 4 && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <KioskReviewForm handleSubmitRating={handleRatingChange} />
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
  );
}

const steps = [
  "Select Category",
  "Verify Requirements",
  "Provide Details",
  "Print Receipt",
];

const categories = [
  "Local Employee",
  "Married Female",
  "Foreign National/Alien Employee",
  "International Gaming Licensee (IGL) or POGO Employee",
];

const requirements: Requirements[] = [
  {
    name: "Any government-issued ID (e.g. PhilID/ePhilID, passport, driver's license) that shows the name, address, and birthdate of the applicant, in case the ID has no address, any proof of residence or business address. (1 scanned copy)",
    note: "IDs should be readable, untampered and contains consistent information with the application. Along with the scanned ID, upload a selfie photo of yourself holding the same ID.",
    url: {
      label: "Government-Issued ID",
      link: "https://example.com/government-issued-id",
    },
  },
  {
    name: "Marriage contract; (1 scanned copy)",
    note: "",
    url: {
      label: "Marriage Contract",
      link: "https://example.com/marriage-contract",
    },
  },
];
