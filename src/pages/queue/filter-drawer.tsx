import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export type FilterFields = "rdo" | "service" | "status";

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
          p: 1
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
              value="Started Transaction"
              control={<Radio />}
              label="Started Transaction"
            />
            <FormControlLabel
              value="Complete Requirements"
              control={<Radio />}
              label="Complete Requirements"
            />
            <FormControlLabel
              value="Incomplete Requirements"
              control={<Radio />}
              label="Incomplete Requirements"
            />
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: 1 }} />
        <FormControl>
          <FormLabel>Revenue District</FormLabel>
          <RadioGroup
            value={filter.rdo}
            onChange={(e) => setFilter("rdo", e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            {offices.map((office) => (
              <FormControlLabel
                key={office.name}
                value={office.name}
                control={<Radio />}
                label={office.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </Drawer>
  );
}

const offices = [
  {
    name: "RDO No. 29",
    area: "Tondo - San Nicolas",
  },
  {
    name: "RDO No. 30",
    area: "Binondo",
  },
  {
    name: "RDO No. 31",
    area: "Sta. Cruz",
  },
  {
    name: "RDO No. 32",
    area: "Quiapo-Sampaloc-San Miguel-Sta. Mesa",
  },
  {
    name: "RDO No. 33",
    area: "Ermita-Intramuros-Malate",
  },
  {
    name: "RDO No. 34",
    area: "Paco-Pandacan-Sta. Ana-San Andres",
  },
  {
    name: "RDO No. 36",
    area: "Puerto Princesa City, Palawan",
  },
];
