import * as React from "react";

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

type TransactionProps = {
  id: number;
  title: string;
  duration: string;
  fee: string;
  handleClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    transaction: string
  ) => void;
};

export default function TransactionCard({
  id,
  title,
  duration,
  fee,
  handleClick,
}: TransactionProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
      </CardContent>

      <CardContent>
        <List>
          <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <TimerOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {`${duration} Total Processing Time`}
                </Typography>
              }
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PaymentOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {fee}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </CardContent>

      <CardActions
        sx={{ justifyContent: "flex-end", backgroundColor: "#E6F3FF" }}
      >
        <Button
          variant="contained"
          onClick={(event) => handleClick(event, (id + 1).toString())}
          endIcon={<ArrowForwardIosIcon />}
        >
          Start Transaction
        </Button>
      </CardActions>
    </Card>
  );
}
