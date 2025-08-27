import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

import type { FormNode } from ".";

interface TransactionFormProps {
  node: FormNode;
  onCancel: () => void;
  onUpdate: (updatedNode: FormNode) => void;
  editMode: boolean;
}

export default function TransactionForm({
  node,
  onCancel,
  onUpdate,
  editMode,
}: TransactionFormProps) {
  const [formValues, setFormValues] = React.useState({
    name: "",
    fee: "",
    feeNotes: "",
    duration: "",
    service: "",
    category: "",
  });

  React.useEffect(() => {
    setFormValues({
      name: node.name || "",
      fee: node.fee?.includes(" — ")
        ? node.fee.split(" — ")[0].trim()
        : node.fee || "",
      feeNotes: node.fee?.includes(" — ")
        ? node.fee.split(" — ")[1].trim()
        : "",
      duration: node.duration || "",
      service: node.service || "REGISTRATION",
      category: node.category || "",
    });
  }, [node]);

  React.useEffect(() => {
    if (formValues.service !== "REGISTRATION") {
      setFormValues((prev) => ({ ...prev, category: "" }));
    }
  }, [formValues.service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
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
    });
  };

  const handleCancel = () => {
    setFormValues({
      name: node.name || "",
      fee: node.fee?.includes(" — ")
        ? node.fee.split(" — ")[0].trim()
        : node.fee || "",
      feeNotes: node.fee?.includes(" — ")
        ? node.fee.split(" — ")[1].trim()
        : "",
      duration: node.duration || "",
      service: node.service || "REGISTRATION",
      category: node.category || "",
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
    >
      <Grid size={12}>
        <Typography variant="h4">Transaction Details</Typography>
      </Grid>
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
