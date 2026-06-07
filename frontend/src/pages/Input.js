import { useState } from "react";
import { motion as m } from "framer-motion";

const ROLES = [
  { slug: "ml_engineer", label: "ML Engineer", icon: "⚡" },
  { slug: "data_scientist", label: "Data Scientist", icon: "◈" },
  { slug: "full_stack_developer", label: "Full Stack Developer", icon: "◉" },
  { slug: "backend_developer", label: "Backend Developer", icon: "▣" },
  { slug: "mlops_engineer", label: "MLOps Engineer", icon: "⟳" },
  { slug: "forward_deployed_engineer", label: "Forward Deployed Engineer", icon: "◆" },
];

export default function Input({ onAnalyze }) {
  const [text, setText] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return setError("Tell us about your skills and experience.");
    if (!role) return setError("Select a target role.");
    setError("");
    onAnalyze(text, role);
  };

  const charCount = text.length;

  return (
    <m.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60, scale: 0.97 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={styles.container}
    >
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.grid} />

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={styles.inner}
      >
        {/* Header */}
        <div style={styles.header}>
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={styles.headerLine}
          />
          <h1 style={styles.logo}>ASCENT</h1>
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={styles.headerLine}
          />
        </div>
        <p style={styles.step}>Step 01 — Profile Input</p>

        <div style={styles.columns}>
          {/* Left — Text input */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={styles.leftCol}
          >
            <label style={styles.label}>
              Your Profile
              <span style={styles.labelHint}>Resume, bio, or describe your skills</span>
            </label>
            <div style={styles.textareaWrapper}>
              <textarea
                style={styles.textarea}
                placeholder="I have 2 years of experience with Python, FastAPI, and building REST APIs. I've worked with Docker for containerization, deployed models on AWS, and used scikit-learn and XGBoost for ML tasks. I'm comfortable with SQL, PostgreSQL, and Git. I've also experimented with transformer models for NLP..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <div style={styles.charCount}>
                <span style={{ color: charCount > 100 ? "#4CAF82" : "var(--text-muted)" }}>
                  {charCount}
                </span> characters
              </div>
            </div>
          </m.div>

          {/* Right — Role selector */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={styles.rightCol}
          >
            <label style={styles.label}>
              Target Role
              <span style={styles.labelHint}>Where do you want to go?</span>
            </label>
            <div style={styles.roleGrid}>
              {ROLES.map((r, i) => (
                <m.button
                  key={r.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  whileHover={{ scale: 1.02, borderColor: "rgba(232,148,58,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(r.slug)}
                  style={{
                    ...styles.roleBtn,
                    ...(role === r.slug ? styles.roleActive : {}),
                  }}
                >
                  <span style={styles.roleIcon}>{r.icon}</span>
                  <span style={styles.roleLabel}>{r.label}</span>
                  {role === r.slug && (
                    <m.div
                      layoutId="roleIndicator"
                      style={styles.roleCheck}
                    >✓</m.div>
                  )}
                </m.button>
              ))}
            </div>
          </m.div>
        </div>

        {/* Error */}
        {error && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.error}
          >
            ⚠ {error}
          </m.p>
        )}

        {/* Submit */}
        <m.div style={styles.submitRow}>
          <m.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(232,148,58,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            style={styles.submitBtn}
          >
            <span>Analyze My Profile</span>
            <span style={styles.submitArrow}>→</span>
          </m.button>
        </m.div>
      </m.div>
    </m.div>
  );
}

const styles = {
  container: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--bg-deep)", overflow: "auto",
    padding: "24px",
  },
  bgGlow1: {
    position: "fixed", top: "5%", right: "10%",
    width: 600, height: 400,
    background: "radial-gradient(ellipse, rgba(232,148,58,0.05) 0%, transparent 70%)",
    filter: "blur(60px)", pointerEvents: "none",
  },
  bgGlow2: {
    position: "fixed", bottom: "10%", left: "5%",
    width: 500, height: 350,
    background: "radial-gradient(ellipse, rgba(123,107,158,0.07) 0%, transparent 70%)",
    filter: "blur(50px)", pointerEvents: "none",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: `linear-gradient(rgba(232,148,58,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,148,58,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px", pointerEvents: "none",
  },
  inner: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 960,
  },
  header: {
    display: "flex", alignItems: "center", gap: 20,
    marginBottom: 4,
  },
  headerLine: {
    flex: 1, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(232,148,58,0.3), transparent)",
    transformOrigin: "left",
  },
  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: 24, fontWeight: 900, letterSpacing: "0.3em",
    background: "linear-gradient(135deg, #f5b868, #e8943a)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  step: {
    fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "var(--text-muted)", textAlign: "center", marginBottom: 32,
  },
  columns: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
    marginBottom: 20,
  },
  leftCol: { display: "flex", flexDirection: "column" },
  rightCol: { display: "flex", flexDirection: "column" },
  label: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "var(--text-secondary)",
    marginBottom: 10,
  },
  labelHint: {
    fontSize: 11, fontWeight: 400, color: "var(--text-muted)",
    textTransform: "none", letterSpacing: 0,
  },
  textareaWrapper: { position: "relative", flex: 1 },
  textarea: {
    width: "100%", height: 280,
    padding: "16px", resize: "none",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text-primary)",
    fontSize: 14, lineHeight: 1.7,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  },
  charCount: {
    position: "absolute", bottom: 10, right: 12,
    fontSize: 11, color: "var(--text-muted)",
  },
  roleGrid: {
    display: "flex", flexDirection: "column", gap: 8,
  },
  roleBtn: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 6, cursor: "pointer",
    color: "var(--text-secondary)",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13, fontWeight: 500,
    transition: "all 0.2s", textAlign: "left",
    position: "relative",
  },
  roleActive: {
    background: "rgba(232,148,58,0.1)",
    border: "1px solid rgba(232,148,58,0.4)",
    color: "var(--text-primary)",
  },
  roleIcon: { fontSize: 14, color: "#e8943a", width: 18, textAlign: "center" },
  roleLabel: { flex: 1 },
  roleCheck: {
    fontSize: 12, color: "#e8943a", fontWeight: 700,
  },
  error: {
    textAlign: "center", color: "#e05c5c",
    fontSize: 13, marginBottom: 12,
  },
  submitRow: {
    display: "flex", justifyContent: "center",
  },
  submitBtn: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 48px",
    background: "linear-gradient(135deg, #e8943a, #c47820)",
    border: "none", borderRadius: 4,
    color: "#0d0b14", fontFamily: "'Cinzel', serif",
    fontSize: 14, fontWeight: 700, letterSpacing: "0.08em",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(232,148,58,0.2)",
  },
  submitArrow: { fontSize: 18 },
};