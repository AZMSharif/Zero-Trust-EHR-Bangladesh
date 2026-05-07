import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Shield, Activity, Syringe, FileText, Brain, Globe, User,
  AlertTriangle, Heart, Cigarette, Wine, Leaf, Cannabis,
  Download, Clock, ChevronRight, Sparkles, CheckCircle2, Loader2,
  FlaskConical, Pill, Scissors, Dna, ShieldAlert
} from "lucide-react";

/* ──────────────────────────────────────────────
   MOCK DATA (replace with API calls in production)
   ────────────────────────────────────────────── */
const MOCK_PATIENT = {
  patient_urn: "cmovwcaup000dqaa4pskd0yts",
  full_name: "Abu Zahed Mohammed Sharif",
  dob: "2001-05-14",
  blood_group: "O_POS",
  mobile_number: "+8801711111003",
  nid_or_birth_cert: "2001789012345",
  profile_image_url: null,
  medical_snapshot: {
    has_asthma: false, has_tuberculosis: false, has_hiv: false,
    has_jaundice: false, has_anemia: false, has_diabetes: false,
    smoking_status: "NEVER", alcohol_status: "NEVER",
    chews_betel_leaf: "NEVER", uses_cannabis: "NEVER",
    chronic_diseases: [],
    genetic_diseases: [],
    major_surgeries: [],
    drug_history: [],
    allergies: [],
  },
  immunizations: [
    { id: "1", vaccine_name: "BCG", dose_number: 1, date_administered: "2001-05-20", status: "COMPLETED" },
    { id: "2", vaccine_name: "COVID-19 (Sinopharm)", dose_number: 2, date_administered: "2022-04-10", status: "COMPLETED" },
    { id: "3", vaccine_name: "Td Booster", dose_number: 1, date_administered: null, status: "OVERDUE" },
  ],
  test_reports: [
    { id: "1", file_name: "CBC_Report_Apr2026.pdf", report_type: "BLOOD_CBC", uploaded_at: "2026-04-15", file_size_kb: 245 },
    { id: "2", file_name: "Chest_XRay_Mar2026.pdf", report_type: "XRAY", uploaded_at: "2026-03-22", file_size_kb: 1100 },
  ],
  prescriptions: [
    { id: "1", doctor: { full_name: "Dr. Farhan Ahmed", specialty: "General Practice" }, date_issued: "2026-05-01", medications_json: [{ name: "Paracetamol", dose: "500mg", frequency: "TID" }, { name: "Vitamin D3", dose: "2000IU", frequency: "OD" }], diagnosis: "Seasonal Flu + Vitamin D Deficiency" },
  ],
};

/* ──────────────────────────────────────────────
   HELPER COMPONENTS
   ────────────────────────────────────────────── */
function GlassCard({ children, className = "", delay = 0 }) {
  return (
    <div className={`glass-card p-5 animate-slide-up opacity-0 ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, accent = "sky" }) {
  const colors = { sky: "text-sky-400", teal: "text-teal-400", amber: "text-amber-400", rose: "text-rose-400", violet: "text-violet-400", emerald: "text-emerald-400" };
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-${accent}-500/20 to-${accent}-600/10 ${colors[accent]}`}>
        <Icon size={16} />
      </div>
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
    </div>
  );
}

function ConditionBadge({ label, isActive }) {
  return (
    <span className={isActive ? "badge-active" : "badge-inactive"}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-red-400" : "bg-white/20"}`} />
      {label}
    </span>
  );
}

function LifestyleRow({ icon: Icon, label, status, t }) {
  const statusMap = { NEVER: { color: "text-emerald-400", bg: "bg-emerald-500/10" }, FORMER: { color: "text-amber-400", bg: "bg-amber-500/10" }, CURRENT: { color: "text-red-400", bg: "bg-red-500/10" } };
  const s = statusMap[status] || statusMap.NEVER;
  const statusLabel = status === "NEVER" ? t("statusNever") : status === "FORMER" ? t("statusFormer") : t("statusCurrent");
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5 text-white/70"><Icon size={15} /><span className="text-sm">{label}</span></div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.color}`}>{statusLabel}</span>
    </div>
  );
}

function TagList({ items, emptyText, color = "sky" }) {
  if (!items || items.length === 0) return <p className="text-white/30 text-sm italic">{emptyText}</p>;
  const colorMap = { sky: "bg-sky-500/15 text-sky-300 ring-sky-500/20", teal: "bg-teal-500/15 text-teal-300 ring-teal-500/20", amber: "bg-amber-500/15 text-amber-300 ring-amber-500/20", rose: "bg-rose-500/15 text-rose-300 ring-rose-500/20", violet: "bg-violet-500/15 text-violet-300 ring-violet-500/20" };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`badge ring-1 ${colorMap[color]}`}>{item}</span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
   ────────────────────────────────────────────── */
export default function DoctorDashboard() {
  const { t, lang, toggleLang } = useLanguage();
  const [patient] = useState(MOCK_PATIENT);
  const snap = patient.medical_snapshot;

  // AI Scribe state
  const [scribeText, setScribeText] = useState("");
  const [scribeLoading, setScribeLoading] = useState(false);
  const [scribeResult, setScribeResult] = useState(null);

  // Calculate age
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  // Detect critical alerts
  const hasAllergies = snap.allergies && snap.allergies.length > 0;
  const hasCritical = snap.has_hiv || snap.has_tuberculosis;

  // AI Scribe submit handler
  const handleScribe = async () => {
    if (!scribeText.trim()) return;
    setScribeLoading(true);
    setScribeResult(null);
    try {
      const res = await fetch("/api/clinical-note/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer demo-token" },
        body: JSON.stringify({ patient_urn: patient.patient_urn, text: scribeText }),
      });
      const data = await res.json();
      if (res.ok) {
        setScribeResult({ success: true, fields: data.fields_updated || [] });
        setScribeText("");
      } else {
        setScribeResult({ success: false, error: data.error });
      }
    } catch {
      setScribeResult({ success: false, error: "Network error" });
    }
    setScribeLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* ── HEADER BAR ── */}
      <header className="glass-card p-4 md:p-5 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                {t("doctorPortal")}
              </h1>
              <p className="text-xs text-white/40">{t("appName")} • {t("dashboard")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-white/40 bg-white/5 rounded-lg px-3 py-2">
              <Clock size={13} />
              <span>{t("accessExpires")}: 14:30</span>
            </div>
            <button onClick={toggleLang} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={14} className="text-sky-400" />
              {t("language")}
            </button>
          </div>
        </div>
      </header>

      {/* ── PATIENT IDENTITY BAR ── */}
      <div className="glass-card p-4 md:p-5 mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-xl font-bold text-violet-300">
              {patient.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{patient.full_name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/50">
                <span>URN: <span className="text-sky-400 font-mono">{patient.patient_urn}</span></span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{t("age")}: {age} {t("years")}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="px-2 py-0.5 rounded-md bg-red-500/15 text-red-300 font-semibold">{t(patient.blood_group)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-white/40">
            <span className="bg-white/5 rounded-lg px-3 py-1.5">📱 {patient.mobile_number}</span>
            <span className="bg-white/5 rounded-lg px-3 py-1.5">🪪 {patient.nid_or_birth_cert}</span>
          </div>
        </div>
      </div>

      {/* ── CRITICAL ALERT BANNERS ── */}
      {hasAllergies && (
        <div className="mb-4 animate-slide-up opacity-0 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-4" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-red-300 text-sm">{t("alertAllergy")}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {snap.allergies.map((a, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-medium ring-1 ring-red-400/30">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {snap.has_hiv && (
        <div className="mb-4 animate-slide-up opacity-0 rounded-xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-sm p-3" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-rose-400 animate-pulse-slow" />
            <p className="font-bold text-rose-300 text-sm">{t("alertHIV")} — {t("alertSevere")}</p>
          </div>
        </div>
      )}

      {snap.has_tuberculosis && (
        <div className="mb-4 animate-slide-up opacity-0 rounded-xl border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm p-3" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-orange-400 animate-pulse-slow" />
            <p className="font-bold text-orange-300 text-sm">{t("alertTB")}</p>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {/* Medical Conditions */}
        <GlassCard delay={0.2}>
          <SectionHeader icon={Activity} title={t("medicalConditions")} accent="rose" />
          <div className="flex flex-wrap gap-2">
            <ConditionBadge label={t("asthma")} isActive={snap.has_asthma} />
            <ConditionBadge label={t("tuberculosis")} isActive={snap.has_tuberculosis} />
            <ConditionBadge label={t("hiv")} isActive={snap.has_hiv} />
            <ConditionBadge label={t("jaundice")} isActive={snap.has_jaundice} />
            <ConditionBadge label={t("anemia")} isActive={snap.has_anemia} />
            <ConditionBadge label={t("diabetes")} isActive={snap.has_diabetes} />
          </div>
        </GlassCard>

        {/* Lifestyle */}
        <GlassCard delay={0.3}>
          <SectionHeader icon={Heart} title={t("lifestyle")} accent="teal" />
          <div className="space-y-0">
            <LifestyleRow icon={Cigarette} label={t("smoking")} status={snap.smoking_status} t={t} />
            <LifestyleRow icon={Wine} label={t("alcohol")} status={snap.alcohol_status} t={t} />
            <LifestyleRow icon={Leaf} label={t("betelLeaf")} status={snap.chews_betel_leaf} t={t} />
            <LifestyleRow icon={Cannabis} label={t("cannabis")} status={snap.uses_cannabis} t={t} />
          </div>
        </GlassCard>

        {/* Demographics */}
        <GlassCard delay={0.4}>
          <SectionHeader icon={User} title={t("demographics")} accent="violet" />
          <div className="space-y-3 text-sm">
            {[
              [t("dateOfBirth"), new Date(patient.dob).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" })],
              [t("bloodGroup"), t(patient.blood_group)],
              [t("mobileNumber"), patient.mobile_number],
              [t("nidBirthCert"), patient.nid_or_birth_cert],
            ].map(([label, val], i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                <span className="text-white/50">{label}</span>
                <span className="text-white/90 font-medium text-right">{val}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── CLINICAL HISTORY ── */}
      <GlassCard className="mb-6" delay={0.45}>
        <SectionHeader icon={FlaskConical} title={t("clinicalHistory")} accent="amber" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("chronicDiseases")}</p><TagList items={snap.chronic_diseases} emptyText={t("noRecords")} color="amber" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("geneticDiseases")}</p><TagList items={snap.genetic_diseases} emptyText={t("noRecords")} color="violet" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("majorSurgeries")}</p><TagList items={snap.major_surgeries} emptyText={t("noRecords")} color="teal" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("drugHistory")}</p><TagList items={snap.drug_history} emptyText={t("noRecords")} color="sky" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("allergies")}</p><TagList items={snap.allergies} emptyText={t("noRecords")} color="rose" /></div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* ── IMMUNIZATIONS ── */}
        <GlassCard delay={0.5}>
          <SectionHeader icon={Syringe} title={t("immunizations")} accent="emerald" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="text-left py-2 pr-4">{t("vaccine")}</th>
                  <th className="text-left py-2 pr-4">{t("dose")}</th>
                  <th className="text-left py-2 pr-4">{t("dateAdministered")}</th>
                  <th className="text-left py-2">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {patient.immunizations.map((imm) => (
                  <tr key={imm.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4 text-white/80">{imm.vaccine_name}</td>
                    <td className="py-2.5 pr-4 text-white/50">#{imm.dose_number}</td>
                    <td className="py-2.5 pr-4 text-white/50">{imm.date_administered ? new Date(imm.date_administered).toLocaleDateString() : "—"}</td>
                    <td className="py-2.5">
                      <span className={imm.status === "COMPLETED" ? "badge-completed" : imm.status === "OVERDUE" ? "badge-overdue" : "badge-pending"}>
                        {t(imm.status.toLowerCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* ── RECENT REPORTS ── */}
        <GlassCard delay={0.55}>
          <SectionHeader icon={FileText} title={t("recentReports")} accent="sky" />
          {patient.test_reports.length === 0 ? (
            <p className="text-white/30 text-sm italic">{t("noReports")}</p>
          ) : (
            <div className="space-y-3">
              {patient.test_reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">{report.file_name}</p>
                      <p className="text-xs text-white/40">{t(report.report_type)} • {report.file_size_kb}KB • {new Date(report.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-sky-400 transition-all">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── AI CLINICAL SCRIBE ── */}
      <GlassCard className="mb-8" delay={0.6}>
        <SectionHeader icon={Brain} title={t("aiScribe")} accent="violet" />
        <p className="text-sm text-white/40 mb-4">{t("aiScribeDesc")}</p>

        <div className="relative">
          <textarea
            className="glass-input min-h-[120px] resize-none pr-4 pb-14 text-sm"
            placeholder={t("aiPlaceholder")}
            value={scribeText}
            onChange={(e) => setScribeText(e.target.value)}
            disabled={scribeLoading}
          />
          <div className="absolute bottom-3 right-3">
            <button onClick={handleScribe} disabled={scribeLoading || !scribeText.trim()} className="glass-btn text-sm px-5 py-2.5 flex items-center gap-2">
              {scribeLoading ? (
                <><Loader2 size={15} className="animate-spin" />{t("analyzing")}</>
              ) : (
                <><Sparkles size={15} />{t("analyze")}</>
              )}
            </button>
          </div>
        </div>

        {/* Scribe Result */}
        {scribeResult && (
          <div className={`mt-4 p-4 rounded-xl border ${scribeResult.success ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}`}>
            {scribeResult.success ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-300">{t("aiSuccess")}</p>
                  {scribeResult.fields.length > 0 && (
                    <p className="text-xs text-emerald-400/60 mt-1">{t("fieldsUpdated")}: {scribeResult.fields.join(", ")}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-red-400" />
                <p className="text-sm text-red-300">{scribeResult.error}</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* ── FOOTER ── */}
      <footer className="text-center text-xs text-white/20 pb-8">
        <p>Zero-Trust EHR Bangladesh • Consent-First Healthcare</p>
        <p className="mt-1 font-bangla">জিরো-ট্রাস্ট ই-এইচ-আর বাংলাদেশ • সম্মতি-প্রথম স্বাস্থ্যসেবা</p>
      </footer>
    </div>
  );
}
