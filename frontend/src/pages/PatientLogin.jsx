import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { UserRound, Globe, Loader2, ArrowLeft, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";

export default function PatientLogin() {
  const { t, toggleLang } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Login state
  const [loginUrn, setLoginUrn] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regNid, setRegNid] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regBlood, setRegBlood] = useState("O_POS");
  const [regPw, setRegPw] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/patient/login", { patient_urn: loginUrn.trim(), password: loginPw });
      login(data.token, { ...data.patient, role: "patient" });
      navigate("/patient/dashboard");
    } catch (err) { setError(err.response?.data?.error || t("loginFailed")); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/patient/register", {
        full_name: regName.trim(), nid_or_birth_cert: regNid.trim(), mobile_number: regMobile.trim(),
        dob: regDob, blood_group: regBlood, password: regPw,
      });
      login(data.token, { ...data.patient, role: "patient" });
      navigate("/patient/dashboard");
    } catch (err) { setError(err.response?.data?.error || t("registrationFailed")); }
    finally { setLoading(false); }
  };

  const bloodGroups = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <button onClick={toggleLang} className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white/70 z-50">
        <Globe size={14} className="text-sky-400" /> {t("language")}
      </button>
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"><ArrowLeft size={16} /> {t("backToHome")}</button>
        <div className="glass-card p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-violet-500/20 flex items-center justify-center shadow-lg mb-4">
              <UserRound size={28} className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t("patientPortal")}</h1>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button onClick={() => { setTab("login"); setError(""); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "login" ? "bg-white/10 text-white" : "text-white/40"}`}>
              <LogIn size={15} /> {t("loginBtn")}
            </button>
            <button onClick={() => { setTab("register"); setError(""); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "register" ? "bg-white/10 text-white" : "text-white/40"}`}>
              <UserPlus size={15} /> {t("register")}
            </button>
          </div>

          {error && <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("patientURN")}</label>
                <input type="text" value={loginUrn} onChange={(e) => setLoginUrn(e.target.value)} placeholder="cmovwc..." className="glass-input font-mono text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{t("password")}</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={loginPw} onChange={(e) => setLoginPw(e.target.value)} className="glass-input pr-12" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />} {loading ? t("loggingIn") : t("loginBtn")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("fullName")}</label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className="glass-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("nidBirthCert")}</label>
                  <input type="text" value={regNid} onChange={(e) => setRegNid(e.target.value)} className="glass-input text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("mobileNumber")}</label>
                  <input type="text" value={regMobile} onChange={(e) => setRegMobile(e.target.value)} placeholder="+8801..." className="glass-input text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("dateOfBirth")}</label>
                  <input type="date" value={regDob} onChange={(e) => setRegDob(e.target.value)} className="glass-input text-sm" required />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("bloodGroup")}</label>
                  <select value={regBlood} onChange={(e) => setRegBlood(e.target.value)} className="glass-input text-sm">
                    {bloodGroups.map((bg) => <option key={bg} value={bg} className="bg-gray-900">{t(bg)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">{t("password")}</label>
                <input type="password" value={regPw} onChange={(e) => setRegPw(e.target.value)} className="glass-input" minLength={6} required />
              </div>
              <button type="submit" disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />} {loading ? t("loading") : t("register")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
