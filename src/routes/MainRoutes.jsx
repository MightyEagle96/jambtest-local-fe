import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SystemHomePage from "../pages/SystemHomePage";
import { useAuth } from "./useAuth";
import LoadingPage from "../components/LoadingPage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import NotFound from "../pages/NotFound";
import { PrivateAdminRoutes } from "./AdminRoutes";
import NetworkTestPageClient from "../pages/NetworkTestPageClient";

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  const publicRoutes = [
    { path: "/admin", element: <HomePage /> },
    { path: "/", element: <SystemHomePage /> },
    { path: "/networktest", element: <NetworkTestPageClient /> },
  ];

  const privateRoutes = [
    {
      path: "/admin",
      element: <AdminHomePage />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            {user.role === "admin" ? (
              <Route path="/admin/*" element={<PrivateAdminRoutes />} />
            ) : (
              privateRoutes.map((route, i) => (
                <Route key={i} path={route.path} element={route.element} />
              ))
            )}
          </>
        ) : (
          <>
            {publicRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
