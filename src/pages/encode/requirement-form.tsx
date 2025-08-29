import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import type { TransactionNode } from "src/pages/requirements/types";

interface RequirementFormProps {
  node: TransactionNode;
  onCancel: () => void;
  onUpdate: (updatedNode: TransactionNode) => void;
  editMode: boolean;
}

export default function RequirementForm({
  node,
  onCancel,
  onUpdate,
  editMode,
}: RequirementFormProps) {
  const [formValues, setFormValues] = React.useState({
    name: node.name,
    note: node.note || "",
    group: node.group || "",
    optional: node.optional || false,
    sourceLabel: node.source?.label || "",
    sourceLink: node.source?.link || "",
  });

  React.useEffect(() => {
    // Reset form when node changes
    setFormValues({
      name: node.name,
      note: node.note || "",
      group: node.group || "",
      optional: node.optional || false,
      sourceLabel: node.source?.label || "",
      sourceLink: node.source?.link || "",
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
      note: formValues.note
        ? formValues.note.split(/\s+/).join(" ")
        : undefined,
      group: formValues.group ? formValues.group.toUpperCase() : undefined,
      optional: formValues.optional,
      source: formValues.sourceLabel
        ? {
            label: formValues.sourceLabel,
            link: formValues.sourceLink,
          }
        : undefined,
    });
  };

  const handleCancel = () => {
    setFormValues({
      name: node.name || "",
      note: node.note || "",
      group: node.group || "",
      optional: node.optional || false,
      sourceLabel: node.source?.label || "",
      sourceLink: node.source?.link || "",
    });

    onCancel();
  };

  return (
    <Grid
      component="form"
      container
      padding={2}
      spacing={2}
      onSubmit={handleSave}
    >
      <Grid size={12}>
        <Typography variant="h4">Requirement Details</Typography>
      </Grid>
      <Grid size={12}>
        <TextField
          label="Document"
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
      <Grid size={12}>
        <TextField
          label="Note"
          name="note"
          variant="outlined"
          fullWidth
          value={formValues.note}
          onChange={handleChange}
          disabled={!editMode}
          multiline
          rows={2}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label="Group"
          name="group"
          variant="outlined"
          fullWidth
          value={formValues.group}
          onChange={handleChange}
          disabled={!editMode}
          helperText="Optional field if requirement belongs to a group."
          inputProps={{
            style: { textTransform: "uppercase" },
          }}
        />
      </Grid>
      <Grid size={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="optional"
              checked={formValues.optional}
              onChange={handleChange}
              disabled={!editMode}
            />
          }
          label="Optional Requirement"
        />
      </Grid>
      <Grid size={12}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">Document Source</Typography>
          <Typography variant="body2">
            Optional fields to enable download of BIR Forms via generated QR
            Code.
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Label"
          name="sourceLabel"
          variant="outlined"
          fullWidth
          value={formValues.sourceLabel}
          onChange={handleChange}
          disabled={!editMode}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Link"
          name="sourceLink"
          variant="outlined"
          fullWidth
          value={formValues.sourceLink}
          onChange={handleChange}
          disabled={!editMode}
          type="url"
          required={!!formValues.sourceLabel}
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
