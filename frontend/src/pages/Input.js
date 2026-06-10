import { useState, useRef } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

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
  const [mode, setMode] = useState("text"); // "text" or "pdf"
  const [pdfStatus, setPdfStatus] = useState(""); // "uploading", "done", "error"
  const [pdfName, setPdfName] = useState("");
  const fileRef = useRef();

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setPdfStatus("error");
      return;
    }
    setPdfName(file.name);
    setPdfStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/extract-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setPdfStatus("error");
        setError(data.error);
      } else {
        setText(data.text);
        setPdfStatus("done");
        setError("");
      }
    } catch {
      setPdfStatus("error");
      setError("Failed to connect to backend.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handlePdfUpload(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) return setError("Tell us about your skills and experience.");
    if (!role) return setError("Select a target role.");
    setError("");
    onAnalyze(text, role);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={styles.inner}
      >
        {/* Header */}
        <div style={styles.header}>
          <m.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} style={styles.headerLine} />
          <h1 style={styles.logo}>ASCENT</h1>
          <m.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} style={styles.headerLine} />
        </div>
        <p style={styles.step}>Step 01 — Profile Input</p>

        <div style={styles.columns}>
          {/* Left col */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={styles.leftCol}
          >
            {/* Mode toggle */}
            <div style={styles.modeToggle}>
              {["text", "pdf"].map((m_) => (
                <button
                  key={m_}
                  onClick={() => { setMode(m_); setError(""); }}
                  style={{ ...styles.modeBtn, ...(mode === m_ ? styles.modeBtnActive : {}) }}
                >
                  {m_ === "text" ? "✏ Paste Text" : "📄 Upload Resume"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "text" ? (
                <m.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <label style={styles.label}>
                    Your Profile
                    <span style={styles.labelHint}>Resume, bio, or skills description</span>
                  </label>
                  <div style={styles.textareaWrapper}>
                    <textarea
                      style={styles.textarea}
                      placeholder="I have experience with Python, FastAPI, Docker, SQL, scikit-learn and XGBoost for ML tasks. I've deployed models on AWS and worked with transformer models for NLP..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                    />
                    <div style={styles.charCount}>
                      <span style={{ color: text.length > 100 ? "#4CAF82" : "var(--text-muted)" }}>
                        {text.length}
                      </span> characters
                    </div>
                  </div>
                </m.div>
              ) : (
                <m.div
                  key="pdf"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <label style={styles.label}>
                    Resume PDF
                    <span style={styles.labelHint}>Text-based PDFs only</span>
                  </label>

                  {/* Drop zone */}
                  <div
                    style={{
                      ...styles.dropZone,
                      ...(pdfStatus === "done" ? styles.dropZoneDone : {}),
                      ...(pdfStatus === "error" ? styles.dropZoneError : {}),
                    }}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileRef.current.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={e => handlePdfUpload(e.target.files[0])}
                    />
                    {pdfStatus === "" && (
                      <>
                        <span style={styles.dropIcon}>⬆</span>
                        <p style={styles.dropText}>Drag & drop your resume PDF</p>
                        <p style={styles.dropHint}>or click to browse</p>
                      </>
                    )}
                    {pdfStatus === "uploading" && (
                      <m.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <span style={{ fontSize: 28, color: "#e8943a" }}>⟳</span>
                      </m.div>
                    )}
                    {pdfStatus === "done" && (
                      <>
                        <span style={{ fontSize: 28, color: "#4CAF82" }}>✓</span>
                        <p style={{ ...styles.dropText, color: "#4CAF82" }}>{pdfName}</p>
                        <p style={styles.dropHint}>Text extracted successfully</p>
                      </>
                    )}
                    {pdfStatus === "error" && (
                      <>
                        <span style={{ fontSize: 28, color: "#e05c5c" }}>✗</span>
                        <p style={{ ...styles.dropText, color: "#e05c5c" }}>Upload failed</p>
                        <p style={styles.dropHint}>Click to try again</p>
                      </>
                    )}
                  </div>

                  {/* Preview extracted text */}
                  {pdfStatus === "done" && text && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.extractedPreview}
                    >
                      <p style={styles.previewLabel}>Extracted text preview — you can edit if needed:</p>
                      <textarea
                        style={{ ...styles.textarea, height: 100, fontSize: 12 }}
                        value={text}
                        onChange={e => setText(e.target.value)}
                      />
                    </m.div>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </m.div>

          {/* Right col — role selector */}
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
                  style={{ ...styles.roleBtn, ...(role === r.slug ? styles.roleActive : {}) }}
                >
                  <span style={styles.roleIcon}>{r.icon}</span>
                  <span style={styles.roleLabel}>{r.label}</span>
                  {role === r.slug && <span style={styles.roleCheck}>✓</span>}
                </m.button>
              ))}
            </div>
          </m.div>
        </div>

        {error && (
          <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.error}>
            ⚠ {error}
          </m.p>
        )}

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
    background: "var(--bg-deep)", overflow: "auto", padding: "24px",
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
    display: "flex", alignItems: "center", gap: 20, marginBottom: 4,
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
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20,
  },
  leftCol: { display: "flex", flexDirection: "column" },
  rightCol: { display: "flex", flexDirection: "column" },
  modeToggle: {
    display: "flex", background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 6, padding: 4, marginBottom: 16, gap: 4,
  },
  modeBtn: {
    flex: 1, padding: "8px 0",
    background: "transparent", border: "none",
    color: "var(--text-muted)", fontSize: 12, fontWeight: 500,
    cursor: "pointer", borderRadius: 4,
    fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s",
  },
  modeBtnActive: {
    background: "rgba(232,148,58,0.15)",
    color: "#e8943a",
  },
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
    width: "100%", height: 260,
    padding: "16px", resize: "none",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text-primary)",
    fontSize: 14, lineHeight: 1.7,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
  },
  charCount: {
    position: "absolute", bottom: 10, right: 12,
    fontSize: 11, color: "var(--text-muted)",
  },
  dropZone: {
    flex: 1, minHeight: 200,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 8,
    background: "var(--bg-card)",
    border: "1px dashed rgba(232,148,58,0.3)",
    borderRadius: 6, cursor: "pointer",
    transition: "all 0.2s",
    padding: 24,
  },
  dropZoneDone: {
    border: "1px dashed rgba(76,207,130,0.4)",
    background: "rgba(76,207,130,0.05)",
  },
  dropZoneError: {
    border: "1px dashed rgba(224,92,92,0.4)",
    background: "rgba(224,92,92,0.05)",
  },
  dropIcon: { fontSize: 28, color: "#e8943a" },
  dropText: { fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 },
  dropHint: { fontSize: 12, color: "var(--text-muted)" },
  extractedPreview: {
    marginTop: 12,
  },
  previewLabel: {
    fontSize: 11, color: "var(--text-muted)", marginBottom: 6,
    letterSpacing: "0.05em",
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
  roleCheck: { fontSize: 12, color: "#e8943a", fontWeight: 700 },
  error: {
    textAlign: "center", color: "#e05c5c",
    fontSize: 13, marginBottom: 12,
  },
  submitRow: { display: "flex", justifyContent: "center" },
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