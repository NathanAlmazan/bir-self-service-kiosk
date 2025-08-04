import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import type { Taxpayer } from ".";

type FormProps = {
  taxpayerData: Taxpayer;
  isSubmitting: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAgreementOpen: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handlePreviousStep: () => void;
};

export default function TaxpayerForm({
  taxpayerData,
  isSubmitting,
  handleInputChange,
  handleCheckboxChange,
  handleAgreementOpen,
  handleSubmit,
  handlePreviousStep,
}: FormProps) {
  const { firstName, lastName, rdo, contact, taxpayerName, tin, privacyPolicyA, privacyPolicyB, privacyPolicyC } = taxpayerData;
  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h6" align="center">
              Fill in the following details, if applicable.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
              variant="outlined"
              label="First Name"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              variant="outlined"
              label="Last Name"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              variant="outlined"
              select
              name="rdo"
              value={rdo}
              onChange={handleInputChange}
              label="RDO"
              fullWidth
              defaultValue={offices[0].name}
              required
            >
              {offices.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name + " — " + option.area}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              name="contact"
              value={contact}
              onChange={handleInputChange}
              variant="outlined"
              label="Email Address / Contact Number"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="taxpayerName"
              value={taxpayerName}
              onChange={handleInputChange}
              variant="outlined"
              label="Taxpayer Name (Optional)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="tin"
              value={tin}
              onChange={handleInputChange}
              variant="outlined"
              label="TIN (Optional)"
            />
          </Grid>
          <Grid size={12}>
            <FormGroup>
              <FormControlLabel
                required
                control={<Checkbox name="privacyPolicyA" checked={privacyPolicyA} onChange={handleCheckboxChange} />}
                label={
                  <Typography variant="body2" component="span">
                    {
                      "I hereby authorize to collect and process the data indicated herein."
                    }
                    <Button
                      onClick={handleAgreementOpen}
                      color="primary"
                      variant="text"
                      sx={{ typography: "body2" }}
                    >
                      Please see User Agreement.
                    </Button>
                  </Typography>
                }
              />
              <FormControlLabel
                required
                control={<Checkbox name="privacyPolicyB" checked={privacyPolicyB} onChange={handleCheckboxChange} />}
                label={
                  <>
                    I have understood the BIR Privacy at{" "}
                    <Box
                      component="span"
                      sx={{ color: "primary.main", fontStyle: "italic" }}
                    >
                      https://www.bir.gov.ph/index.php/privacy-notice.html
                    </Box>
                    .
                  </>
                }
              />
              <FormControlLabel
                required
                control={<Checkbox name="privacyPolicyC" checked={privacyPolicyC} onChange={handleCheckboxChange} />}
                label={
                  <>
                    I understand that any personal information is protected by{" "}
                    <Box
                      component="span"
                      sx={{ fontWeight: "bold", fontStyle: "italic" }}
                    >
                      RA 10173, Data Privacy Act of 2012
                    </Box>
                    .
                  </>
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "#E6F3FF",
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePreviousStep}
          startIcon={<ArrowBackIosNewOutlinedIcon />}
        >
          Go Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowForwardIosOutlinedIcon />}
          loading={isSubmitting}
        >
          Proceed
        </Button>
      </CardActions>
    </Card>
  );
}

const offices = [
  {
    name: "RDO No. 29",
    area: "Tondo - San Nicolas",
  },
  {
    name: "RDO No. 30",
    area: "Binondo",
  },
  {
    name: "RDO No. 31",
    area: "Sta. Cruz",
  },
  {
    name: "RDO No. 32",
    area: "Quiapo-Sampaloc-San Miguel-Sta. Mesa",
  },
  {
    name: "RDO No. 33",
    area: "Ermita-Intramuros-Malate",
  },
  {
    name: "RDO No. 34",
    area: "Paco-Pandacan-Sta. Ana-San Andres",
  },
  {
    name: "RDO No. 36",
    area: "Puerto Princesa City, Palawan",
  },
];
