import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createHashRouter } from 'react-router';

import App from 'src/app';
import routes from 'src/routes';
import { ErrorBoundary } from 'src/routes/components';

// ----------------------------------------------------------------------

const router = createHashRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: routes,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);