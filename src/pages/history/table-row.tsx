import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";

import { TransactionsStatus } from "../requirements/types";
import { Label, LabelColor } from "src/components/label";

import type { Queue } from ".";

type QueueTableRowProps = {
  row: Queue;
  selected: string | null;
  onSelect: (id: string) => void;
};

export default function QueueTableRow({
  row,
  selected,
  onSelect,
}: QueueTableRowProps) {
  return (
    <TableRow
      selected={selected === row.id}
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onSelect(row.id)}
    >
      <TableCell component="th" scope="row">
        <Typography variant="body2" fontWeight="bold">
          {row.id.split("-").slice(1).join("-")}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{row.name}</Typography>
      </TableCell>

      <TableCell>
        <Stack direction="column">
          <Typography variant="body2">
            {getDistrictLocation(row.rdo)}
          </Typography>
          <Typography variant="subtitle2">{row.rdo}</Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="column">
          <Typography variant="body2">
            {row.transaction.split(" — ")[1]}
          </Typography>
          <Typography variant="subtitle2">
            {row.transaction.split(" — ")[0]}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="column">
          <Typography variant="body2">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(row.submittedAt)}
          </Typography>
          <Typography variant="body2">
            {new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).format(row.submittedAt)}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Label color={getStatusColor(row.status)}>{row.status}</Label>
      </TableCell>
    </TableRow>
  );
}

function getStatusColor(status: TransactionsStatus): LabelColor {
  switch (status) {
    case TransactionsStatus.COMPLETE_REQUIREMENTS:
      return "primary";
    case TransactionsStatus.INCOMPLETE_REQUIREMENTS:
      return "secondary";
    case TransactionsStatus.RECEIVED_REQUIREMENTS:
      return "warning";
    case TransactionsStatus.VERIFIED_REQUIREMENTS:
      return "success";
    case TransactionsStatus.INVALID_REQUIREMENTS:
      return "error";
    default:
      return "default";
  }
}

function getDistrictLocation(rdo: string): string {
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

  return offices.find((office) => office.name === rdo)?.area || rdo;
}
