import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import type { Requirements } from ".";

type ChecklistProps = {
  checked: string[];
  requirements: Requirements[];
  handleToggle: (name: string) => () => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  showQRCode: (label: string, link: string) => void;
};

export default function RequirementsChecklist({
  checked,
  requirements,
  handleToggle,
  handleNextStep,
  handlePreviousStep,
  showQRCode,
}: ChecklistProps) {
  return (
    <Card>
      <CardContent>
        <List
          subheader={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyConten: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" align="center">
                Checklist of Requirements
              </Typography>
              <Typography variant="body2" align="center">
                Kindly tick the box if you have the following.
              </Typography>
            </Box>
          }
        >
          {requirements.map((req) => {
            const { name, note, source } = req;

            const label = source ? source.split(">>")[0].trim() : "";
            const link = source ? source.split(">>")[1].trim() : "";

            return (
              <div key={name}>
                <ListItem
                  key={name}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(name)}
                      checked={checked.includes(name)}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" gutterBottom>
                        {name}
                      </Typography>
                    }
                    secondary={
                      <>
                        {note && (
                          <Typography
                            variant="body2"
                            component="span"
                            fontStyle="italic"
                          >
                            {req.note}
                          </Typography>
                        )}
                        {source && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => showQRCode(label, link)}
                          >
                            {label}
                          </Button>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            );
          })}
        </List>
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
          endIcon={<ArrowForwardIosOutlinedIcon />}
        >
          Proceed
        </Button>
      </CardActions>
    </Card>
  );
}
