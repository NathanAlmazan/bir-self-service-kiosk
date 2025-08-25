import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import type { FormNode } from ".";

interface ConditionFormProps {
  node: FormNode;
  onCancel: () => void;
  onUpdate: (updatedNode: FormNode) => void;
  editMode: boolean;
}

export default function ConditionForm({
  node,
  onUpdate,
  onCancel,
  editMode,
}: ConditionFormProps) {
  const [formValues, setFormValues] = React.useState({
    name: node.name,
  });

  React.useEffect(() => {
    setFormValues({ name: node.name });
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
    });
  };

  const handleCancel = () => {
    setFormValues({ name: node.name });
    onCancel();
  };

  return (
    <Stack
      component="form"
      direction="column"
      padding={2}
      spacing={2}
      onSubmit={handleSave}
    >
      <Typography variant="h4">Condition Details</Typography>
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
      {editMode && (
        <Stack direction="row" justifyContent="flex-end" spacing={1} marginTop={2}>
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
