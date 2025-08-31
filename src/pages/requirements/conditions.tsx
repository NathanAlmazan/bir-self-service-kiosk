import * as React from "react";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
// Icons
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import { TransactionNode } from "./types";

type CategoriesProps = {
  node: TransactionNode;
  selected: string[];
  disabled: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  toggleNodes: (id: string, queue: boolean, forward: boolean) => void;
};

export default function RequirementsCategories({
  node,
  selected,
  disabled,
  toggleNodes,
  handleNextStep,
  handlePreviousStep,
}: CategoriesProps) {
  const [conditions, setConditions] = React.useState<
    { id: string; label: string }[]
  >([]);

  React.useEffect(() => {
    setConditions(
      node.children
        ?.filter((child) => child.type === "condition")
        .map((child) => ({ id: child.id, label: child.name })) || []
    );
  }, [node]);

  const handleToggle = (id: string) => {
    const target: TransactionNode | undefined = node.children?.find(
      (child) => child.id === id
    );

    if (target) {
      const children: TransactionNode[] =
        target.children?.filter((child) => child.type === "condition") || [];

      const queue = Boolean(children.length > 0);

      toggleNodes(
        id,
        queue,
        target.format === "single-select" || conditions.length === 1
      );
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6" align="center">
          {`Please select what best describes your transaction. ${
            conditions.length > 1
              ? "You may select more than one, if applicable."
              : ""
          }`}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            mt: 3,
          }}
        >
          {conditions.map((cond) => (
            <Chip
              key={cond.id}
              label={cond.label}
              clickable
              color={selected.includes(cond.id) ? "primary" : "default"}
              onClick={() => handleToggle(cond.id)}
            />
          ))}
        </Box>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "#E6F3FF",
        }}
      >
        <Button
          size="large"
          variant="outlined"
          onClick={handlePreviousStep}
          startIcon={<ArrowBackIosNewOutlinedIcon />}
        >
          Go Back
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={handleNextStep}
          disabled={disabled}
          endIcon={<ArrowForwardIosOutlinedIcon />}
        >
          Continue
        </Button>
      </CardActions>
    </Card>
  );
}
