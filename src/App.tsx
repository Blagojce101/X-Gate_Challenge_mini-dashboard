import { useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoginPage from "./pages/login/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import TicketsPage from "./pages/tickets/TicketsPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import CustomersPage from "./pages/customers/CustomersPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setThemeMode(stored);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: { main: "#1976d2" },
          secondary: { main: "#dc004e" },
          background:
            themeMode === "dark"
              ? { default: "#121212", paper: "#1e1e1e" }
              : { default: "#f5f5f5", paper: "#fff" },
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout
                themeMode={themeMode}
                setThemeMode={setThemeMode}
              />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="/app/tickets" replace />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customer/:id" element={<CustomerDetailPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
