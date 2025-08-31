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
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// Firebase
import { db } from "src/firebase";
import { doc, setDoc, getDoc, Timestamp, deleteDoc } from "firebase/firestore";
// Types
import type { TransactionNode } from "src/pages/requirements/types";

import { uuidv4 } from "minimal-shared/utils";

import TreeNode from "./tree-node";
import Fallback from "src/components/fallback";
import { Scrollbar } from "src/components/scrollbar";
import ConditionForm from "./condition-form";
import TransactionForm from "./transaction-form";
import RequirementForm from "./requirement-form";
import DeleteDialog from "./delete-dialog";

const root: TransactionNode = {
  id: "root",
  name: "",
  type: "condition",
  format: "single-select",
  children: [],
};

const createNodeInTree = (
  tree: TransactionNode,
  parentNodeId: string,
  newNode: TransactionNode
): TransactionNode => {
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

const updateNodeInTree = (
  tree: TransactionNode,
  nodeToUpdate: TransactionNode
): TransactionNode => {
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
  tree: TransactionNode,
  nodeIdToRemove: string
): TransactionNode => {
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

  const [isEdited, setIsEdited] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<TransactionNode>();
  const [formData, setFormData] = React.useState<TransactionNode>(root);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState(uuid ? false : true);
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const [deletePageDialogOpen, setDeletePageDialogOpen] = React.useState(false);
  const [deleteNodeDialogOpen, setDeleteNodeDialogOpen] = React.useState(false);
  const [leavePageDialogOpen, setLeavePageDialogOpen] = React.useState(false);

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
          const data: TransactionNode = {
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
        setIsEdited(false);
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

  const handleSelectNode = (node: TransactionNode) => {
    setSelected(node);
    setEditMode(false);

    if (node.name.length === 0) {
      setEditMode(true);
    }
  };

  const createConditionNode = () => {
    if (!selected) return;

    const newNode: TransactionNode = {
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

    const newNode: TransactionNode = {
      id: uuidv4(),
      name: "",
      type: "requirement",
    };

    setFormData((prev) => createNodeInTree(prev, selected.id, newNode));
    setSelected(newNode);
    setIsEdited(true);
    setEditMode(true);
  };

  const handleUpdateNode = (updatedNode: TransactionNode) => {
    setSelected(updatedNode);

    if (updatedNode.id === "root") {
      setFormData(updatedNode);
    } else {
      setFormData((prev) => updateNodeInTree(prev, updatedNode));
    }

    setIsEdited(true);
    setEditMode(false);
  };

  const handleDeleteNode = () => {
    if (!selected) return;

    if (selected.id === "root") {
      return;
    }

    const updatedFormData = removeNodeFromTree(formData, selected.id);

    setFormData(updatedFormData);
    setIsEdited(true);
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

  const handleCloseLeavePageDialog = () => {
    setLeavePageDialogOpen(false);
  };

  // Backend

  const handleSubmit = async () => {
    setLoading(true);

    const clean: TransactionNode = JSON.parse(JSON.stringify(formData));
    const reference = uuid || uuidv4();

    try {
      const docRef = doc(db, "charter", reference);
      await setDoc(docRef, {
        title: clean.name,
        fee: clean.fee,
        duration: clean.duration,
        format: clean.format || "single-select",
        service: clean.service,
        category: clean.service === "REGISTRATION" ? clean.category : "",
        requirements: clean.children || [],
        updatedAt: Timestamp.now(),
        publish: clean.publish || false,
      });

      if (!uuid) {
        router.push(`/dashboard/encode/${reference}`);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage(
        "Failed to submit form data. Please check the console for more information."
      );
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
      setIsEdited(false);
    }
  };

  const handleDeletePage = async () => {
    if (!uuid) {
      router.push("/dashboard/charter");
      return;
    }

    try {
      setLoading(true);

      const docRef = doc(db, "charter", uuid);
      await deleteDoc(docRef);

      router.push("/dashboard/charter");
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

  // Navigations

  const handleNavigateBack = () => {
    router.push("/dashboard/charter");
  };

  const handleLeavePage = () => {
    if (isEdited) {
      setLeavePageDialogOpen(true);
    } else {
      router.push("/dashboard/charter");
    }
  };

  const handlePreviewCharter = () => {
    router.push("/dashboard/charter/" + uuid);
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
                  <IconButton onClick={handleLeavePage}>
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
                <IconButton onClick={handlePreviewCharter}>
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
              <Button
                disabled={!isEdited}
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

          <DeleteDialog
            open={deleteNodeDialogOpen}
            message={`Are you sure you want to ${
              selected ? `delete "${selected.name}"?` : "delete?"
            } This action cannot be undone.`}
            handleDelete={handleDeleteNode}
            handleClose={handleCloseDeleteNodeDialog}
          />

          <DeleteDialog
            open={deletePageDialogOpen}
            message={
              uuid
                ? `Are you sure you want to delete "${formData.name}"?`
                : `Are you sure you want to discard changes?`
            }
            handleDelete={handleDeletePage}
            handleClose={handleCloseDeletePageDialog}
            buttonLabel={uuid ? "Delete Page" : "Discard Changes"}
          />

          <DeleteDialog
            open={leavePageDialogOpen}
            message={
              "You have unsaved changes. Are you sure you want to leave?"
            }
            handleDelete={handleNavigateBack}
            handleClose={handleCloseLeavePageDialog}
            buttonLabel="Leave Page"
          />

          <Snackbar
            open={openErrorSnackbar}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              variant="outlined"
              onClose={handleClose}
              severity="error"
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
