import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";
import { Logo } from "src/components/logo";

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Logo sx={{ position: "fixed", top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, page not found!
        </Typography>

        <Typography
          sx={{ color: "text.secondary", maxWidth: 480, textAlign: "center", paddingBottom: 3 }}
        >
          Sorry, we couldn't find the page you're looking for. Perhaps an
          Internal Server Error occurred. Please contact the system
          administrator for assistance.
        </Typography>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          color="inherit"
        >
          Go to Services
        </Button>
      </Container>
    </>
  );
}
