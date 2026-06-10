import { useState, useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

const ROLE_LABELS = {
  ml_engineer: "ML Engineer",
  data_scientist: "Data Scientist",
  full_stack_developer: "Full Stack Developer",
  backend_developer: "Backend Developer",
  mlops_engineer: "MLOps Engineer",
  forward_deployed_engineer: "Forward Deployed Engineer",
};

function getVerdict(pct) {
  if (pct >= 70) return { label: "READY TO APPLY", color: "#4CAF82" };
  if (pct >= 40) return { label: "ALMOST THERE", color: "#e8943a" };
  return { label: "KEEP BUILDING", color: "#e05c5c" };
}

export default function Dashboard({ session, onNewAnalysis, onViewReport }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!session?.access_token) return;
    fetch("http://127.0.0.1:8000/history", {
      headers: { "Authorization": `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      style={styles.container}
    >
      <div style={styles.bgGlow} />
      <div style={styles.grid} />

      <div style={styles.inner}>
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={styles.header}
        >
          <h1 style={styles.logo}>ASCENT</h1>
          <p style={styles.stepLabel}>Your Climb So Far</p>
        </m.div>

        {/* New analysis CTA */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={styles.ctaRow}
        >
          <div>
            <p style={styles.ctaTitle}>
              {loading ? "Loading your history..." : `${history.length} ${history.length !== 1 ? "analyses" : "analysis"} saved`}
            </p>
            <p style={styles.ctaSub}>Track how your skills evolve over time.</p>
          </div>
          <m.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(232,148,58,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onNewAnalysis}
            style={styles.newBtn}
          >
            + New Analysis
          </m.button>
        </m.div>

        {/* History list */}
        {loading ? (
          <m.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={styles.loadingText}
          >
            Fetching your analyses...
          </m.p>
        ) : history.length === 0 ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.emptyState}
          >
            <p style={styles.emptyIcon}>◈</p>
            <p style={styles.emptyTitle}>No analyses yet</p>
            <p style={styles.emptySub}>Run your first analysis to start tracking your skill gaps.</p>
          </m.div>
        ) : (
          <div style={styles.list}>
            {history.map((item, i) => {
              const verdict = getVerdict(item.match_percentage);
              const isOpen = expanded === item.id;
              const date = new Date(item.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              const time = new Date(item.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  style={styles.card}
                >
                  {/* Card header — always visible */}
                  <div
                    style={styles.cardTop}
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                  >
                    <div style={styles.cardLeft}>
                      <span style={{ ...styles.matchPct, color: verdict.color }}>
                        {item.match_percentage}%
                      </span>
                      <div>
                        <p style={styles.roleLabel}>
                          {ROLE_LABELS[item.target_role] || item.target_role}
                        </p>
                        <p style={styles.dateLabel}>{date} · {time}</p>
                      </div>
                    </div>
                    <div style={styles.cardRight}>
                      <span style={{ ...styles.verdictBadge, color: verdict.color, borderColor: verdict.color }}>
                        {verdict.label}
                      </span>
                      <span style={{ ...styles.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                        ▾
                      </span>
                    </div>
                  </div>

                  {/* Expandable verdict detail */}
                  <AnimatePresence>
                    {isOpen && item.verdict && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        style={styles.cardBody}
                      >
                        <div style={styles.divider} />

                        <h4 style={styles.verdictTitle}>{item.verdict.verdict_title}</h4>

                        {[
                          { label: "Current Standing", key: "current_standing" },
                          { label: "Biggest Bottleneck", key: "biggest_bottleneck" },
                          { label: "Priority Action", key: "priority_action" },
                          { label: "Estimated Time", key: "estimated_time_to_ready" },
                          { label: "Keep Going", key: "encouragement" },
                        ].map(({ label, key }) => (
                          item.verdict[key] && (
                            <div key={key} style={styles.verdictBlock}>
                              <span style={styles.verdictLabel}>{label}</span>
                              <p style={styles.verdictText}>{item.verdict[key]}</p>
                            </div>
                          )
                        ))}
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              );
            })}
          </div>
        )}
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
    position: "fixed", top: "15%", right: "10%",
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
    maxWidth: 760, margin: "0 auto",
  },
  header: { textAlign: "center", marginBottom: 32 },
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
  ctaRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "20px 24px", marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4,
  },
  ctaSub: { fontSize: 13, color: "var(--text-muted)" },
  newBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #e8943a, #c47820)",
    border: "none", borderRadius: 4,
    color: "#0d0b14", fontFamily: "'Cinzel', serif",
    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
    cursor: "pointer", whiteSpace: "nowrap",
  },
  loadingText: {
    textAlign: "center", color: "var(--text-muted)",
    fontSize: 13, fontStyle: "italic", marginTop: 60,
  },
  emptyState: {
    textAlign: "center", marginTop: 80,
  },
  emptyIcon: { fontSize: 32, color: "#e8943a", marginBottom: 16 },
  emptyTitle: {
    fontFamily: "'Cinzel', serif", fontSize: 18,
    color: "var(--text-primary)", marginBottom: 8,
  },
  emptySub: { fontSize: 13, color: "var(--text-muted)" },
  list: { display: "flex", flexDirection: "column", gap: 12, paddingBottom: 32 },
  card: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, overflow: "hidden",
  },
  cardTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 24px", cursor: "pointer",
  },
  cardLeft: { display: "flex", alignItems: "center", gap: 20 },
  matchPct: {
    fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, lineHeight: 1,
    minWidth: 60,
  },
  roleLabel: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 },
  dateLabel: { fontSize: 12, color: "var(--text-muted)" },
  cardRight: { display: "flex", alignItems: "center", gap: 16 },
  verdictBadge: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    padding: "4px 12px", border: "1px solid",
    borderRadius: 20,
  },
  chevron: {
    color: "var(--text-muted)", fontSize: 16,
    transition: "transform 0.3s",
  },
  cardBody: { padding: "0 24px 24px" },
  divider: {
    height: 1, background: "var(--border)",
    marginBottom: 20,
  },
  verdictTitle: {
    fontFamily: "'Cinzel', serif", fontSize: 17,
    color: "#f5b868", marginBottom: 16,
  },
  verdictBlock: { marginBottom: 14 },
  verdictLabel: {
    display: "block", fontSize: 11, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#e8943a", marginBottom: 5,
  },
  verdictText: { fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)" },
};