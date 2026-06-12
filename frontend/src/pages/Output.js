import { useState, useEffect } from "react";
import { motion as m } from "framer-motion";

const VERDICT_CONFIG = {
  high: { label: "READY TO APPLY", color: "#4CAF82", glow: "rgba(76,207,130,0.3)", icon: "◆" },
  mid: { label: "ALMOST THERE", color: "#e8943a", glow: "rgba(232,148,58,0.3)", icon: "◈" },
  low: { label: "KEEP BUILDING", color: "#e05c5c", glow: "rgba(224,92,92,0.3)", icon: "◉" },
};

function getVerdict(pct) {
  if (pct >= 70) return "high";
  if (pct >= 40) return "mid";
  return "low";
}

function SkillPill({ skill, type, delay }) {
  const colors = {
    matched: { bg: "rgba(76,207,130,0.1)", border: "rgba(76,207,130,0.3)", text: "#4CAF82" },
    missing_core: { bg: "rgba(224,92,92,0.1)", border: "rgba(224,92,92,0.3)", text: "#e05c5c" },
    missing_gth: { bg: "rgba(123,107,158,0.1)", border: "rgba(123,107,158,0.3)", text: "#9d8ec0" },
  };
  const c = colors[type];
  return (
    <m.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        display: "inline-block",
        padding: "4px 12px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        fontSize: 12, color: c.text,
        margin: "3px",
      }}
    >
      {skill}
    </m.span>
  );
}
export default function Output({ result, session, onReset,onViewHistory }) {
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    if (!result) return;
    fetch("https://ascent1.onrender.com/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { "Authorization": `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(result),
    })
      .then(r => r.json())
      .then(data => {
        setReport(data.report || null);
        setReportLoading(false);
      })
      .catch(() => setReportLoading(false));
  }, [result]);

  if (!result) return null;

  const pct = result.match_percent || 0;
  const verdictKey = getVerdict(pct);
  const verdict = VERDICT_CONFIG[verdictKey];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <m.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={styles.container}
    >
      <div style={styles.bgGlow} />
      <div style={styles.grid} />

      <div style={styles.inner}>
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <h1 style={styles.logo}>ASCENT</h1>
          <p style={styles.stepLabel}>Step 03 — Gap Analysis Report</p>
        </m.div>

        {/* AI Mentor Verdict */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={styles.mentorCard}
        >
          <div style={styles.mentorHeader}>
            <span style={styles.mentorIcon}>◆</span>
            <h3 style={styles.mentorTitle}>Mentor Verdict</h3>
          </div>
          {reportLoading ? (
  <m.p
    animate={{ opacity: [0.3, 1, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    style={styles.mentorLoading}
  >
    Generating your personalized verdict...
  </m.p>
) : report ? (
  <div style={styles.mentorSections}>
    <div style={styles.mentorBlock}>
      <h4 style={styles.mentorBlockTitle}>
        {report.verdict_title}
      </h4>
    </div>

    <div style={styles.mentorBlock}>
      <span style={styles.mentorLabel}>Current Standing</span>
      <p style={styles.mentorText}>
        {report.current_standing}
      </p>
    </div>

    <div style={styles.mentorBlock}>
      <span style={styles.mentorLabel}>Biggest Bottleneck</span>
      <p style={styles.mentorText}>
        {report.biggest_bottleneck}
      </p>
    </div>

    <div style={styles.mentorBlock}>
      <span style={styles.mentorLabel}>Priority Action</span>
      <p style={styles.mentorText}>
        {report.priority_action}
      </p>
    </div>

    <div style={styles.mentorBlock}>
      <span style={styles.mentorLabel}>Estimated Time</span>
      <p style={styles.mentorText}>
        {report.estimated_time_to_ready}
      </p>
    </div>

    <div style={styles.mentorBlock}>
      <span style={styles.mentorLabel}>Keep Going</span>
      <p style={styles.mentorText}>
        {report.encouragement}
      </p>
    </div>
  </div>
) : null}
        </m.div>

        <div style={styles.topRow}>
          {/* Match score circle */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={styles.scoreCard}
          >
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(232,148,58,0.1)" strokeWidth="6" />
              <m.circle
                cx="60" cy="60" r="54" fill="none"
                stroke={verdict.color} strokeWidth="6"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 8px ${verdict.glow})` }}
              />
              <text x="60" y="55" textAnchor="middle" fill={verdict.color}
                fontSize="22" fontWeight="700" fontFamily="Cinzel, serif">{pct}%</text>
              <text x="60" y="72" textAnchor="middle" fill="#9e95b0"
                fontSize="9" fontFamily="Outfit, sans-serif" letterSpacing="2">MATCH</text>
            </svg>

            <div style={{ ...styles.verdictBadge, color: verdict.color, borderColor: verdict.color, boxShadow: `0 0 20px ${verdict.glow}` }}>
              <span>{verdict.icon}</span> {verdict.label}
            </div>

            <p style={styles.roleName}>{result.role}</p>
          </m.div>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={styles.statsCol}
          >
            {[
              { label: "Skills Matched", val: result.matched_skills?.length || 0, color: "#4CAF82" },
              { label: "Core Gaps", val: result.missing_core?.length || 0, color: "#e05c5c" },
              { label: "Good-to-Have Gaps", val: result.missing_good_to_have?.length || 0, color: "#9d8ec0" },
              { label: "Skills Extracted", val: result.extracted_skills?.length || 0, color: "#e8943a" },
            ].map((s, i) => (
              <m.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={styles.statCard}
              >
                <span style={{ ...styles.statVal, color: s.color }}>{s.val}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </m.div>
            ))}
          </m.div>
        </div>

        {/* Skill sections */}
        <div style={styles.sections}>
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={{ ...styles.sectionDot, background: "#4CAF82" }} />
              <h3 style={styles.sectionTitle}>Matched Skills</h3>
              <span style={styles.sectionCount}>{result.matched_skills?.length || 0}</span>
            </div>
            <div style={styles.pillsRow}>
              {result.matched_skills?.map((s, i) => <SkillPill key={s} skill={s} type="matched" delay={0.6 + i * 0.03} />)}
              {(!result.matched_skills?.length) && <p style={styles.empty}>None matched</p>}
            </div>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={{ ...styles.sectionDot, background: "#e05c5c" }} />
              <h3 style={styles.sectionTitle}>Critical Gaps — Core Skills</h3>
              <span style={styles.sectionCount}>{result.missing_core?.length || 0}</span>
            </div>
            <div style={styles.pillsRow}>
              {result.missing_core?.map((s, i) => <SkillPill key={s} skill={s} type="missing_core" delay={0.7 + i * 0.03} />)}
              {(!result.missing_core?.length) && <p style={{ ...styles.empty, color: "#4CAF82" }}>✓ All core skills present</p>}
            </div>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={{ ...styles.sectionDot, background: "#9d8ec0" }} />
              <h3 style={styles.sectionTitle}>Good-to-Have Gaps</h3>
              <span style={styles.sectionCount}>{result.missing_good_to_have?.length || 0}</span>
            </div>
            <div style={styles.pillsRow}>
              {result.missing_good_to_have?.map((s, i) => <SkillPill key={s} skill={s} type="missing_gth" delay={0.8 + i * 0.03} />)}
            </div>
          </m.div>
        </div>

        {/* Actions */}
<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={styles.actions}>
  <m.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onViewHistory}
    style={styles.historyBtn}
  >
    ◈ View My History
  </m.button>
  <m.button
    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(232,148,58,0.3)" }}
    whileTap={{ scale: 0.97 }}
    onClick={onReset}
    style={styles.resetBtn}
  >
    ← Analyze Another Profile
  </m.button>
</m.div>
      </div>
    </m.div>
  );
}

const styles = {
  container: {
    position: "fixed", inset: 0,
    background: "var(--bg-deep)",
    overflow: "auto", padding: "24px",
  },
  bgGlow: {
    position: "fixed", top: "20%", right: "15%",
    width: 600, height: 500,
    background: "radial-gradient(ellipse, rgba(232,148,58,0.05) 0%, transparent 70%)",
    filter: "blur(60px)", pointerEvents: "none",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: `linear-gradient(rgba(232,148,58,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,148,58,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px", pointerEvents: "none",
  },
  inner: {
    position: "relative", zIndex: 10,
    maxWidth: 960, margin: "0 auto",
  },
  header: {
    textAlign: "center", marginBottom: 20,
  },
  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: 22, fontWeight: 900, letterSpacing: "0.3em",
    background: "linear-gradient(135deg, #f5b868, #e8943a)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", marginBottom: 4,
  },
  stepLabel: {
    fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  mentorCard: {
  background: "linear-gradient(135deg, rgba(123,107,158,0.08), rgba(232,148,58,0.04))",
  border: "1px solid rgba(123,107,158,0.25)",
  borderRadius: 8,
  padding: "32px 40px",
  marginBottom: 28,
},
  mentorHeader: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
  },
  mentorIcon: { color: "#9d8ec0", fontSize: 12 },
  mentorTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13, fontWeight: 600, letterSpacing: "0.1em",
    color: "var(--text-primary)",
  },
  mentorLoading: {
    fontSize: 13, color: "var(--text-muted)", fontStyle: "italic",
  },
  mentorText: {
  fontSize: 15,
  lineHeight: 1.8,
  color: "var(--text-secondary)",
},
  topRow: {
    display: "flex", gap: 24, marginBottom: 20, alignItems: "flex-start",
  },
  scoreCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "24px 32px", minWidth: 220,
  },
  verdictBadge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 16px", border: "1px solid",
    borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.1em",
  },
  roleName: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13, color: "var(--text-secondary)", letterSpacing: "0.1em",
  },
  statsCol: {
    flex: 1, display: "grid",
    gridTemplateColumns: "1fr 1fr", gap: 12,
  },
  statCard: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "16px 20px",
    display: "flex", flexDirection: "column", gap: 4,
  },
  statVal: {
    fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 700, lineHeight: 1,
  },
  statLabel: {
    fontSize: 11, color: "var(--text-muted)",
    letterSpacing: "0.08em", textTransform: "uppercase",
  },
  sections: {
    display: "flex", flexDirection: "column", gap: 16, marginBottom: 24,
  },
  section: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "18px 20px",
  },
  sectionHeader: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
  },
  sectionDot: {
    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
  },
  sectionTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
    color: "var(--text-primary)", flex: 1,
  },
  sectionCount: {
    fontSize: 12, color: "var(--text-muted)",
    background: "var(--bg-elevated)", padding: "2px 10px",
    borderRadius: 10,
  },
  pillsRow: { display: "flex", flexWrap: "wrap" },
  empty: { fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" },
  actions: { display: "flex", justifyContent: "center", paddingBottom: 24 },
  resetBtn: {
    padding: "12px 32px",
    background: "transparent",
    border: "1px solid var(--border-hover)",
    borderRadius: 4, color: "#e8943a",
    fontFamily: "'Cinzel', serif",
    fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
    cursor: "pointer",
  },
  mentorSections: {
  display: "flex",
  flexDirection: "column",
  gap: 16,
},

mentorBlock: {
  paddingBottom: 12,
  borderBottom: "1px solid rgba(123,107,158,0.15)",
},

mentorLabel: {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#e8943a",
  marginBottom: 6,
},

mentorBlockTitle: {
  fontFamily: "'Cinzel', serif",
  fontSize: 20,
  color: "#f5b868",
  marginBottom: 8,
},
// add to styles:
actions: { display: "flex", justifyContent: "center", gap: 12, paddingBottom: 24 },
historyBtn: {
  padding: "12px 28px",
  background: "rgba(123,107,158,0.15)",
  border: "1px solid rgba(123,107,158,0.3)",
  borderRadius: 4, color: "#9d8ec0",
  fontFamily: "'Cinzel', serif",
  fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
  cursor: "pointer",
},
};