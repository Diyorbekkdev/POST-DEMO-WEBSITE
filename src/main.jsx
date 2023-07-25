import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { MainProvider } from "./context/MainContext.jsx";
import "antd/dist/reset.css";
import AuthContextProvider from "./context/AuthContext.jsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <MainProvider>
          <App />
        </MainProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
