import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
// Types
import { TransactionsStatus } from "src/pages/requirements/types";
// Icons
import CloseIcon from "@mui/icons-material/Close";

export type FilterFields = "service" | "status";

export type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filter: Record<FilterFields, string>;
  setFilter: (field: FilterFields, filter: string) => void;
};

export default function FilterDrawer({
  open,
  onClose,
  filter,
  setFilter,
}: FilterDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          p: 1,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ minWidth: 280, padding: 2 }}>
        <FormControl>
          <FormLabel>Service</FormLabel>
          <RadioGroup
            value={filter.service}
            onChange={(e) => setFilter("service", e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel
              value="REGISTRATION"
              control={<Radio />}
              label="Registration"
            />
            <FormControlLabel
              value="FILING & PAYMENT"
              control={<Radio />}
              label="Filing & Payment"
            />
            <FormControlLabel
              value="CERTIFICATE & CLEARANCE"
              control={<Radio />}
              label="Certificate & Clearance"
            />
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: 1 }} />
        <FormControl>
          <FormLabel>Status</FormLabel>
          <RadioGroup
            value={filter.status}
            onChange={(e) => setFilter("status", e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel
              value={TransactionsStatus.COMPLETE_REQUIREMENTS}
              control={<Radio />}
              label="Complete Requirements"
            />
            <FormControlLabel
              value={TransactionsStatus.INCOMPLETE_REQUIREMENTS}
              control={<Radio />}
              label="Incomplete Requirements"
            />
            <FormControlLabel
              value={TransactionsStatus.RECEIVED_REQUIREMENTS}
              control={<Radio />}
              label="Received"
            />
            <FormControlLabel
              value={TransactionsStatus.VERIFIED_REQUIREMENTS}
              control={<Radio />}
              label="Verified"
            />
            <FormControlLabel
              value={TransactionsStatus.INVALID_REQUIREMENTS}
              control={<Radio />}
              label="Invalid Requirements"
            />
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: 1 }} />
      </Box>
    </Drawer>
  );
}
