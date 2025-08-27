import * as React from "react";
import { useParams } from "react-router-dom";
import { useRouter } from "src/routes/hooks";
// MUI
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// Firebase
import { db } from "src/firebase";
import { doc, setDoc, getDoc, Timestamp, deleteDoc } from "firebase/firestore";

import { uuidv4 } from "minimal-shared/utils";

import TreeNode from "./tree-node";
import Fallback from "src/components/fallback";
import { Scrollbar } from "src/components/scrollbar";

const ConditionForm = React.lazy(() => import("./condition-form"));
const TransactionForm = React.lazy(() => import("./transaction-form"));
const RequirementForm = React.lazy(() => import("./requirement-form"));
const DeleteDialog = React.lazy(() => import("./delete-dialog"));

export type FormNode = {
  id: string;
  name: string;
  type: "condition" | "requirement";
  format?: "single-select" | "multi-select";
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
  format: "single-select",
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
  const router = useRouter();

  const [selected, setSelected] = React.useState<FormNode>();
  const [formData, setFormData] = React.useState<FormNode>(root);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState(uuid ? false : true);
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const [deletePageDialogOpen, setDeletePageDialogOpen] = React.useState(false);
  const [deleteNodeDialogOpen, setDeleteNodeDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchTransaction = async () => {
      if (!uuid) {
        return;
      }

      try {
        setLoading(true);

        const transactionRef = doc(db, "charter", uuid);
        const transactionSnap = await getDoc(transactionRef);

        if (transactionSnap.exists()) {
          const results = transactionSnap.data();
          const data: FormNode = {
            id: "root",
            name: results.title,
            type: "condition",
            format: results.format,
            fee: results.fee,
            duration: results.duration,
            service: results.service,
            category: results.category,
            children: results.requirements || [],
          };

          setFormData(data);
          setSelected(data);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setErrorMessage(
          "Failed to fetch transaction data. Please check the console for more information."
        );
        setOpenErrorSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [uuid]);

  React.useEffect(() => {
    if (!selected) {
      setSelected(formData);
    }
  }, [formData, selected]);

  // Node Methods

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
      format: "single-select",
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
    setDeleteNodeDialogOpen(false);
    setSelected(undefined);
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

  const handleNavigateBack = () => {
    router.push("/charter");
  };

  // Dialogs

  const handleOpenDeleteNodeDialog = () => {
    if (selected && selected.id !== "root") {
      setDeleteNodeDialogOpen(true);
    }
  };

  const handleCloseDeleteNodeDialog = () => {
    setDeleteNodeDialogOpen(false);
  };

  const handleOpenDeletePageDialog = () => {
    setDeletePageDialogOpen(true);
  };

  const handleCloseDeletePageDialog = () => {
    setDeletePageDialogOpen(false);
  };

  // Backend

  const handleSubmit = async () => {
    setLoading(true);

    const clean: FormNode = JSON.parse(JSON.stringify(formData));
    const reference = uuid || uuidv4();

    try {
      const docRef = doc(db, "charter", reference);
      await setDoc(docRef, {
        title: clean.name,
        fee: clean.fee,
        duration: clean.duration,
        service: clean.service,
        category: clean.service === "REGISTRATION" ? clean.category : "",
        requirements: clean.children || [],
        updatedAt: Timestamp.now(),
      });

      if (!uuid) {
        router.push(`/encode/${reference}`);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage(
        "Failed to submit form data. Please check the console for more information."
      );
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async () => {
    if (!uuid) {
      router.push("/charter");
      return;
    }

    try {
      setLoading(true);

      const docRef = doc(db, "charter", uuid);
      await deleteDoc(docRef);

      router.push("/charter");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setErrorMessage(
        "Failed to delete transaction. Please check the console for more information."
      );
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Fallback />
      ) : (
        <Grid container spacing={2} padding={2}>
          <Grid size={12}>
            {formData.name && (
              <Typography variant="subtitle1">Transaction Title</Typography>
            )}
            <Typography variant="h3">
              {formData.name ? formData.name : "New Transaction"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              padding={2}
              height={72}
            >
              {uuid && (
                <Tooltip title="Go Back">
                  <IconButton onClick={handleNavigateBack}>
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={uuid ? "Delete Page" : "Discard Changes"}>
                <IconButton onClick={handleOpenDeletePageDialog}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
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
                  <NoteAddOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Preview">
                <IconButton>
                  <OpenInNewIcon />
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
            <Stack direction="row" justifyContent="flex-end" height={72}>
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
                  onClick={handleOpenDeleteNodeDialog}
                  disabled={selected && selected.id === "root"}
                >
                  <DeleteOutlineOutlinedIcon />
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

          {selected && deleteNodeDialogOpen && (
            <DeleteDialog
              open={deleteNodeDialogOpen}
              message={`Are you sure you want to ${
                selected ? `delete "${selected.name}"?` : "delete?"
              } This action cannot be undone.`}
              handleDelete={handleDeleteNode}
              handleClose={handleCloseDeleteNodeDialog}
            />
          )}

          {deletePageDialogOpen && (
            <DeleteDialog
              open={deletePageDialogOpen}
              message={
                uuid
                  ? `Are you sure you want to delete "${formData.name}"?`
                  : `Are you sure you want to discard changes?`
              }
              handleDelete={handleDeletePage}
              handleClose={handleCloseDeletePageDialog}
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
      )}
    </>
  );
}
