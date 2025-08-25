import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
// Icons
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import type { FormNode } from ".";

export default function RequirementNode({
  data,
  selected,
  handleSelect,
}: {
  data: FormNode;
  selected: string;
  handleSelect: (node: FormNode) => void;
}) {
  return (
    <ListItemButton
      selected={selected === data.id}
      onClick={() => handleSelect(data)}
    >
      <ListItemIcon sx={{ minWidth: 48 }}>
        <InsertDriveFileOutlinedIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          data.name
            ? `${data.name.slice(0, 90)}${data.name.length > 90 ? "..." : ""}`
            : "Unnamed Requirement"
        }
      />
    </ListItemButton>
  );
}
