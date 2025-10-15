import React from "react";
import MainRoutes from "./routes/MainRoutes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { AppUserProvider } from "./contexts/AppUserContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return (
    <>
      <AppUserProvider>
        <ToastContainer />
        <MainRoutes />
      </AppUserProvider>
    </>
  );
}

export default App;
