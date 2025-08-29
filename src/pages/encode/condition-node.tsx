import * as React from "react";
// MUI
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import type { TransactionNode } from "src/pages/requirements/types";
import TreeNode from "./tree-node";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled(
  (props: AccordionSummaryProps & { selected: boolean }) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  )
)(({ theme, selected }) => ({
  backgroundColor: selected
    ? theme.palette.primary.lighter
    : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(2),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function ConditionNode({
  data,
  selected,
  handleSelect,
}: {
  data: TransactionNode;
  selected: string;
  handleSelect: (node: TransactionNode) => void;
}) {
  const [expand, setExpand] = React.useState(data.id === "root" ? true : false);

  const handleToggleExpand = () => {
    if (selected === data.id) {
      setExpand(!expand);
    } else {
      handleSelect(data);
    }
  };

  return (
    <ListItem sx={{ paddingLeft: 2, paddingTop: 2, paddingBottom: 2, paddingRight: 0 }}>
      <Accordion expanded={expand} onChange={handleToggleExpand}>
        <AccordionSummary selected={selected === data.id}>
          <Typography component="span">
            {data.name ||
              (data.id === "root"
                ? "Unnamed Transaction"
                : "Unnamed Condition")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {data.children &&
              data.children
                .filter((child) => child.type === "requirement")
                .map((child) => (
                  <TreeNode
                    key={child.id}
                    data={child}
                    selected={selected}
                    handleSelect={handleSelect}
                  />
                ))}
            {data.children &&
              data.children
                .filter((child) => child.type === "condition")
                .map((child) => (
                  <TreeNode
                    key={child.id}
                    data={child}
                    selected={selected}
                    handleSelect={handleSelect}
                  />
                ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}
