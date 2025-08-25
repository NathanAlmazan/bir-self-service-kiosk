import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router";

import Layout from "src/layout";
import Fallback from "src/components/fallback";

// Pages
const ServicesPage = lazy(() => import("src/pages/services"));
const TransactionsPage = lazy(() => import("src/pages/transactions"));
const RequirementsPage = lazy(() => import("src/pages/requirements"));
const VerificationPage = lazy(() => import("src/pages/verify"));
const QueuePage = lazy(() => import("src/pages/queue"));
const NotFoundPage = lazy(() => import("src/pages/not-found"));
const InternalErrorPage = lazy(() => import("src/pages/internal-error"));

const routes: RouteObject[] = [
  {
    element: (
      <Layout>
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    children: [
      { path: "services", element: <ServicesPage /> },
      { path: "transactions/:service", element: <TransactionsPage /> },
      { path: "requirements/:uuid", element: <RequirementsPage /> },
      { path: "verify/:uuid", element: <VerificationPage /> },
      { path: "queue", element: <QueuePage /> },
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
