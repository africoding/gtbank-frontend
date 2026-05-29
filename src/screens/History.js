import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function History({ setScreen }) {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTransactions(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>
      <div style={{ backgroundColor: C.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>Transaction History</h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: C.gray }}>⏳ Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "50px", margin: "0 0 16px" }}>📭</p>
            <p style={{ color: C.gray }}>No transactions yet</p>
            <button style={{ ...S.btn, marginTop: "16px" }} onClick={() => setScreen("transfer")}>Make Your First Transfer</button>
          </div>
        ) : transactions.map(t => (
          <div key={t.transaction_id} style={{ ...S.card, marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: t.status === "success" ? `${C.success}22` : `${C.error}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  {t.status === "success" ? "✅" : t.status === "failed" ? "❌" : "↩️"}
                </div>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: "bold", fontSize: "14px" }}>To: {t.recipient}</p>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: C.gray }}>{t.reference}</p>
                  <p style={{ margin: 0, fontSize: "10px", color: C.gray }}>{new Date(t.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 4px", fontWeight: "bold", color: C.error }}>-₦{t.amount?.toLocaleString()}</p>
                <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "10px", backgroundColor: t.status === "success" ? "#064e1b" : t.status === "failed" ? "#2d0a0a" : "#1a2a0a", color: t.status === "success" ? C.success : t.status === "failed" ? C.error : C.gold }}>
                  {t.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.bottomNav}>
        {[
          { icon: "🏠", label: "Home", sc: "dashboard" },
          { icon: "🎁", label: "Rewards", sc: "rewards" },
          { icon: "📈", label: "Finance", sc: "finance" },
          { icon: "💳", label: "Cards", sc: "cards" },
          { icon: "👤", label: "Me", sc: "profile" }
        ].map(item => (
          <button key={item.label} style={S.navBtn(item.sc === "history")} onClick={() => setScreen(item.sc)}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
