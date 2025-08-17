import * as React from 'react';
// MUI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';

export type Requirements = {
  name: string;
  note?: string;
  group?: string;
  optional?: boolean;
  conditions: string[];
  source?: {
    label: string;
    link: string;
  };
};

export type Transaction = {
  name: string;
  fee: string;
  duration: string;
  service: string;
  category?: string;
  checklist?: string;
  requirements?: Requirements[];
};

interface SortableConditionItemProps {
  id: string;
  condition: string;
  onEdit: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

function SortableConditionItem({ id, condition, onEdit, onDelete }: SortableConditionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 4 : 1}
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{ mr: 1, cursor: 'grab' }}
      >
        <DragIcon />
      </IconButton>
      
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {condition}
      </Typography>
      
      <IconButton
        size="small"
        onClick={() => onEdit(id, condition)}
        sx={{ ml: 1 }}
      >
        <EditIcon />
      </IconButton>
      
      <IconButton
        size="small"
        onClick={() => onDelete(id)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
}

interface RequirementCardProps {
  requirement: Requirements & { id: string };
  onEdit: (requirement: Requirements & { id: string }) => void;
  onDelete: (id: string) => void;
}

function RequirementCard({ requirement, onEdit, onDelete }: RequirementCardProps) {
  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardHeader
        title={requirement.name}
        subheader={requirement.group}
        action={
          <Stack direction="row">
            <IconButton onClick={() => onEdit(requirement)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(requirement.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {requirement.note && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {requirement.note}
          </Typography>
        )}
        
        <Typography variant="subtitle2" gutterBottom>
          Conditions ({requirement.conditions.length}):
        </Typography>
        
        <Box sx={{ ml: 2 }}>
          {requirement.conditions.map((condition, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {index + 1}. {condition}
            </Typography>
          ))}
        </Box>
        
        {requirement.source && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Source:</Typography>
            <Typography variant="body2" color="primary">
              <a href={requirement.source.link} target="_blank" rel="noopener noreferrer">
                {requirement.source.label}
              </a>
            </Typography>
          </Box>
        )}
        
        {requirement.optional && (
          <Typography variant="caption" color="info.main" sx={{ mt: 1, display: 'block' }}>
            Optional requirement
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

interface RequirementDialogProps {
  open: boolean;
  requirement: Requirements & { id: string };
  onClose: () => void;
  onSave: (requirement: Requirements & { id: string }) => void;
}

function RequirementDialog({ open, requirement, onClose, onSave }: RequirementDialogProps) {
  const [formData, setFormData] = React.useState<Requirements & { id: string }>(requirement);
  const [newCondition, setNewCondition] = React.useState('');
  const [editingCondition, setEditingCondition] = React.useState<{ id: string; value: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.conditions.findIndex((_, index) => `condition-${index}` === active.id);
      const newIndex = formData.conditions.findIndex((_, index) => `condition-${index}` === over.id);

      setFormData(prev => ({
        ...prev,
        conditions: arrayMove(prev.conditions, oldIndex, newIndex)
      }));
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const editCondition = (id: string, value: string) => {
    setEditingCondition({ id, value });
  };

  const saveEditCondition = () => {
    if (editingCondition) {
      const index = parseInt(editingCondition.id.replace('condition-', ''));
      const newConditions = [...formData.conditions];
      newConditions[index] = editingCondition.value;
      setFormData(prev => ({
        ...prev,
        conditions: newConditions
      }));
      setEditingCondition(null);
    }
  };

  const deleteCondition = (id: string) => {
    const index = parseInt(id.replace('condition-', ''));
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {requirement.id ? 'Edit Requirement' : 'Add Requirement'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Group"
                fullWidth
                value={formData.group || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
              />
            </Grid>
            
            <Grid size={12}>
              <TextField
                label="Note"
                fullWidth
                multiline
                rows={2}
                value={formData.note || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Source Label"
                fullWidth
                value={formData.source?.label || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  source: { ...prev.source, label: e.target.value, link: prev.source?.link || '' }
                }))}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Source Link"
                fullWidth
                value={formData.source?.link || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  source: { ...prev.source, link: e.target.value, label: prev.source?.label || '' }
                }))}
              />
            </Grid>
            
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.optional || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, optional: e.target.checked }))}
                  />
                }
                label="Optional requirement"
              />
            </Grid>
            
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Conditions (Drag to reorder by hierarchy)
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  label="Add new condition"
                  size="small"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={addCondition}
                  disabled={!newCondition.trim()}
                >
                  Add
                </Button>
              </Stack>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.conditions.map((_, index) => `condition-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {formData.conditions.map((condition, index) => (
                    <SortableConditionItem
                      key={`condition-${index}`}
                      id={`condition-${index}`}
                      condition={condition}
                      onEdit={editCondition}
                      onDelete={deleteCondition}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Condition Dialog */}
      <Dialog 
        open={!!editingCondition} 
        onClose={() => setEditingCondition(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Condition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Condition"
            fullWidth
            value={editingCondition?.value || ''}
            onChange={(e) => setEditingCondition(prev => prev ? { ...prev, value: e.target.value } : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCondition(null)}>Cancel</Button>
          <Button onClick={saveEditCondition} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function TransactionForm() {
  const [transaction, setTransaction] = React.useState<Transaction>({
    name: '',
    fee: '',
    duration: '',
    service: '',
    category: '',
    checklist: '',
    requirements: []
  });
  
  const [requirements, setRequirements] = React.useState<(Requirements & { id: string })[]>([]);
  const [requirementDialog, setRequirementDialog] = React.useState<{
    open: boolean;
    requirement: Requirements & { id: string };
  }>({
    open: false,
    requirement: {
      id: '',
      name: '',
      note: '',
      group: '',
      optional: false,
      conditions: [],
      source: { label: '', link: '' }
    }
  });
  
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const openRequirementDialog = (requirement?: Requirements & { id: string }) => {
    setRequirementDialog({
      open: true,
      requirement: requirement || {
        id: Date.now().toString(),
        name: '',
        note: '',
        group: '',
        optional: false,
        conditions: [],
        source: { label: '', link: '' }
      }
    });
  };

  const closeRequirementDialog = () => {
    setRequirementDialog(prev => ({ ...prev, open: false }));
  };

  const saveRequirement = (requirement: Requirements & { id: string }) => {
    setRequirements(prev => {
      const existingIndex = prev.findIndex(r => r.name === requirement.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = requirement;
        return updated;
      } else {
        return [...prev, requirement];
      }
    });
  };

  const deleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async () => {
    if (!transaction.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Transaction name is required',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      // Create the main transaction document
      const transactionRef = doc(collection(db, 'transactions'));
      const transactionData = {
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      batch.set(transactionRef, transactionData);
      
      // Create requirements subcollection documents
      requirements.forEach(requirement => {
        const requirementRef = doc(collection(transactionRef, 'requirements'));
        batch.set(requirementRef, {
          ...requirement,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      
      setSnackbar({
        open: true,
        message: 'Transaction created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setTransaction({
        name: '',
        fee: '',
        duration: '',
        service: '',
        category: '',
        checklist: '',
        requirements: []
      });
      setRequirements([]);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      setSnackbar({
        open: true,
        message: 'Error creating transaction. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, zIndex: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create Transaction
      </Typography>
      
      <Grid container spacing={3}>
        {/* Transaction Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Details
            </Typography>
            
            <Stack spacing={2}>
              <TextField
                label="Transaction Name"
                fullWidth
                value={transaction.name}
                onChange={(e) => setTransaction(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <TextField
                label="Fee"
                fullWidth
                value={transaction.fee}
                onChange={(e) => setTransaction(prev => ({ ...prev, fee: e.target.value }))}
              />
              
              <TextField
                label="Duration"
                fullWidth
                value={transaction.duration}
                onChange={(e) => setTransaction(prev => ({ ...prev, duration: e.target.value }))}
              />
              
              <TextField
                label="Service"
                fullWidth
                value={transaction.service}
                onChange={(e) => setTransaction(prev => ({ ...prev, service: e.target.value }))}
              />
              
              <TextField
                label="Category"
                fullWidth
                value={transaction.category}
                onChange={(e) => setTransaction(prev => ({ ...prev, category: e.target.value }))}
              />
              
              <TextField
                label="Checklist URL"
                fullWidth
                value={transaction.checklist}
                onChange={(e) => setTransaction(prev => ({ ...prev, checklist: e.target.value }))}
                placeholder="https://..."
              />
            </Stack>
          </Paper>
        </Grid>
        
        {/* Requirements List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
              Requirements ({requirements.length})
            </Typography>
            
            <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
              {requirements.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No requirements added yet. Click the + button to add requirements.
                </Typography>
              ) : (
                requirements.map(requirement => (
                  <RequirementCard
                    key={requirement.name}
                    requirement={requirement}
                    onEdit={openRequirementDialog}
                    onDelete={deleteRequirement}
                  />
                ))
              )}
            </Box>
            
            <Fab
              color="primary"
              size="small"
              onClick={() => openRequirementDialog()}
              sx={{ position: 'absolute', bottom: 16, right: 16 }}
            >
              <AddIcon />
            </Fab>
          </Paper>
        </Grid>
        
        {/* Submit Button */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !transaction.name.trim()}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Requirement Dialog */}
      <RequirementDialog
        open={requirementDialog.open}
        requirement={requirementDialog.requirement}
        onClose={closeRequirementDialog}
        onSave={saveRequirement}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
