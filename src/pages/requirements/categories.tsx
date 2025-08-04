import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

type CategoriesProps = {
  selected: string[];
  categories: string[];
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  toggleCategory: (category: string) => void;
};

export default function RequirementsCategories({
  selected,
  categories,
  toggleCategory,
  handleNextStep,
  handlePreviousStep,
}: CategoriesProps) {
  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6" align="center">
          {`Please select what best describes your transaction. ${
            categories.length > 1 && "You can select more than one."
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
          {categories
            .filter((category) => category !== "All")
            .map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={selected.includes(category) ? "primary" : "default"}
                onClick={() => toggleCategory(category)}
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
          variant="outlined"
          onClick={handlePreviousStep}
          startIcon={<ArrowBackIosNewOutlinedIcon />}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNextStep}
          disabled={selected.length === 0}
          endIcon={<ArrowForwardIosOutlinedIcon />}
        >
          Proceed
        </Button>
      </CardActions>
    </Card>
  );
}
