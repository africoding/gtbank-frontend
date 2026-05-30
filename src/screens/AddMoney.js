import { useState } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function AddMoney({ setScreen }) {
  const { user, token, updateBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const numAmount = parseFloat(amount || 0);

  const handleFund = async () => {
    if (!amount || numAmount < 100) {
      setError("Minimum amount is ₦100");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/fund-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: numAmount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      // Open Paystack payment page
      window.open(data.payment_url, "_blank");
      setScreen("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={{ backgroundColor: C.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>Add Money</h2>
        <span></span>
      </div>

      <div style={{ padding: "20px" }}>

        {/* Current Balance */}
        <div style={{ ...S.card, textAlign: "center", background: `linear-gradient(135deg, ${C.orange}dd, ${C.darkOrange})` }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", opacity: 0.9 }}>Current Balance</p>
          <h2 style={{ margin: 0, fontSize: "28px" }}>₦{user?.balance?.toLocaleString()}</h2>
        </div>

        {/* Amount Input */}
        <div style={S.card}>
          <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 6px" }}>Enter Amount</p>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
            ₦ {amount || "0"}<span style={{ color: C.gray }}>.00</span>
          </div>
          {numAmount > 0 && numAmount < 100 && (
            <p style={{ color: C.error, fontSize: "12px" }}>⚠️ Minimum funding amount is ₦100</p>
          )}
          <input
            style={S.input}
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
          />

          {/* Quick Amounts */}
          <div style={S.quickGrid}>
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q}
                style={S.quickBtn}
                onClick={() => setAmount(q.toString())}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>💳 Payment Method</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: C.dark, borderRadius: "10px", border: `1px solid ${C.orange}` }}>
            <span style={{ fontSize: "24px" }}>💳</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>Debit Card / Bank Transfer</p>
              <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>Powered by Paystack</p>
            </div>
            <span style={{ marginLeft: "auto", color: C.success }}>✅</span>
          </div>
        </div>

        {/* Test Mode Notice */}
        <div style={{ ...S.card, border: `1px solid ${C.gold}44`, backgroundColor: `${C.gold}11` }}>
          <p style={{ margin: 0, fontSize: "12px", color: C.gold }}>
            🧪 Test Mode Active — Use card: 4084084084084081
          </p>
        </div>

        {error && <div style={S.error}>❌ {error}</div>}

        <button
          style={{ ...S.btn, backgroundColor: loading ? C.gray : C.orange }}
          onClick={handleFund}
          disabled={loading}
        >
          {loading ? "⏳ Initializing payment..." : `Fund Account ₦${numAmount.toLocaleString() || "0"}`}
        </button>

      </div>
    </div>
  );
}
