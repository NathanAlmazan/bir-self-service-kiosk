import * as React from "react";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
// Animation
import { AnimatePresence, motion } from "framer-motion";
import * as party from "party-js";
// Icons
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import type { Requirements } from "./types";

type ChecklistProps = {
  checked: string[];
  requirements: Requirements[];
  missingRequirements: Requirements[];
  handleToggle: (name: string) => () => void;
  handleNextStep: () => void;
  showQRCode: (label: string, link: string) => void;
  handlePreviousStep: () => void;
};

export default function RequirementsChecklist({
  checked,
  requirements,
  missingRequirements,
  handleToggle,
  handleNextStep,
  showQRCode,
  handlePreviousStep,
}: ChecklistProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [groupedRequirements, setGroupedRequirements] = React.useState<
    Record<string, Requirements[]>
  >({});
  const [independentRequirements, setIndependentRequirements] = React.useState<
    Requirements[]
  >([]);
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const grouped: Record<string, Requirements[]> = {};
    const independent: Requirements[] = [];

    requirements.forEach((req) => {
      if (req.group) {
        if (!grouped[req.group]) {
          grouped[req.group] = [];
        }
        grouped[req.group].push(req);
      } else {
        independent.push(req);
      }
    });

    setGroupedRequirements(grouped);
    setIndependentRequirements(independent);
  }, [requirements]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  React.useEffect(() => {
    if (submitted && missingRequirements.length === 0) {
      const timeout = setTimeout(() => {
        if (successHeadingRef.current) {
          party.confetti(successHeadingRef.current, {
            count: party.variation.range(60, 100),
            spread: party.variation.range(80, 100),
            size: party.variation.range(1.5, 2.0),
          });
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [submitted, missingRequirements]);

  return (
    <Card>
      <CardContent>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {missingRequirements.length > 0 ? (
                <List
                  subheader={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyConten: "center",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <Typography variant="h6" align="center">
                        {`Almost done! ${
                          missingRequirements.length > 1
                            ? "Just a few more requirements to complete."
                            : "Just one more requirement to complete."
                        }`}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        fontStyle="italic"
                      >
                        {`We'll prepare a summary of your remaining ${
                          missingRequirements.length > 1
                            ? "requirements"
                            : "requirement"
                        } shortly.`}
                      </Typography>
                    </Box>
                  }
                >
                  {missingRequirements.map((req, index) => (
                    <ListItem key={req.id}>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={req.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyConten: "center",
                    alignItems: "center",
                    marginBottom: 3,
                    py: 5,
                  }}
                >
                  {" "}
                  <Typography
                    ref={successHeadingRef}
                    variant="h4"
                    component="h1"
                    align="center"
                  >
                    All requirements are complete — you're good to go! 🎉
                  </Typography>
                  <Typography variant="body1" align="center" fontStyle="italic">
                    Your queue number will be generated shortly.
                  </Typography>
                </Box>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="unsubmitted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                {Object.entries(groupedRequirements).map(([group, reqs]) => (
                  <div key={group}>
                    {reqs.map((req, index) => (
                      <ListItem
                        key={req.id}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(req.id)}
                            checked={checked.includes(req.id)}
                            size="large"
                          />
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" gutterBottom>
                              {req.name +
                                (index === reqs.length - 1 ? "" : "; OR")}
                            </Typography>
                          }
                          secondary={
                            <>
                              {req.note && (
                                <Typography
                                  variant="body2"
                                  component="span"
                                  fontStyle="italic"
                                >
                                  {req.note}
                                </Typography>
                              )}
                              {req.source && (
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() =>
                                    showQRCode(
                                      req.source!.label,
                                      req.source!.link
                                    )
                                  }
                                >
                                  {req.source!.label}
                                </Button>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                    <Divider variant="inset" component="li" />
                  </div>
                ))}
                {independentRequirements.map((req) => (
                  <div key={req.id}>
                    <ListItem
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(req.id)}
                          checked={checked.includes(req.id)}
                          size="large"
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" gutterBottom>
                            {req.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            {req.note && (
                              <Typography
                                variant="body2"
                                component="span"
                                fontStyle="italic"
                              >
                                {req.note}
                              </Typography>
                            )}
                            {req.source && (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() =>
                                  showQRCode(
                                    req.source!.label,
                                    req.source!.link
                                  )
                                }
                              >
                                {req.source!.label}
                              </Button>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                ))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>
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
        {submitted ? (
          <Button
            size="large"
            variant="contained"
            onClick={handleNextStep}
            endIcon={<ArrowForwardIosOutlinedIcon />}
          >
            Continue
          </Button>
        ) : (
          <>
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
              onClick={handleSubmit}
              disabled={checked.length === 0}
              endIcon={<ArrowForwardIosOutlinedIcon />}
            >
              Verify
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
