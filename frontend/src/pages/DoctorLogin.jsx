import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { Shield, Stethoscope, Globe, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function DoctorLogin() {
  const { t, toggleLang } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [bmdc, setBmdc] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bmdc.trim() || !password) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/doctor/login", {
        bmdc_number: bmdc.trim(),
        password,
      });
      login(data.token, { ...data.doctor, role: "doctor" });
      navigate("/doctor/otp");
    } catch (err) {
      setError(err.response?.data?.error || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <button onClick={toggleLang} className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white/70 z-50">
        <Globe size={14} className="text-sky-400" /> {t("language")}
      </button>

      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> {t("backToHome")}
        </button>

        <div className="glass-card p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4">
              <Stethoscope size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t("doctorPortal")}</h1>
            <p className="text-sm text-white/40 mt-1">{t("doctorLoginDesc")}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("bmdcNumber")}</label>
              <input
                type="text"
                value={bmdc}
                onChange={(e) => setBmdc(e.target.value)}
                placeholder="A-56789"
                className="glass-input"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={18} className="animate-spin" /> {t("loggingIn")}</> : <><Shield size={18} /> {t("loginBtn")}</>}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
