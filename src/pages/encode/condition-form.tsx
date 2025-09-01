import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import type { TransactionNode } from "src/pages/requirements/types";

interface ConditionFormProps {
  node: TransactionNode;
  onCancel: () => void;
  onUpdate: (updatedNode: TransactionNode) => void;
  editMode: boolean;
}

export default function ConditionForm({
  node,
  onUpdate,
  onCancel,
  editMode,
}: ConditionFormProps) {
  const [formValues, setFormValues] = React.useState<{
    name: string;
    format: "single-select" | "multi-select";
  }>({
    name: node.name,
    format: "single-select",
  });

  React.useEffect(() => {
    setFormValues({ name: node.name, format: node.format || "single-select" });
  }, [node]);

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
      name: formValues.name,
      format: formValues.format,
    });
  };

  const handleCancel = () => {
    setFormValues({ name: node.name, format: node.format || "single-select" });
    onCancel();
  };

  return (
    <Stack
      component="form"
      direction="column"
      padding={2}
      spacing={3}
      onSubmit={handleSave}
      sx={{ mt: 2 }}
    >
      <TextField
        label="Condition"
        name="name"
        variant="outlined"
        fullWidth
        value={formValues.name}
        onChange={handleChange}
        disabled={!editMode}
        required
      />
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
      {editMode && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          marginTop={2}
        >
          <Button variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
          <Button variant="outlined" color="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
