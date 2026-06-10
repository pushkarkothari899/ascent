import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Input from "./pages/Input";
import Evaluating from "./pages/Evaluating";
import Output from "./pages/Output";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("landing");
  const [result, setResult] = useState(null);
  const [inputData, setInputData] = useState({ text: "", role: "" });
  const [session, setSession] = useState(null);

  const navigate = (to) => setPage(to);

  // After login: check if user has history, route accordingly
  const handleAuthSuccess = async (sess) => {
    setSession(sess);
    try {
      const res = await fetch("http://127.0.0.1:8000/history", {
        headers: { "Authorization": `Bearer ${sess.access_token}` },
      });
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        navigate("dashboard");
      } else {
        navigate("input");
      }
    } catch {
      navigate("input");
    }
  };

  const handleAnalyze = async (text, role) => {
    setInputData({ text, role });
    navigate("evaluating");
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role }),
      });
      const data = await res.json();
      setResult(data);
      setTimeout(() => navigate("output"), 500);
    } catch (err) {
      console.error(err);
      navigate("input");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {page === "landing" && (
        <Landing key="landing" onNext={() => navigate("auth")} />
      )}
      {page === "auth" && (
        <Auth key="auth" onNext={handleAuthSuccess} />
      )}
      {page === "dashboard" && (
        <Dashboard
          key="dashboard"
          session={session}
          onNewAnalysis={() => navigate("input")}
        />
      )}
      {page === "input" && (
        <Input key="input" onAnalyze={handleAnalyze} />
      )}
      {page === "evaluating" && (
        <Evaluating key="evaluating" role={inputData.role} />
      )}
      {page === "output" && (
        <Output
          key="output"
          result={result}
          session={session}
          onReset={() => navigate("input")}
          onViewHistory={() => navigate("dashboard")}
        />
      )}
    </AnimatePresence>
  );
}