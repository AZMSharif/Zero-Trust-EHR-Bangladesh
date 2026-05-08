import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import {
  Shield, Activity, Syringe, FileText, Globe, User,
  AlertTriangle, Heart, Cigarette, Wine, Leaf, Cannabis,
  Clock, Loader2, FlaskConical, Pill, LogOut, ShieldAlert,
  Download, Upload, Trash2, Stethoscope, CalendarDays
} from "lucide-react";
import ReportUploadModal from "../components/ReportUploadModal";

function GlassCard({ children, className = "" }) {
  return <div className={`glass-card p-5 ${className}`}>{children}</div>;
}

function SectionHeader({ icon: Icon, title, accent = "sky" }) {
  const colors = { sky: "text-sky-400", teal: "text-teal-400", amber: "text-amber-400", rose: "text-rose-400", violet: "text-violet-400", emerald: "text-emerald-400" };
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 ${colors[accent]}`}><Icon size={16} /></div>
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
    </div>
  );
}

function ConditionBadge({ label, isActive }) {
  return (
    <span className={isActive ? "badge-active" : "badge-inactive"}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-red-400" : "bg-white/20"}`} />{label}
    </span>
  );
}

function LifestyleRow({ icon: Icon, label, status, t }) {
  const s = { NEVER: { color: "text-emerald-400", bg: "bg-emerald-500/10" }, FORMER: { color: "text-amber-400", bg: "bg-amber-500/10" }, CURRENT: { color: "text-red-400", bg: "bg-red-500/10" } }[status] || { color: "text-emerald-400", bg: "bg-emerald-500/10" };
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
  const colorMap = { sky: "bg-sky-500/15 text-sky-300 ring-sky-500/20", amber: "bg-amber-500/15 text-amber-300 ring-amber-500/20", rose: "bg-rose-500/15 text-rose-300 ring-rose-500/20", violet: "bg-violet-500/15 text-violet-300 ring-violet-500/20", teal: "bg-teal-500/15 text-teal-300 ring-teal-500/20" };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => <span key={i} className={`badge ring-1 ${colorMap[color]}`}>{item}</span>)}
    </div>
  );
}

export default function PatientDashboard() {
  const { t, lang, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/my/dashboard");
      setPatient(data);
    } catch (err) { setError(err.response?.data?.error || "Failed to load dashboard"); }
    finally { setLoading(false); }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm(t("confirmDeleteReport") || "Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/patient/${patient.patient_urn}/report/${reportId}`);
      fetchData();
    } catch (err) {
      alert(t("deleteFailed") || "Failed to delete report.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="text-sky-400 animate-spin" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="glass-card p-8 text-center"><p className="text-red-300">{error}</p><button onClick={handleLogout} className="glass-btn mt-4">{t("logout")}</button></div></div>;
  if (!patient) return null;

  const snap = patient.medical_snapshot || {};
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <header className="glass-card p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg"><User size={22} className="text-white" /></div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">{t("patientPortal")}</h1>
              <p className="text-xs text-white/40">{t("appName")} • {t("myHealthRecords")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"><Globe size={14} className="text-sky-400" /> {t("language")}</button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-medium text-red-300"><LogOut size={14} /> {t("logout")}</button>
          </div>
        </div>
      </header>

      {/* Patient Identity */}
      <div className="glass-card p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-xl font-bold text-violet-300">{patient.full_name.charAt(0)}</div>
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
        </div>
      </div>

      {/* Alerts */}
      {snap.allergies?.length > 0 && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-red-300 text-sm">{t("alertAllergy")}</p>
              <div className="flex flex-wrap gap-2 mt-2">{snap.allergies.map((a, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-medium ring-1 ring-red-400/30">{a}</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        <GlassCard><SectionHeader icon={Activity} title={t("medicalConditions")} accent="rose" />
          <div className="flex flex-wrap gap-2">
            <ConditionBadge label={t("asthma")} isActive={snap.has_asthma} />
            <ConditionBadge label={t("tuberculosis")} isActive={snap.has_tuberculosis} />
            <ConditionBadge label={t("hiv")} isActive={snap.has_hiv} />
            <ConditionBadge label={t("jaundice")} isActive={snap.has_jaundice} />
            <ConditionBadge label={t("anemia")} isActive={snap.has_anemia} />
            <ConditionBadge label={t("diabetes")} isActive={snap.has_diabetes} />
          </div>
        </GlassCard>
        <GlassCard><SectionHeader icon={Heart} title={t("lifestyle")} accent="teal" />
          <LifestyleRow icon={Cigarette} label={t("smoking")} status={snap.smoking_status} t={t} />
          <LifestyleRow icon={Wine} label={t("alcohol")} status={snap.alcohol_status} t={t} />
          <LifestyleRow icon={Leaf} label={t("betelLeaf")} status={snap.chews_betel_leaf} t={t} />
          <LifestyleRow icon={Cannabis} label={t("cannabis")} status={snap.uses_cannabis} t={t} />
        </GlassCard>
        <GlassCard><SectionHeader icon={User} title={t("demographics")} accent="violet" />
          <div className="space-y-3 text-sm">
            {[[t("dateOfBirth"), new Date(patient.dob).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" })], [t("bloodGroup"), t(patient.blood_group)], [t("mobileNumber"), patient.mobile_number], [t("nidBirthCert"), patient.nid_or_birth_cert]].map(([l, v], i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"><span className="text-white/50">{l}</span><span className="text-white/90 font-medium text-right">{v}</span></div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Clinical History */}
      <GlassCard className="mb-6"><SectionHeader icon={FlaskConical} title={t("clinicalHistory")} accent="amber" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("chronicDiseases")}</p><TagList items={snap.chronic_diseases} emptyText={t("noRecords")} color="amber" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("geneticDiseases")}</p><TagList items={snap.genetic_diseases} emptyText={t("noRecords")} color="violet" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("allergies")}</p><TagList items={snap.allergies} emptyText={t("noRecords")} color="rose" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("drugHistory")}</p><TagList items={snap.drug_history} emptyText={t("noRecords")} color="sky" /></div>
          <div><p className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">{t("majorSurgeries")}</p><TagList items={snap.major_surgeries} emptyText={t("noRecords")} color="teal" /></div>
        </div>
      </GlassCard>

      {/* Treatment History (Prescriptions) */}
      <GlassCard className="mb-6">
        <SectionHeader icon={Stethoscope} title={t("treatmentHistory")} accent="violet" />
        {(patient.prescriptions || []).length === 0 ? (
          <p className="text-white/30 text-sm italic">{t("noPrescriptions")}</p>
        ) : (
          <div className="space-y-4">
            {patient.prescriptions.map((rx) => {
              const meds = Array.isArray(rx.medications_json) ? rx.medications_json : [];
              return (
                <div key={rx.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                        <Stethoscope size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{rx.doctor?.full_name || rx.doctor_bmdc}</p>
                        {rx.doctor?.specialty && <p className="text-xs text-white/40">{rx.doctor.specialty}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <CalendarDays size={12} />
                      <span>{new Date(rx.date_issued).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  </div>

                  {rx.diagnosis && (
                    <div className="mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{t("diagnosis")}</span>
                      <p className="text-sm text-amber-300/90 mt-0.5">{rx.diagnosis}</p>
                    </div>
                  )}

                  {meds.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{t("medications")}</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {meds.map((med, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 text-xs ring-1 ring-sky-500/20">
                            {typeof med === "string" ? med : `${med.name || ""} ${med.dosage || ""} ${med.frequency || ""}`.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {rx.clinical_notes && (
                    <div className="mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{t("clinicalNotes")}</span>
                      <p className="text-xs text-white/50 mt-0.5">{rx.clinical_notes}</p>
                    </div>
                  )}

                  {rx.follow_up_date && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 mt-1">
                      <CalendarDays size={11} />
                      <span>{t("followUp")}: {new Date(rx.follow_up_date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Immunizations + Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <GlassCard delay={0.5}><SectionHeader icon={Syringe} title={t("immunizations")} accent="emerald" /><table className="w-full text-sm"><thead><tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10"><th className="text-left py-2 pr-4">{t("vaccine")}</th><th className="text-left py-2 pr-4">{t("dose")}</th><th className="text-left py-2 pr-4">{t("dateAdministered")}</th><th className="text-left py-2">{t("status")}</th></tr></thead><tbody>{(patient.immunizations || []).map((imm) => <tr key={imm.id} className="border-b border-white/5"><td className="py-2.5 pr-4 text-white/80">{imm.vaccine_name}</td><td className="py-2.5 pr-4 text-white/50">#{imm.dose_number}</td><td className="py-2.5 pr-4 text-white/50">{imm.date_administered ? new Date(imm.date_administered).toLocaleDateString() : "—"}</td><td className="py-2.5"><span className={imm.status === "COMPLETED" ? "badge-completed" : imm.status === "OVERDUE" ? "badge-overdue" : "badge-pending"}>{t(imm.status.toLowerCase())}</span></td></tr>)}</tbody></table></GlassCard>
        
        <GlassCard delay={0.55}>
          <div className="flex items-center justify-between">
            <SectionHeader icon={FileText} title={t("recentReports")} accent="sky" />
            <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-lg text-xs font-medium transition-colors border border-sky-500/20 -mt-4">
              <Upload size={14} /> {t("upload") || "Upload"}
            </button>
          </div>
          {(patient.test_reports || []).length === 0 ? (
            <p className="text-white/30 text-sm italic">{t("noReports")}</p>
          ) : (
            <div className="space-y-3">
              {patient.test_reports.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400"><FileText size={16} /></div>
                    <div>
                      <p className="text-sm text-white/80 font-medium group-hover:text-sky-400 transition-colors">{r.file_name}</p>
                      <p className="text-xs text-white/40">
                        {t(r.report_type)} • {r.file_size_kb}KB
                        {r.uploaded_at && ` • ${new Date(r.uploaded_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={r.file_url} download={r.file_name} className="p-2 text-white/30 hover:text-sky-400 hover:bg-white/5 rounded-lg transition-colors" title="Download">
                      <Download size={16} />
                    </a>
                    <button onClick={() => handleDeleteReport(r.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>


      <ReportUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        patientUrn={patient.patient_urn} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
