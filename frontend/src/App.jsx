import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import DoctorLogin from "./pages/DoctorLogin";
import OtpGate from "./pages/OtpGate";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientLogin from "./pages/PatientLogin";
import PatientDashboard from "./pages/PatientDashboard";

function DoctorRoute({ children }) {
  const { isAuthenticated, isDoctor } = useAuth();
  if (!isAuthenticated || !isDoctor) return <Navigate to="/doctor/login" replace />;
  return children;
}

function PatientRoute({ children }) {
  const { isAuthenticated, isPatient } = useAuth();
  if (!isAuthenticated || !isPatient) return <Navigate to="/patient/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/otp" element={<DoctorRoute><OtpGate /></DoctorRoute>} />
      <Route path="/doctor/dashboard/:patient_urn" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/dashboard" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="mesh-gradient" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
