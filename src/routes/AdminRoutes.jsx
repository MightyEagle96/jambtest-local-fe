import { Route, Routes } from "react-router-dom";
import AdminHomePage from "../pages/admin/AdminHomePage";
import InfractionReport from "../pages/admin/InfractionReport";
import NetworkTest from "../pages/admin/NetworkTestList";
import RegisterComputers from "../pages/admin/RegisterComputers";
import NavbarComponent from "../components/NavbarComponent";
import NetworkTestPage from "../pages/admin/ViewNetworkTest";
import TestSummary from "../pages/admin/TestSummary";
import NotFound from "../pages/NotFound";

function PrivateAdminRoutes() {
  const routes = [
    { path: "/", element: <AdminHomePage /> },
    { path: "/registercomputers", element: <RegisterComputers /> },
    { path: "/networktest", element: <NetworkTest /> },
    { path: "/networktest/:id", element: <NetworkTestPage /> },
    { path: "/testsummary/:id", element: <TestSummary /> },
    { path: "/infractions", element: <InfractionReport /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <>
      <NavbarComponent />
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export { PrivateAdminRoutes };
