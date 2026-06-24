import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import HomePage from "../pages/HomePage";
import CreateWishPage from "../pages/CreateWishPage";
import PreviewPage from "../pages/PreviewPage";
import HistoryPage from "../pages/HistoryPage";
import ResultPage from "../pages/ResultPage";
import EventDashboardPage from "../pages/EventDashboardPage"
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateWishPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
