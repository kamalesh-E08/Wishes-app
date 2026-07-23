import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import DashboardLayout from "../components/layout/DashboardLayout";

import HomePage from "../pages/HomePage";
import CreateWishPage from "../pages/CreateWishPage";
import PreviewPage from "../pages/PreviewPage";
import HistoryPage from "../pages/HistoryPage";
import ResultPage from "../pages/ResultPage";
import EventDashboardPage from "../pages/EventDashboardPage"
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ExcelImportPage from "../pages/ExcelImportPage";
import OneDrivePage from "../pages/OneDrivePage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Standard Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes with Dashboard (Sidebar) Layout */}
      <Route element={<DashboardLayout />}>
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
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventDashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Dashboard Hub */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Cloud Sync & Excel Import */}
        <Route path="/onedrive" element={<ProtectedRoute><OneDrivePage /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ExcelImportPage /></ProtectedRoute>} />
        
        {/* Temporary stubs for new sidebar navigation mapping to EventDashboardPage until built */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
