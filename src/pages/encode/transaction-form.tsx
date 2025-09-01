import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import type { TransactionNode } from "src/pages/requirements/types";

interface TransactionFormProps {
  node: TransactionNode;
  onCancel: () => void;
  onUpdate: (updatedNode: TransactionNode) => void;
  editMode: boolean;
}

interface FormDataTypes {
  name: string;
  fee: string;
  feeNotes: string;
  duration: string;
  service: string;
  category: string;
  format: "single-select" | "multi-select";
  publish: boolean;
};

const convertTransactionFee = (fee?: string): string[] => {
  if (fee?.includes(" — ")) {
    const amount = fee.split(" — ")[0].trim().replace("No Processing Fee", "0.00");
    const notes = fee.split(" — ")[1].trim();

    return [amount, notes];
  } else {
    return [fee || "", ""];
  }
};

export default function TransactionForm({
  node,
  onCancel,
  onUpdate,
  editMode,
}: TransactionFormProps) {
  const [formValues, setFormValues] = React.useState<FormDataTypes>({
    name: "",
    fee: "",
    feeNotes: "",
    duration: "",
    service: "",
    category: "",
    format: "single-select",
    publish: false,
  });

  React.useEffect(() => {
    const convertedFee = convertTransactionFee(node.fee);
    
    setFormValues({
      name: node.name || "",
      fee: convertedFee[0],
      feeNotes: convertedFee[1],
      duration: node.duration || "",
      service: node.service || "REGISTRATION",
      category: node.category || "",
      format: node.format || "single-select",
      publish: node.publish || false,
    });
  }, [node]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormValues({
      ...formValues,
      [e.target.name]: value,
    });
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onUpdate({
      ...node,
      name: formValues.name.split(/\s+/).join(" "),
      fee: formValues.feeNotes
        ? `${
            parseInt(formValues.fee) > 0 ? formValues.fee : "No Processing Fee"
          } — ${formValues.feeNotes}`
        : `${
            parseInt(formValues.fee) > 0 ? formValues.fee : "No Processing Fee"
          }`,
      duration: formValues.duration,
      service: formValues.service,
      category: formValues.category,
      format: formValues.format,
      publish: formValues.publish
    });
  };

  const handleCancel = () => {
    const convertedFee = convertTransactionFee(node.fee);
    
    setFormValues({
      name: node.name || "",
      fee: convertedFee[0],
      feeNotes: convertedFee[1],
      duration: node.duration || "",
      service: node.service || "REGISTRATION",
      category: node.category || "",
      format: node.format || "single-select",
      publish: node.publish || false,
    });

    onCancel();
  };

  return (
    <Grid
      component="form"
      container
      padding={2}
      spacing={3}
      onSubmit={handleSave}
      sx={{ mt: 2 }}
    >
      <Grid size={12}>
        <TextField
          label="Title"
          name="name"
          variant="outlined"
          fullWidth
          value={formValues.name}
          onChange={handleChange}
          disabled={!editMode}
          multiline
          rows={3}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Transaction Fee"
          name="fee"
          variant="outlined"
          fullWidth
          value={formValues.fee}
          onChange={handleChange}
          disabled={!editMode}
          type="number"
          placeholder="0.00"
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">₱</InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Transaction Fee Notes"
          name="feeNotes"
          variant="outlined"
          fullWidth
          value={formValues.feeNotes}
          onChange={handleChange}
          disabled={!editMode}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          label="Transaction Duration"
          name="duration"
          variant="outlined"
          fullWidth
          value={formValues.duration}
          onChange={handleChange}
          disabled={!editMode}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          label="Service"
          name="service"
          variant="outlined"
          fullWidth
          value={formValues.service}
          onChange={handleChange}
          disabled={!editMode}
          select
        >
          <MenuItem value="REGISTRATION">Registration</MenuItem>
          <MenuItem value="FILING & PAYMENT">Filing & Payment</MenuItem>
          <MenuItem value="CERTIFICATE & CLEARANCE">
            Certificate & Clearance
          </MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Category"
          name="category"
          variant="outlined"
          fullWidth
          value={formValues.category}
          onChange={handleChange}
          disabled={!editMode || formValues.service !== "REGISTRATION"}
          select
          required={formValues.service === "REGISTRATION"}
        >
          <MenuItem value="TIN Application">TIN Application</MenuItem>
          <MenuItem value="Business or Branch Registration">
            Business or Branch Registration
          </MenuItem>
          <MenuItem value="System or Permit Registration">
            System or Permit Registration
          </MenuItem>
          <MenuItem value="Closure of Business or Cancellation of Registration">
            Closure of Business or Cancellation of Registration
          </MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          label="Selection Type"
          name="format"
          variant="outlined"
          fullWidth
          value={formValues.format}
          onChange={handleChange}
          disabled={!editMode}
          select
        >
          <MenuItem value="single-select">Single-Select</MenuItem>
          <MenuItem value="multi-select">Multi-Select</MenuItem>
        </TextField>
      </Grid>
      <Grid size={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="publish"
              checked={formValues.publish}
              onChange={handleChange}
              disabled={!editMode}
            />
          }
          label="Publish Transaction to Kiosk?"
        />
      </Grid>
      {editMode && (
        <Grid size={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
