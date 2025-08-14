import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router";

import Layout from "src/layout";
import Fallback from "src/components/fallback";

// Pages
const ServicesPage = lazy(() => import("src/pages/services"));
const TransactionsPage = lazy(() => import("src/pages/transactions"));
const RequirementsPage = lazy(() => import("src/pages/requirements"));
const EncodePage = lazy(() => import("src/pages/encode"));
const VerificationPage = lazy(() => import("src/pages/verify"));
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
      { path: "encode", element: <EncodePage /> }
    ],
  },
  {
    path: "404",
    element: <NotFoundPage />,
  },
  {
    path: "verify/:uuid",
    element: <VerificationPage />,
  },
  { path: "*", element: <NotFoundPage /> },
];

export default routes;
