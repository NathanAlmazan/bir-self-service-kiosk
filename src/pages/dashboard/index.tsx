import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DashboardContent } from "src/layout/dashboard/content";

import { AnalyticsCurrentVisits } from "./analytics-current-visits";
import { AnalyticsWebsiteVisits } from "./analytics-website-visits";
import { AnalyticsWidgetSummary } from "./analytics-widget-summary";
import { AnalyticsConversionRates } from "./analytics-conversion-rates";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded";

import { UserRole } from "src/store/types";
import { useAppSelector } from "src/store/hooks";

export default function OverviewAnalyticsView() {
  const { office, role } = useAppSelector((state) => state.user);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {office === "Administrator"
          ? "Revenue Region Dashboard"
          : `${office?.replace("No.", "")} Dashboard`}
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Served"
            total={234}
            color="primary"
            icon={<PeopleRoundedIcon fontSize="large" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Queued"
            color="secondary"
            total={714}
            icon={<HorizontalSplitRoundedIcon fontSize="large" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Servicing"
            total={135}
            color="warning"
            icon={<MiscellaneousServicesRoundedIcon fontSize="large" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Verified"
            total={172}
            color="success"
            icon={<DoneAllRoundedIcon fontSize="large" />}
          />
        </Grid>

        {role === UserRole.ADMIN && (
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits
              title="Taxpayer Traffic"
              chart={{
                series: [
                  { label: "RDO 29", value: 3500 },
                  { label: "RDO 30", value: 2500 },
                  { label: "RDO 31", value: 1500 },
                  { label: "RDO 32", value: 500 },
                  { label: "RDO 33", value: 1500 },
                  { label: "RDO 34", value: 2500 },
                  { label: "RDO 36", value: 1500 },
                ],
              }}
              sx={{ height: "100%" }}
            />
          </Grid>
        )}

        {role === UserRole.ADMIN && (
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <AnalyticsWebsiteVisits
              title="Performance Analytics"
              subheader="During Month of September 2025"
              chart={{
                categories: [
                  "RDO 29",
                  "RDO 30",
                  "RDO 31",
                  "RDO 32",
                  "RDO 33",
                  "RDO 34",
                  "RDO 36",
                ],
                series: [
                  { name: "Queued", data: [43, 33, 22, 37, 67, 68, 37] },
                  { name: "Servicing", data: [51, 70, 47, 67, 40, 37, 24] },
                  { name: "Verified", data: [33, 24, 42, 12, 25, 27, 31] },
                ],
              }}
              sx={{ height: "100%" }}
            />
          </Grid>
        )}

        {role === UserRole.ADMIN && (
          <Grid size={12}>
            <AnalyticsWebsiteVisits
              title="Service Review"
              subheader="From 2,876 Taxpayers"
              chart={{
                categories: [
                  "RDO 29",
                  "RDO 30",
                  "RDO 31",
                  "RDO 32",
                  "RDO 33",
                  "RDO 34",
                  "RDO 36",
                ],
                series: [
                  {
                    name: "Lubos na 'Di Nasiyahan",
                    data: [44, 55, 41, 64, 22, 34, 25],
                  },
                  { name: "Di Nasiyahan", data: [53, 32, 33, 52, 13, 34, 25] },
                  {
                    name: "Di Makapagdesisyon",
                    data: [80, 50, 30, 40, 100, 34, 25],
                  },
                  { name: "Nasiyahan", data: [80, 50, 30, 40, 100, 34, 25] },
                  {
                    name: "Lubos na Nasiyahan",
                    data: [20, 30, 40, 80, 20, 34, 25],
                  },
                ],
              }}
              sx={{ height: "100%" }}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Requirements Analytics"
            subheader="From 2,876 Transactions"
            chart={{
              categories: [
                "TIN Registration",
                "Business or Branch Registration",
                "Closure of Business or Cancellation of Registration",
                "Filing & Payment",
                "Certificate & Clearance",
              ],
              series: [
                {
                  name: "Complete Requirements",
                  data: [44, 55, 41, 64, 22, 51],
                },
                {
                  name: "Incomplete Requirements",
                  data: [53, 32, 33, 52, 13, 47],
                },
              ],
            }}
            sx={{ height: "100%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Service Analytics"
            chart={{
              series: [
                { label: "TIN Registration", value: 3500 },
                { label: "Business or Branch Registration", value: 2500 },
                { label: "System or Permit Registration", value: 1500 },
                {
                  label: "Closure of Business or Cancellation of Registration",
                  value: 500,
                },
                { label: "Filing & Payment", value: 1500 },
                { label: "Certificate & Clearance", value: 2500 },
              ],
            }}
            sx={{ height: "100%" }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
