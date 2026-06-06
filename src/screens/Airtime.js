import { useState } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

const PROVIDERS = [
  { name: "MTN", color: "#FFC300", icon: "🟡" },
  { name: "Airtel", color: "#FF0000", icon: "🔴" },
  { name: "Glo", color: "#009A44", icon: "🟢" },
  { name: "9mobile", color: "#006633", icon: "🟩" }
];

const AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const DATA_PLANS = {
  MTN: [
    { label: "1GB — 7 days", price: 300 },
    { label: "2GB — 30 days", price: 500 },
    { label: "5GB — 30 days", price: 1500 },
    { label: "10GB — 30 days", price: 2500 },
  ],
  Airtel: [
    { label: "1GB — 7 days", price: 300 },
    { label: "2GB — 30 days", price: 500 },
    { label: "5GB — 30 days", price: 1500 },
    { label: "10GB — 30 days", price: 3000 },
  ],
  Glo: [
    { label: "1.5GB — 30 days", price: 300 },
    { label: "3.5GB — 30 days", price: 500 },
    { label: "7.5GB — 30 days", price: 1500 },
    { label: "15GB — 30 days", price: 2500 },
  ],
  "9mobile": [
    { label: "1GB — 30 days", price: 300 },
    { label: "2.5GB — 30 days", price: 500 },
    { label: "5GB — 30 days", price: 1500 },
    { label: "11.5GB — 30 days", price: 2500 },
  ]
};

export default function Airtime({ setScreen }) {
  const { user, updateBalance, getToken } = useAuth();
  const [tab, setTab] = useState("airtime");
  const [provider, setProvider] = useState(null);
  const [phone, setPhone] = useState(user?.phone || "");
  const [amount, setAmount] = useState("");
  const [dataPlan, setDataPlan] = useState(null);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const selectedAmount = tab === "airtime" ? parseFloat(amount || 0) : dataPlan?.price || 0;

  const handlePurchase = async () => {
    if (pin.length !== 4) { setError("Enter your 4-digit PIN"); return; }
    if (selectedAmount > user.balance) { setError("Insufficient balance"); return; }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient: "bills",
          amount: selectedAmount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      updateBalance(user.balance - selectedAmount);
      setResult({
        status: "success",
        message: tab === "airtime"
          ? `₦${selectedAmount} airtime sent to ${phone} (${provider})`
          : `${dataPlan.label} data activated on ${phone} (${provider})`,
        reference: data.reference || "GTB" + Date.now()
      });
      setStep("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("form"); setPin(""); setError(null);
    setAmount(""); setDataPlan(null); setProvider(null);
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "40px" }}>

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={() => step === "pin" ? setStep("form") : setScreen("dashboard")}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>Airtime & Data</h2>
        <span></span>
      </div>

      {/* TAB */}
      <div style={{ display: "flex", backgroundColor: C.dark, padding: "4px 16px", gap: "4px" }}>
        {["airtime", "data"].map(t => (
          <button key={t} onClick={() => { setTab(t); setStep("form"); setError(null); }}
            style={{
              flex: 1, padding: "12px",
              backgroundColor: tab === t ? C.orange : "transparent",
              color: C.white, border: "none", borderRadius: "10px",
              fontWeight: "bold", cursor: "pointer", textTransform: "capitalize"
            }}>
            {t === "airtime" ? "📱 Airtime" : "📶 Data"}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>

        {/* FORM STEP */}
        {step === "form" && (
          <div style={S.card}>

            {/* Provider */}
            <p style={{ margin: "0 0 8px", fontSize: "12px", color: C.gray }}>Select Network</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {PROVIDERS.map(p => (
                <button key={p.name} onClick={() => { setProvider(p.name); setDataPlan(null); }}
                  style={{
                    padding: "10px 4px", borderRadius: "10px", border: "none",
                    backgroundColor: provider === p.name ? `${C.orange}33` : C.dark,
                    outline: provider === p.name ? `2px solid ${C.orange}` : "none",
                    cursor: "pointer", textAlign: "center"
                  }}>
                  <p style={{ margin: "0 0 2px", fontSize: "18px" }}>{p.icon}</p>
                  <p style={{ margin: 0, fontSize: "10px", color: C.white, fontWeight: "bold" }}>{p.name}</p>
                </button>
              ))}
            </div>

            {/* Phone */}
            <p style={{ margin: "0 0 4px", fontSize: "12px", color: C.gray }}>Phone Number</p>
            <input
              style={{ ...S.input, marginBottom: "16px" }}
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              type="tel"
            />

            {/* Airtime amounts */}
            {tab === "airtime" && (
              <>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: C.gray }}>Select Amount</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {AIRTIME_AMOUNTS.map(a => (
                    <button key={a} onClick={() => setAmount(a.toString())}
                      style={{
                        padding: "10px", borderRadius: "10px", border: "none",
                        backgroundColor: amount === a.toString() ? C.orange : C.dark,
                        color: C.white, cursor: "pointer", fontWeight: "bold", fontSize: "13px"
                      }}>
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <p style={{ margin: "0 0 4px", fontSize: "12px", color: C.gray }}>Or enter custom amount</p>
                <input
                  style={S.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  type="number"
                />
              </>
            )}

            {/* Data plans */}
            {tab === "data" && provider && (
              <>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: C.gray }}>Select Data Plan</p>
                {DATA_PLANS[provider].map(plan => (
                  <button key={plan.label} onClick={() => setDataPlan(plan)}
                    style={{
                      width: "100%", padding: "14px", borderRadius: "10px",
                      border: "none", marginBottom: "8px",
                      backgroundColor: dataPlan?.label === plan.label ? `${C.orange}33` : C.dark,
                      outline: dataPlan?.label === plan.label ? `2px solid ${C.orange}` : "none",
                      cursor: "pointer", display: "flex", justifyContent: "space-between",
                      alignItems: "center", color: C.white
                    }}>
                    <span style={{ fontSize: "13px" }}>{plan.label}</span>
                    <span style={{ fontWeight: "bold", color: C.orange }}>₦{plan.price.toLocaleString()}</span>
                  </button>
                ))}
              </>
            )}

            {tab === "data" && !provider && (
              <p style={{ color: C.gray, fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                👆 Select a network to see data plans
              </p>
            )}

            {error && <div style={S.error}>{error}</div>}

            <button
              style={{
                ...S.btn, marginTop: "12px",
                backgroundColor: (provider && phone.length === 11 && selectedAmount >= 50) ? C.orange : C.gray
              }}
              onClick={() => {
                if (!provider) { setError("Select a network"); return; }
                if (phone.length !== 11) { setError("Enter a valid 11-digit phone number"); return; }
                if (selectedAmount < 50) { setError("Minimum amount is ₦50"); return; }
                if (selectedAmount > user.balance) { setError("Insufficient balance"); return; }
                setError(null); setStep("pin");
              }}>
              Continue
            </button>
          </div>
        )}

        {/* PIN STEP */}
        {step === "pin" && (
          <div style={S.card}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p style={{ color: C.gray }}>
                {tab === "airtime" ? "Buying airtime" : "Buying data plan"}
              </p>
              <h2 style={{ color: C.orange, margin: "4px 0", fontSize: "32px" }}>
                ₦{selectedAmount.toLocaleString()}
              </h2>
              <p style={{ color: C.gray, fontSize: "13px" }}>
                {tab === "airtime" ? `Airtime` : dataPlan?.label} → {phone} ({provider})
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "24px 0" }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={S.pinDot(i < pin.length)} />
              ))}
            </div>

            {error && <div style={S.error}>{error}</div>}

            <div style={S.numpad}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} style={S.numKey}
                  onClick={() => pin.length < 4 && setPin(pin + n)}>{n}</button>
              ))}
              <div></div>
              <button style={S.numKey} onClick={() => pin.length < 4 && setPin(pin + "0")}>0</button>
              <button style={S.numKey} onClick={() => setPin(pin.slice(0, -1))}>⌫</button>
            </div>

            <button
              style={{
                ...S.btn, marginTop: "20px",
                backgroundColor: loading ? C.gray : pin.length === 4 ? C.orange : C.gray
              }}
              onClick={handlePurchase}
              disabled={loading || pin.length !== 4}>
              {loading ? "⏳ Processing..." : "Confirm Purchase"}
            </button>
          </div>
        )}

        {/* RESULT STEP */}
        {step === "result" && result && (
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <div style={{ fontSize: "80px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: C.success }}>Purchase Successful!</h2>
            <p style={{ color: C.gray }}>{result.message}</p>
            <div style={{ ...S.card, backgroundColor: "#064e1b", textAlign: "center" }}>
              <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 4px" }}>Reference</p>
              <p style={{ color: C.success, fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                {result.reference}
              </p>
            </div>
            <button style={{ ...S.btn, marginTop: "16px" }} onClick={reset}>Buy Again</button>
            <button style={{ ...S.btn, marginTop: "8px", backgroundColor: C.dark }}
              onClick={() => setScreen("dashboard")}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}