import * as React from "react";
import { useParams } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SaveIcon from "@mui/icons-material/Save";
// Firebase
import { db } from "src/firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

import { uuidv4 } from "minimal-shared/utils";

import TreeNode from "./tree-node";
import { Scrollbar } from "src/components/scrollbar";

const ConditionForm = React.lazy(() => import("./condition-form"));
const TransactionForm = React.lazy(() => import("./transaction-form"));
const RequirementForm = React.lazy(() => import("./requirement-form"));
const DeleteDialog = React.lazy(() => import("./delete-dialog"));

export type FormNode = {
  id: string;
  name: string;
  type: "condition" | "requirement";
  // transaction fields
  fee?: string;
  duration?: string;
  service?: string;
  category?: string;
  // requirement fields
  note?: string;
  group?: string;
  optional?: boolean;
  source?: {
    label: string;
    link: string;
  };
  children?: FormNode[];
};

const root: FormNode = {
  id: "root",
  name: "",
  type: "condition",
  children: [],
};

const createNodeInTree = (
  tree: FormNode,
  parentNodeId: string,
  newNode: FormNode
): FormNode => {
  if (tree.id === parentNodeId) {
    return {
      ...tree,
      children: [...(tree.children || []), newNode],
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      createNodeInTree(child, parentNodeId, newNode)
    ),
  };
};

const updateNodeInTree = (tree: FormNode, nodeToUpdate: FormNode): FormNode => {
  if (tree.id === nodeToUpdate.id) {
    return nodeToUpdate;
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      updateNodeInTree(child, nodeToUpdate)
    ),
  };
};

const removeNodeFromTree = (
  tree: FormNode,
  nodeIdToRemove: string
): FormNode => {
  const childToRemove = tree.children?.find(
    (child) => child.id === nodeIdToRemove
  );

  if (childToRemove) {
    return {
      ...tree,
      children: [
        ...(tree.children?.filter((child) => child.id !== nodeIdToRemove) ||
          []),
      ],
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      removeNodeFromTree(child, nodeIdToRemove)
    ),
  };
};

export default function EncodePage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [selected, setSelected] = React.useState<FormNode>();
  const [formData, setFormData] = React.useState<FormNode>(root);
  const [editMode, setEditMode] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchTransaction = async () => {
      if (!uuid) {
        return;
      }

      try {
        const transactionRef = doc(db, "charter", uuid);
        const transactionSnap = await getDoc(transactionRef);

        if (transactionSnap.exists()) {
          const data = transactionSnap.data();

          setFormData({
            id: "root",
            name: data.title,
            type: "condition",
            fee: data.fee,
            duration: data.duration,
            service: data.service,
            category: data.category,
            children: data.requirements || [],
          });
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [uuid]);

  React.useEffect(() => {
    if (!selected) {
      setSelected(formData);
    }
  }, [formData, selected]);

  const handleSelectNode = (node: FormNode) => {
    setSelected(node);
    setEditMode(false);

    if (node.name.length === 0) {
      setEditMode(true);
    }
  };

  const createConditionNode = () => {
    if (!selected) return;

    const newNode: FormNode = {
      id: uuidv4(),
      name: "",
      type: "condition",
      children: [],
    };

    setFormData((prev) => createNodeInTree(prev, selected.id, newNode));
    setSelected(newNode);
    setEditMode(true);
  };

  const createRequirementNode = () => {
    if (!selected) return;

    const newNode: FormNode = {
      id: uuidv4(),
      name: "",
      type: "requirement",
    };

    setFormData((prev) => createNodeInTree(prev, selected.id, newNode));
    setSelected(newNode);
    setEditMode(true);
  };

  const handleUpdateNode = (updatedNode: FormNode) => {
    setSelected(updatedNode);

    if (updatedNode.id === "root") {
      setFormData(updatedNode);
    } else {
      setFormData((prev) => updateNodeInTree(prev, updatedNode));
    }

    setEditMode(false);
  };

  const handleDeleteNode = () => {
    if (!selected) return;

    if (selected.id === "root") {
      return;
    }

    const updatedFormData = removeNodeFromTree(formData, selected.id);

    setFormData(updatedFormData);
    setDeleteDialogOpen(false);
    setSelected(undefined);
  };

  const handleOpenDeleteDialog = () => {
    if (selected && selected.id !== "root") {
      setDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleSubmit = async () => {
    // print the entire tree to console
    console.log("Form Data Tree:", JSON.stringify(formData, null, 2));

    const clean: FormNode = JSON.parse(JSON.stringify(formData));
    const reference = uuid || uuidv4();

    try {
      const docRef = doc(db, "charter", reference);
      await setDoc(docRef, {
        title: clean.name,
        fee: clean.fee,
        duration: clean.duration,
        service: clean.service,
        category: clean.category,
        requirements: clean.children || [],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage(
        "Failed to submit form data. Please check the console for more information."
      );
      setOpenErrorSnackbar(true);
    }
  };

  const handleCancelNodeUpdate = () => {
    setEditMode(false);
  };

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  return (
    <Grid container spacing={2} padding={2} justifyContent="stretch">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          padding={2}
        >
          <Tooltip title="Create Condition">
            <IconButton
              disabled={!(selected && selected.type === "condition")}
              onClick={createConditionNode}
            >
              <CreateNewFolderOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Requirement">
            <IconButton
              disabled={!(selected && selected.type === "condition")}
              onClick={createRequirementNode}
            >
              <NoteAddIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Stack>

        <Divider />

        <Scrollbar>
          <List>
            <TreeNode
              key={formData.id}
              data={formData}
              selected={selected?.id || formData.id}
              handleSelect={handleSelectNode}
            />
          </List>
        </Scrollbar>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <Stack direction="row" justifyContent="flex-end">
          {!editMode && (
            <Tooltip title="Edit">
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleOpenDeleteDialog}
              disabled={selected && selected.id === "root"}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider />

        {selected && selected.id === "root" && (
          <TransactionForm
            node={selected}
            editMode={editMode}
            onUpdate={handleUpdateNode}
            onCancel={handleCancelNodeUpdate}
          />
        )}
        {selected &&
          selected.id !== "root" &&
          selected.type === "requirement" && (
            <RequirementForm
              node={selected}
              editMode={editMode}
              onUpdate={handleUpdateNode}
              onCancel={handleCancelNodeUpdate}
            />
          )}
        {selected &&
          selected.id !== "root" &&
          selected.type === "condition" && (
            <ConditionForm
              node={selected}
              editMode={editMode}
              onUpdate={handleUpdateNode}
              onCancel={handleCancelNodeUpdate}
            />
          )}
      </Grid>

      {selected && deleteDialogOpen && (
        <DeleteDialog
          open={deleteDialogOpen}
          selected={selected.name}
          handleDelete={handleDeleteNode}
          handleClose={handleCloseDeleteDialog}
        />
      )}

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
