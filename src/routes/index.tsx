import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router";

import Layout from "src/layout";
import Fallback from "src/components/fallback";

// Pages
const ServicesPage = lazy(() => import("src/pages/services"));
const TransactionsPage = lazy(() => import("src/pages/transactions"));
const RequirementsPage = lazy(() => import("src/pages/requirements"));
const UserAgreementPage = lazy(() => import("src/pages/agreement"));
const NotFoundPage = lazy(() => import("src/pages/not-found"));

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
      { index: true, element: <ServicesPage /> },
      { path: "transactions/:service", element: <TransactionsPage /> },
      { path: "requirements/:uuid", element: <RequirementsPage /> },
      { path: "agreement", element: <UserAgreementPage /> },
    ],
  },
  {
    path: "404",
    element: <NotFoundPage />,
  },
  { path: "*", element: <NotFoundPage /> },
];

export default routes;
