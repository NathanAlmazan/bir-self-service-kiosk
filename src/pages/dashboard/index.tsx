import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DashboardContent } from "src/layout/dashboard/content";

import { AnalyticsNews } from "./analytics-news";
import { AnalyticsTasks } from "./analytics-tasks";
import { AnalyticsCurrentVisits } from "./analytics-current-visits";
import { AnalyticsOrderTimeline } from "./analytics-order-timeline";
import { AnalyticsWebsiteVisits } from "./analytics-website-visits";
import { AnalyticsWidgetSummary } from "./analytics-widget-summary";
import { AnalyticsTrafficBySite } from "./analytics-traffic-by-site";
import { AnalyticsCurrentSubject } from "./analytics-current-subject";
import { AnalyticsConversionRates } from "./analytics-conversion-rates";

// ----------------------------------------------------------------------

const _postTitles = (index: number) =>
  [
    "Whiteboard Templates By Industry Leaders",
    "Tesla Cybertruck-inspired camper trailer for Tesla fans who can’t just wait for the truck!",
    "Designify Agency Landing Page Design",
    "✨What is Done is Done ✨",
    "Fresh Prince",
    "Six Socks Studio",
    "vincenzo de cotiis’ crossing over showcases a research on contamination",
    "Simple, Great Looking Animations in Your Project | Video Tutorial",
    "40 Free Serif Fonts for Digital Designers",
    "Examining the Evolution of the Typical Web Design Client",
    "Katie Griffin loves making that homey art",
    "The American Dream retold through mid-century railroad graphics",
    "Illustration System Design",
    "CarZio-Delivery Driver App SignIn/SignUp",
    "How to create a client-serverless Jamstack app using Netlify, Gatsby and Fauna",
    "Tylko Organise effortlessly -3D & Motion Design",
    "RAYO ?? A expanded visual arts festival identity",
    "Anthony Burrill and Wired mag’s Andrew Diprose discuss how they made January’s Change Everything cover",
    "Inside the Mind of Samuel Day",
    "Portfolio Review: Is This Portfolio Too Creative?",
    "Akkers van Margraten",
    "Gradient Ticket icon",
    "Here’s a Dyson motorcycle concept that doesn’t ‘suck’!",
    "How to Animate a SVG with border-image",
  ][index];

const _description = (index: number) =>
  [
    "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
    "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    "The Football Is Good For Training And Recreational Purposes",
    "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
    "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
    "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design",
    "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
    "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
    "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design",
    "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
    "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
    "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
    "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
    "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
    "The Football Is Good For Training And Recreational Purposes",
    "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
  ][index];

const _times = (index: number) =>
  // 'MM/DD/YYYY'
  [
    "11/08/2023",
    "04/09/2024",
    "09/12/2023",
    "01/01/2024",
    "04/23/2024",
    "02/29/2024",
    "05/14/2024",
    "01/13/2024",
    "06/22/2024",
    "10/05/2023",
    "07/11/2024",
    "05/22/2024",
    "03/29/2024",
    "08/29/2023",
    "11/19/2023",
    "10/24/2023",
    "12/02/2023",
    "02/13/2024",
    "09/19/2023",
    "04/17/2024",
    "12/18/2023",
    "06/27/2024",
    "10/19/2023",
    "08/09/2024",
  ][index];

const _fullName = (index: number) =>
  [
    "Billy Stoltenberg",
    "Eloise Ebert",
    "Teresa Luettgen",
    "Salvador Mayert",
    "Dr. Guadalupe Rath",
    "Kelvin Pouros",
    "Thelma Langworth",
    "Kristen Wunsch",
    "Steve Welch",
    "Brian Jacobs",
    "Lillie Schultz",
    "Mr. Conrad Spinka",
    "Charlene Krajcik",
    "Kerry Kuhlman",
    "Betty Hammes",
    "Tony Paucek PhD",
    "Sherri Davis",
    "Angel Rolfson-Kulas",
    "Dr. Lee Doyle-Grant",
    "Cheryl Romaguera",
    "Billy Braun",
    "Adam Trantow",
    "Brandon Von",
    "Willis Ankunding",
  ][index];

const _taskNames = (index: number) =>
  [
    `Prepare Monthly Financial Report`,
    `Design New Marketing Campaign`,
    `Analyze Customer Feedback`,
    `Update Website Content`,
    `Conduct Market Research`,
    `Develop Software Application`,
    `Organize Team Meeting`,
    `Create Social Media Posts`,
    `Review Project Plan`,
    `Implement Security Protocols`,
    `Write Technical Documentation`,
    `Test New Product Features`,
    `Manage Client Inquiries`,
    `Train New Employees`,
    `Coordinate Logistics`,
    `Monitor Network Performance`,
    `Develop Training Materials`,
    `Draft Press Release`,
    `Prepare Budget Proposal`,
    `Evaluate Vendor Proposals`,
    `Perform Data Analysis`,
    `Conduct Quality Assurance`,
    `Plan Event Logistics`,
    `Optimize SEO Strategies`,
  ][index];

const _posts = [...Array(23)].map((_, index) => ({
  id: index.toString(),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: index.toString(),
  name: _taskNames(index),
}));

const _traffic = [
  {
    value: "facebook",
    label: "Facebook",
    total: 19500,
  },
  {
    value: "google",
    label: "Google",
    total: 91200,
  },
  {
    value: "linkedin",
    label: "Linkedin",
    total: 69800,
  },
  {
    value: "twitter",
    label: "Twitter",
    total: 84900,
  },
];

const _timeline = [...Array(5)].map((_, index) => ({
  id: index.toString(),
  title: [
    "1983, orders, $4220",
    "12 Invoices have been paid",
    "Order #37745 from September",
    "New order placed #XF-2356",
    "New order placed #XF-2346",
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

export default function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Weekly sales"
            percent={2.6}
            total={714000}
            icon={
              <img
                alt="Weekly sales"
                src="/assets/icons/glass/ic-glass-bag.svg"
              />
            }
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={
              <img
                alt="New users"
                src="/assets/icons/glass/ic-glass-users.svg"
              />
            }
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={
              <img
                alt="Purchase orders"
                src="/assets/icons/glass/ic-glass-buy.svg"
              />
            }
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={
              <img
                alt="Messages"
                src="/assets/icons/glass/ic-glass-message.svg"
              />
            }
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: "America", value: 3500 },
                { label: "Asia", value: 2500 },
                { label: "Europe", value: 1500 },
                { label: "Africa", value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
              ],
              series: [
                { name: "Team A", data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: "Team B", data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ["Italy", "Japan", "China", "Canada", "France"],
              series: [
                { name: "2022", data: [44, 55, 41, 64, 22] },
                { name: "2023", data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: [
                "English",
                "History",
                "Physics",
                "Geography",
                "Chinese",
                "Math",
              ],
              series: [
                { name: "Series 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Series 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Series 3", data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_traffic} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
