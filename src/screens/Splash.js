import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";

export default function Splash({ setScreen }) {
  const { ready, token } = useAuth();

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      if (token) {
        setScreen("dashboard");
      } else {
        setScreen("auth");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [ready, token]);

  return (
    <div style={{ backgroundColor: C.navy, minHeight: "100vh", maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", color: C.white }}>
      <div style={{ width: "120px", height: "120px", backgroundColor: C.orange, borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px", boxShadow: `0 0 40px ${C.orange}44` }}>
        <span style={{ fontSize: "55px" }}>🏦</span>
      </div>
      <h1 style={{ color: C.orange, fontSize: "32px", margin: "0 0 4px", fontWeight: "900" }}>GTBank</h1>
      <p style={{ color: C.gold, fontSize: "14px", margin: "0 0 60px", letterSpacing: "3px" }}>TRUST ENGINE</p>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Your money is safe</p>
      <div style={{ marginTop: "30px", display: "flex", gap: "8px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i === 0 ? C.orange : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
    </div>
  );
}
