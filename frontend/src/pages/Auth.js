import { useState, motion } from "react";
import { motion as m } from "framer-motion";

export default function Auth({ onNext }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={styles.card}
      >
        {/* Header */}
        <div style={styles.cardHeader}>
          <h1 style={styles.logo}>ASCENT</h1>
          <p style={styles.subtitle}>
            {mode === "login" ? "Welcome back, climber." : "Begin your journey."}
          </p>
        </div>

        {/* Toggle */}
        <div style={styles.toggle}>
          {["login", "signup"].map((m_) => (
            <button
              key={m_}
              onClick={() => setMode(m_)}
              style={{ ...styles.toggleBtn, ...(mode === m_ ? styles.toggleActive : {}) }}
            >
              {m_ === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "signup" && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={styles.field}
            >
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Pushkar Kothari"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </m.div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <m.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(232,148,58,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={styles.submitBtn}
          >
            {mode === "login" ? "Enter the Arena" : "Start Climbing"}
          </m.button>
        </form>

        <p style={styles.note}>
          {mode === "login" ? "No account? " : "Already climbing? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={styles.switchBtn}
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>

        {/* Mock note */}
        <div style={styles.mockNote}>
          <span style={styles.mockDot}>◆</span>
          Auth is mocked — any input continues
        </div>
      </m.div>
    </m.div>
  );
}

const styles = {
  container: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--bg-deep)",
  },
  bgGlow1: {
    position: "absolute", top: "10%", right: "20%",
    width: 500, height: 400,
    background: "radial-gradient(ellipse, rgba(232,148,58,0.06) 0%, transparent 70%)",
    filter: "blur(60px)",
  },
  bgGlow2: {
    position: "absolute", bottom: "15%", left: "15%",
    width: 400, height: 300,
    background: "radial-gradient(ellipse, rgba(123,107,158,0.08) 0%, transparent 70%)",
    filter: "blur(50px)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(232,148,58,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,148,58,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
  },
  card: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 440,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 8, padding: "40px 36px",
    boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,148,58,0.05)",
  },
  cardHeader: {
    textAlign: "center", marginBottom: 28,
  },
  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: 32, fontWeight: 900, letterSpacing: "0.3em",
    background: "linear-gradient(135deg, #f5b868, #e8943a, #c47820)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, color: "var(--text-secondary)", fontStyle: "italic",
  },
  toggle: {
    display: "flex", background: "var(--bg-elevated)",
    borderRadius: 6, padding: 4, marginBottom: 28,
  },
  toggleBtn: {
    flex: 1, padding: "8px 0",
    background: "transparent", border: "none",
    color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
    cursor: "pointer", borderRadius: 4,
    fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s",
  },
  toggleActive: {
    background: "rgba(232,148,58,0.15)",
    color: "#e8943a",
  },
  form: {
    display: "flex", flexDirection: "column", gap: 18,
    marginBottom: 20,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12, fontWeight: 500, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "var(--text-secondary)",
  },
  input: {
    padding: "12px 14px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 4, color: "var(--text-primary)",
    fontSize: 14, fontFamily: "'Outfit', sans-serif",
    outline: "none", transition: "border-color 0.2s",
  },
  submitBtn: {
    padding: "13px",
    background: "linear-gradient(135deg, #e8943a, #c47820)",
    border: "none", borderRadius: 4,
    color: "#0d0b14", fontFamily: "'Cinzel', serif",
    fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
    cursor: "pointer", marginTop: 4,
  },
  note: {
    textAlign: "center", fontSize: 13,
    color: "var(--text-muted)", marginBottom: 16,
  },
  switchBtn: {
    background: "none", border: "none",
    color: "#e8943a", cursor: "pointer",
    fontSize: 13, fontFamily: "'Outfit', sans-serif",
    textDecoration: "underline",
  },
  mockNote: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontSize: 11, color: "var(--text-muted)",
    borderTop: "1px solid var(--border)", paddingTop: 16,
  },
  mockDot: { color: "var(--purple)", fontSize: 8 },
};