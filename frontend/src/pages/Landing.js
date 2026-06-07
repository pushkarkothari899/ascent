import { motion } from "framer-motion";

const floatingIslands = [
  { size: 180, x: "8%", y: "15%", delay: 0, opacity: 0.06 },
  { size: 120, x: "82%", y: "10%", delay: 0.3, opacity: 0.05 },
  { size: 90, x: "75%", y: "65%", delay: 0.6, opacity: 0.07 },
  { size: 60, x: "15%", y: "72%", delay: 0.9, opacity: 0.05 },
  { size: 40, x: "50%", y: "8%", delay: 1.2, opacity: 0.04 },
];

export default function Landing({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.97 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={styles.container}
    >
      {/* Atmospheric background */}
      <div style={styles.bgGradient} />
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      {/* Floating island shapes */}
      {floatingIslands.map((island, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: island.delay }}
          style={{
            position: "absolute",
            left: island.x,
            top: island.y,
            width: island.size,
            height: island.size * 0.5,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(232,148,58,${island.opacity * 2}) 0%, rgba(123,107,158,${island.opacity}) 60%, transparent 100%)`,
            filter: "blur(20px)",
          }}
        />
      ))}

      {/* Grid lines */}
      <div style={styles.grid} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={styles.content}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={styles.badge}
        >
          <span style={styles.badgeDot} />
          Skill Gap Analysis Platform
        </motion.div>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={styles.logo}
        >
          ASCENT
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={styles.divider}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          style={styles.tagline}
        >
          Your next role starts here.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={styles.description}
        >
          Paste your profile. Pick your target role. Get a precise skill gap report — 
          no fluff, no guesswork.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(232,148,58,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          style={styles.cta}
        >
          Begin Your Ascent
          <span style={styles.ctaArrow}>↑</span>
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          style={styles.stats}
        >
          {[["6", "Target Roles"], ["AI", "Powered Analysis"], ["Real", "Skill Matching"]].map(([val, label]) => (
            <div key={label} style={styles.stat}>
              <span style={styles.statVal}>{val}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={styles.scrollHint}
      >
        <div style={styles.scrollLine} />
      </motion.div>
    </motion.div>
  );
}

const styles = {
  container: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  bgGradient: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1228 0%, #0d0b14 60%, #0a0810 100%)",
  },
  bgGlow1: {
    position: "absolute", top: "20%", left: "30%",
    width: 600, height: 400,
    background: "radial-gradient(ellipse, rgba(232,148,58,0.06) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  bgGlow2: {
    position: "absolute", bottom: "20%", right: "25%",
    width: 500, height: 350,
    background: "radial-gradient(ellipse, rgba(123,107,158,0.08) 0%, transparent 70%)",
    filter: "blur(40px)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(232,148,58,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,148,58,0.04) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
  },
  content: {
    position: "relative", zIndex: 10,
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", maxWidth: 640, padding: "0 24px",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 16px", borderRadius: 20,
    border: "1px solid rgba(232,148,58,0.25)",
    background: "rgba(232,148,58,0.08)",
    fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#e8943a",
    marginBottom: 32,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#e8943a",
    boxShadow: "0 0 8px rgba(232,148,58,0.8)",
    display: "inline-block",
  },
  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(64px, 10vw, 96px)",
    fontWeight: 900,
    letterSpacing: "0.25em",
    background: "linear-gradient(135deg, #f5b868 0%, #e8943a 40%, #c47820 70%, #f5b868 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
    marginBottom: 16,
    filter: "drop-shadow(0 0 30px rgba(232,148,58,0.3))",
  },
  divider: {
    width: 120, height: 1,
    background: "linear-gradient(90deg, transparent, #e8943a, transparent)",
    marginBottom: 20,
    transformOrigin: "center",
  },
  tagline: {
    fontFamily: "'Cinzel', serif",
    fontSize: 16, fontWeight: 400,
    color: "#9d8ec0", letterSpacing: "0.15em",
    textTransform: "uppercase", marginBottom: 20,
  },
  description: {
    fontSize: 16, lineHeight: 1.8,
    color: "var(--text-secondary)", marginBottom: 40,
    maxWidth: 480,
  },
  cta: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 36px",
    background: "linear-gradient(135deg, #e8943a, #c47820)",
    border: "none", borderRadius: 4,
    color: "#0d0b14", fontFamily: "'Cinzel', serif",
    fontSize: 14, fontWeight: 700, letterSpacing: "0.1em",
    cursor: "pointer", marginBottom: 48,
    boxShadow: "0 0 20px rgba(232,148,58,0.25)",
  },
  ctaArrow: { fontSize: 18 },
  stats: {
    display: "flex", gap: 48,
  },
  stat: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
  },
  statVal: {
    fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
    color: "#e8943a",
  },
  statLabel: {
    fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  scrollHint: {
    position: "absolute", bottom: 32, left: "50%",
    transform: "translateX(-50%)",
  },
  scrollLine: {
    width: 1, height: 40,
    background: "linear-gradient(to bottom, rgba(232,148,58,0.6), transparent)",
  },
};