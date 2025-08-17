import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

// ----------------------------------------------------------------------

type QueueTableToolbarProps = {
  filterQuery: string;
  handleToggleFilter: () => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function QueueTableToolbar({
  filterQuery,
  handleToggleFilter,
  handleFilterChange,
}: QueueTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        fullWidth
        value={filterQuery}
        onChange={handleFilterChange}
        placeholder="Search Transaction..."
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "text.disabled" }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 320 }}
      />
      <Tooltip title="Filter list">
        <IconButton onClick={handleToggleFilter}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
