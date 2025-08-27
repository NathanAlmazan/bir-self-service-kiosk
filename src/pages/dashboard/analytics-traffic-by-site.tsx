import type { CardProps } from "@mui/material/Card";

import { varAlpha } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fShortenNumber } from "./utils/format-number";

import GoogleIcon from "@mui/icons-material/Google";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: { value: string; label: string; total: number }[];
};

export function AnalyticsTrafficBySite({
  title,
  subheader,
  list,
  sx,
  ...other
}: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box
        sx={{
          p: 3,
          gap: 2,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {list.map((site) => (
          <Box
            key={site.label}
            sx={(theme) => ({
              py: 2.5,
              display: "flex",
              borderRadius: 1.5,
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
              border: `solid 1px ${varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.12
              )}`,
            })}
          >
            {site.value === "twitter" && (
              <TwitterIcon sx={{ width: 32, height: 32 }} />
            )}
            {site.value === "facebook" && (
              <FacebookOutlinedIcon sx={{ width: 32, height: 32 }} />
            )}
            {site.value === "google" && (
              <GoogleIcon sx={{ width: 32, height: 32 }} />
            )}
            {site.value === "linkedin" && (
              <LinkedInIcon sx={{ width: 32, height: 32 }} />
            )}

            <Typography variant="h6" sx={{ mt: 1 }}>
              {fShortenNumber(site.total)}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {site.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
