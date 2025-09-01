import * as React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { useRouter } from "src/routes/hooks";

import { motion, AnimatePresence } from "motion/react";

import ServiceCard from "./card";
import type { PaletteColorKey } from "../../theme/core";

export type Services = {
  title: string;
  image: string;
  color: PaletteColorKey;
};

const services: Services[] = [
  {
    title: "Registration",
    image: "/icons/registration.png",
    color: "primary",
  },
  {
    title: "Filing & Payment",
    image: "/icons/payment.png",
    color: "success",
  },
  {
    title: "Certificate & Clearance",
    image: "/icons/clearance.png",
    color: "warning",
  },
  {
    title: "Inquiry",
    image: "/icons/inquiry.png",
    color: "secondary",
  },
];

export default function ServiceGrid() {
  const router = useRouter();

  const handleSelectService = (
    _: React.MouseEvent<HTMLDivElement>,
    service: string
  ) => {
    if (service.toLowerCase() !== "inquiry") {
      router.push(
        `/kiosk/transactions/${service.toLowerCase().replace(/ & /g, "-")}`
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <AnimatePresence>
        <Grid size={12}>
          <Typography component="h1" variant="h3">
            How can I help you today?
          </Typography>
        </Grid>
        {services.map((service, index) => (
          <Grid key={service.title} size={12}>
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: index + 0.3 }}
            >
              <ServiceCard
                title={service.title}
                image={service.image}
                color={service.color}
                handleClick={handleSelectService}
              />
            </motion.div>
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );
}
