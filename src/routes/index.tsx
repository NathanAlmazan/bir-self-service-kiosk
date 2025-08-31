import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router";

import KioskLayout from "src/layout/kiosk";
import DashboardLayout from "src/layout/dashboard";
import Fallback from "src/components/fallback";
import AuthProvider from "src/pages/auth/AuthProvider";

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
const HistoryPage = lazy(() => import("src/pages/history"));
const EncodePage = lazy(() => import("src/pages/encode"));
const QueuePage = lazy(() => import("src/pages/queue"));
const EncodePreviewPage = lazy(() => import("src/pages/encode/preview"));
const NotFoundPage = lazy(() => import("src/pages/not-found"));
const InternalErrorPage = lazy(() => import("src/pages/internal-error"));
const SignInPage = lazy(() => import("src/pages/auth"));

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
      {
        path: "kiosk/services",
        element: <ServicesPage />,
      },
      {
        path: "kiosk/transactions/:service",
        element: <PublishedTransactionsPage />,
      },
      {
        path: "kiosk/requirements/:uuid",
        element: <RequirementsPage />,
      },
      {
        path: "kiosk/verify/:uuid",
        element: <VerificationPage />,
      },
    ],
  },
  {
    element: (
      <AuthProvider>
        <DashboardLayout>
          <Suspense fallback={<Fallback />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard/home",
        element: <DashboardPage />,
      },
      {
        path: "dashboard/charter",
        element: <DraftTransactionsPage />,
      },
      {
        path: "dashboard/charter/:uuid",
        element: <EncodePreviewPage />,
      },
      {
        path: "dashboard/encode",
        element: <EncodePage />,
      },
      {
        path: "dashboard/encode/:uuid",
        element: <EncodePage />,
      },
       {
        path: "dashboard/queue",
        element: <QueuePage />,
      },
      {
        path: "dashboard/history",
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: "dashboard/signin",
    element: <SignInPage />,
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
