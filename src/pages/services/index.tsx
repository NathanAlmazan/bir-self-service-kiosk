import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import ServiceGrid from "./grid";
import WelcomeCard from "./welcome";

export default function ServicesPage() {
  return (
    <Container maxWidth="lg" sx={{ zIndex: 2 }}>
      <Grid container spacing={5} alignItems="stretch">
        <Grid size={{ sm: 12, md: 6, lg: 5 }}>
          <WelcomeCard />
        </Grid>
        <Grid size={{ sm: 12, md: 6, lg: 7 }}>
          <ServiceGrid />
        </Grid>
      </Grid>
    </Container>
  );
}
