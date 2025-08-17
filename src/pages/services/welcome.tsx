import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export default function WelcomeCard() {
  return (
    <Card
      sx={{
        height: "100%",
        color: "white",
        backgroundImage: `url("${import.meta.env.BASE_URL}/bg/kiosk.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 360
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.50)",
        }}
      >
        <Box sx={{ mx: 2, my: 5 }}>
          <Typography variant="h5" align="left" color="warning.light">
            Welcome to RR6-Manila
          </Typography>
          <Typography variant="h3" align="left">
            One-Stop Taxpayer Lounge
          </Typography>
          <Box
            sx={{
              width: "25%",
              borderBottom: "3px solid white",
              mt: 1,
              mb: 2,
            }}
          />
          <Typography component="div" variant="body1" align="left">
            <i>{'"Streamlining Tax Services with Comfort and Care"'}</i>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
