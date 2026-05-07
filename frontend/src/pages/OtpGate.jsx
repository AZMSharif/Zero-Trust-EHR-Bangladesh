import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { Shield, KeyRound, Globe, Loader2, ArrowLeft, Smartphone, CheckCircle2, Search } from "lucide-react";

export default function OtpGate() {
  const { t, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [urn, setUrn] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpInfo, setOtpInfo] = useState(null);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!urn.trim()) return;
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/otp/request", { patient_urn: urn.trim() });
      setOtpInfo(data); setStep(2);
    } catch (err) { setError(err.response?.data?.error || t("otpRequestFailed")); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/otp/verify", { patient_urn: urn.trim(), otp: otp.trim() });
      localStorage.setItem("ehr-grant", JSON.stringify({ patient_urn: data.grant.patient_urn, expires_at: data.grant.expires_at }));
      navigate(`/doctor/dashboard/${urn.trim()}`);
    } catch (err) { setError(err.response?.data?.error || t("otpVerifyFailed")); }
    finally { setLoading(false); }
  };

  const handleReset = () => { setStep(1); setUrn(""); setOtp(""); setError(""); setOtpInfo(null); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <button onClick={toggleLang} className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white/70 z-50">
        <Globe size={14} className="text-sky-400" /> {t("language")}
      </button>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"><ArrowLeft size={16} /> {t("logout")}</button>
          {user && <span className="text-xs text-white/30 bg-white/5 rounded-lg px-3 py-1.5">👨‍⚕️ {user.full_name}</span>}
        </div>
        <div className="glass-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/20 flex items-center justify-center shadow-lg mb-4">
              {step === 1 ? <Search size={28} className="text-amber-400" /> : <KeyRound size={28} className="text-amber-400" />}
            </div>
            <h1 className="text-2xl font-bold text-white">{t("consentGate")}</h1>
            <p className="text-sm text-white/40 mt-1">{step === 1 ? t("otpStep1Desc") : t("otpStep2Desc")}</p>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${step >= 1 ? "bg-sky-500/20 text-sky-300" : "bg-white/5 text-white/30"}`}>
              <span className="w-5 h-5 rounded-full bg-sky-500/30 flex items-center justify-center text-[10px]">1</span> {t("enterUrn")}
            </div>
            <div className="w-8 h-px bg-white/10" />
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${step >= 2 ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/30"}`}>
              <span className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">2</span> {t("verifyOtp")}
            </div>
          </div>
          {error && <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("patientURN")}</label>
                <input type="text" value={urn} onChange={(e) => setUrn(e.target.value)} placeholder="cmovwcaup000dqaa4pskd0yts" className="glass-input font-mono text-sm" autoFocus required />
              </div>
              <button type="submit" disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> {t("sendingOtp")}</> : <><Smartphone size={18} /> {t("requestOtp")}</>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {otpInfo && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm text-emerald-300 font-medium">{otpInfo.patient_name}</p>
                  <p className="text-xs text-white/40 mt-1">📱 OTP sent to {otpInfo.mobile_masked}</p>
                  {otpInfo.demo_otp && <p className="text-xs text-amber-400 mt-2 font-mono bg-amber-500/10 rounded-lg px-2 py-1 inline-block">Demo OTP: {otpInfo.demo_otp}</p>}
                </div>
              )}
              <div>
                <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("enterOtpCode")}</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" className="glass-input text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} autoFocus required />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="glass-btn w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> {t("verifying")}</> : <><CheckCircle2 size={18} /> {t("verifyAndAccess")}</>}
              </button>
              <button type="button" onClick={handleReset} className="w-full text-center text-sm text-white/30 hover:text-white/60 transition-colors">{t("tryDifferentPatient")}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
