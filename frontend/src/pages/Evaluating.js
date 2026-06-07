import { useEffect, useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

const ROLE_LABELS = {
  ml_engineer: "ML Engineer",
  data_scientist: "Data Scientist",
  full_stack_developer: "Full Stack Developer",
  backend_developer: "Backend Developer",
  mlops_engineer: "MLOps Engineer",
  forward_deployed_engineer: "Forward Deployed Engineer",
};

const STEPS = [
  "Parsing your profile...",
  "Extracting skills with NLP...",
  "Running semantic matching...",
  "Comparing against role requirements...",
  "Generating gap analysis...",
];

export default function Evaluating({ role }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
    }, 3000);
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 1, 95));
    }, 150);
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={styles.container}
    >
      <div style={styles.bgGlow} />
      <div style={styles.grid} />

      {/* Orbiting rings */}
      <div style={styles.orbitWrapper}>
        {[1, 2, 3].map((i) => (
          <m.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
            style={{
              ...styles.orbit,
              width: 80 + i * 60,
              height: 80 + i * 60,
              borderColor: `rgba(232,148,58,${0.15 - i * 0.04})`,
            }}
          />
        ))}
        {/* Center */}
        <m.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={styles.center}
        >
          <span style={styles.centerIcon}>◆</span>
        </m.div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <m.p style={styles.label}>
          Analyzing for
        </m.p>
        <m.h2 style={styles.roleName}>
          {ROLE_LABELS[role] || role}
        </m.h2>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <m.div
            style={styles.progressFill}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p style={styles.progressNum}>{progress}%</p>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <m.p
            key={stepIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            style={styles.step}
          >
            {STEPS[stepIdx]}
          </m.p>
        </AnimatePresence>

        {/* Step dots */}
        <div style={styles.dots}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                background: i <= stepIdx ? "#e8943a" : "var(--text-muted)",
                boxShadow: i === stepIdx ? "0 0 8px rgba(232,148,58,0.8)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </m.div>
  );
}

const styles = {
  container: {
    position: "fixed", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "var(--bg-deep)", gap: 48,
  },
  bgGlow: {
    position: "absolute", top: "30%", left: "40%",
    width: 600, height: 500,
    background: "radial-gradient(ellipse, rgba(232,148,58,0.07) 0%, transparent 70%)",
    filter: "blur(60px)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(232,148,58,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,148,58,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
  },
  orbitWrapper: {
    position: "relative", width: 260, height: 260,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  orbit: {
    position: "absolute",
    border: "1px solid",
    borderRadius: "50%",
  },
  center: {
    width: 60, height: 60,
    background: "radial-gradient(circle, rgba(232,148,58,0.2), rgba(232,148,58,0.05))",
    border: "1px solid rgba(232,148,58,0.5)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 30px rgba(232,148,58,0.3)",
  },
  centerIcon: { fontSize: 20, color: "#e8943a" },
  content: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, zIndex: 10,
  },
  label: {
    fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  roleName: {
    fontFamily: "'Cinzel', serif",
    fontSize: 28, fontWeight: 700,
    color: "var(--text-primary)", marginBottom: 12,
  },
  progressTrack: {
    width: 320, height: 3,
    background: "rgba(232,148,58,0.1)",
    borderRadius: 2, overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #c47820, #e8943a, #f5b868)",
    borderRadius: 2,
  },
  progressNum: {
    fontSize: 12, color: "#e8943a", fontWeight: 600,
  },
  step: {
    fontSize: 14, color: "var(--text-secondary)",
    fontStyle: "italic", height: 20,
  },
  dots: {
    display: "flex", gap: 8, marginTop: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    transition: "all 0.3s",
  },
};