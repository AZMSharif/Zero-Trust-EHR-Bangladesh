import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Shield, Stethoscope, UserRound, Globe, Lock, Brain, Activity } from "lucide-react";

export default function LandingPage() {
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white/70 z-50"
      >
        <Globe size={14} className="text-sky-400" />
        {t("language")}
      </button>

      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-sky-500/30 mb-6">
          <Shield size={36} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent mb-3">
          {t("appName")}
        </h1>
        <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto">
          {t("landingSubtitle")}
        </p>
      </div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* Doctor Portal */}
        <button
          onClick={() => navigate("/doctor/login")}
          className="glass-card-hover p-8 text-left group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-teal-500/20 border border-sky-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Stethoscope size={26} className="text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t("doctorPortal")}</h2>
          <div className="mt-5 flex items-center gap-2 text-sky-400 text-sm font-medium">
            {t("loginWithBmdc")} →
          </div>
        </button>

        {/* Patient Portal */}
        <button
          onClick={() => navigate("/patient/login")}
          className="glass-card-hover p-8 text-left group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <UserRound size={26} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t("patientPortal")}</h2>
          <div className="mt-5 flex items-center gap-2 text-violet-400 text-sm font-medium">
            {t("loginWithUrn")} →
          </div>
        </button>
      </div>
    </div>
  );
}
