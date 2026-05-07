import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import DoctorDashboard from "./components/DoctorDashboard";

export default function App() {
  return (
    <LanguageProvider>
      <div className="mesh-gradient" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
