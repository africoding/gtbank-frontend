import { useState } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function Auth({ setScreen }) {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [authPin, setAuthPin] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const endpoint = authMode === "register" ? "/register" : "/login";
      const body = authMode === "register"
        ? { full_name: fullName, phone, pin: authPin }
        : { phone, pin: authPin };
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      login(data.user, data.access_token);
      setScreen("dashboard");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`, padding: "50px 20px 30px", textAlign: "center" }}>
        <div style={{ fontSize: "50px", marginBottom: "12px" }}>🏦</div>
        <h2 style={{ margin: "0 0 4px", fontSize: "24px" }}>GTBank Trust Engine</h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.8, letterSpacing: "2px" }}>SELLING CERTAINTY TO UNCERTAINTY</p>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <div style={{ display: "flex", backgroundColor: C.dark, borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
          {["login", "register"].map(mode => (
            <button key={mode} onClick={() => setAuthMode(mode)} style={{ flex: 1, padding: "12px", backgroundColor: authMode === mode ? C.orange : "transparent", color: C.white, border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", textTransform: "capitalize" }}>
              {mode === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div style={S.card}>
          {authMode === "register" && (
            <input style={S.input} placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
          )}
          <input style={S.input} placeholder="Phone Number (08012345678)" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
          <input style={S.input} placeholder="4-digit PIN" value={authPin} onChange={e => setAuthPin(e.target.value.slice(0, 4))} type="password" maxLength={4} />
          {authError && <div style={S.error}>❌ {authError}</div>}
          <button style={{ ...S.btn, backgroundColor: authLoading ? C.gray : C.orange }} onClick={handleAuth} disabled={authLoading}>
            {authLoading ? "⏳ Please wait..." : authMode === "register" ? "Create Account" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
