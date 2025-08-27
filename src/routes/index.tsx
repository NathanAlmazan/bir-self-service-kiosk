import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router";

import KioskLayout from "src/layout/kiosk";
import DashboardLayout from "src/layout/dashboard";
import Fallback from "src/components/fallback";

// Pages
const ServicesPage = lazy(() => import("src/pages/services"));
const DashboardPage = lazy(() => import("src/pages/dashboard"));
const DraftTransactionsPage = lazy(
  () => import("src/pages/transactions/drafts")
);
const PublishedTransactionsPage = lazy(
  () => import("src/pages/transactions/published")
);
const RequirementsPage = lazy(() => import("src/pages/requirements"));
const VerificationPage = lazy(() => import("src/pages/verify"));
const QueuePage = lazy(() => import("src/pages/queue"));
const EncodePage = lazy(() => import("src/pages/encode"));
const NotFoundPage = lazy(() => import("src/pages/not-found"));
const InternalErrorPage = lazy(() => import("src/pages/internal-error"));

const routes: RouteObject[] = [
  {
    element: (
      <KioskLayout>
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </KioskLayout>
    ),
    children: [
      { path: "services", element: <ServicesPage /> },
      { path: "transactions/:service", element: <PublishedTransactionsPage /> },
      { path: "requirements/:uuid", element: <RequirementsPage /> },
    ],
  },
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "charter", element: <DraftTransactionsPage /> },
      { path: "encode", element: <EncodePage /> },
      { path: "encode/:uuid", element: <EncodePage /> },
      { path: "queue", element: <QueuePage /> },
      { path: "verify/:uuid", element: <VerificationPage /> },
    ],
  },
  {
    path: "404",
    element: <NotFoundPage />,
  },
  {
    path: "500",
    element: <InternalErrorPage />,
  },
  { path: "*", element: <NotFoundPage /> },
];

export default routes;
