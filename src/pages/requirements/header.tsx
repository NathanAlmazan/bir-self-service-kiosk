import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

type HeaderProps = {
  title: string;
  duration: string;
  fee: string;
};

export default function RequirementsHeader(props: HeaderProps) {
  return (
    <Stack spacing={2} direction="column">
      <Typography component="div" variant="h3">
        {props.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack spacing={1} direction="row">
          <TimerOutlinedIcon />
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {props.duration}
          </Typography>
        </Stack>
        <Stack spacing={1} direction="row">
          <PaymentOutlinedIcon />
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {props.fee}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
