import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C, BANKS, QUICK_AMOUNTS } from "../constants";
import { S } from "../styles";

async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

function LookingForAccount() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: C.navy, display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <div style={{ position: "relative", width: "220px", height: "220px" }}>
        <svg width="220" height="220" style={{
          position: "absolute", top: 0, left: 0,
          animation: "spin 1.5s linear infinite"
        }}>
          <circle cx="110" cy="110" r="100" fill="none"
            stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <circle cx="110" cy="110" r="100" fill="none"
            stroke={C.gold} strokeWidth="3"
            strokeDasharray="60 570" strokeLinecap="round" />
        </svg>
        <svg width="220" height="220" style={{ position: "absolute", top: 0, left: 0 }}>
          <circle cx="110" cy="110" r="80" fill="none"
            stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </svg>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", textAlign: "center"
        }}>
          <p style={{
            color: C.white, fontWeight: "bold",
            fontSize: "16px", margin: 0, letterSpacing: "1px"
          }}>LOOKING<br />FOR ACCOUNT</p>
        </div>
      </div>
      <style>{`@keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }`}</style>
    </div>
  );
}

export default function Transfer({ setScreen }) {
  const { user, token, updateBalance, getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [lookingForAccount, setLookingForAccount] = useState(false);
  const [foundAccount, setFoundAccount] = useState(null);
  const [accountError, setAccountError] = useState(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const numAmount = parseFloat(amount || 0);
  const fee = numAmount === 0 ? 0
    : numAmount < 5000 ? 0
    : numAmount <= 50000 ? 10 : 50;
  const total = numAmount + fee;

  // Auto lookup when 10 digits entered
  useEffect(() => {
    if (accountNumber.length === 10) {
      lookupAccount(accountNumber);
    } else {
      setFoundAccount(null);
      setAccountError(null);
    }
  }, [accountNumber]);

  const lookupAccount = async (number) => {
    setLookingForAccount(true);
    setFoundAccount(null);
    setAccountError(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const res = await fetch(`${API}/account/lookup/${number}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setFoundAccount(data);
    } catch (err) {
      setAccountError("Account not found. Please check the number.");
    } finally {
      setLookingForAccount(false);
    }
  };

  const handleTransfer = async () => {
    if (pin.length !== 4) { setError("Enter your 4-digit PIN"); return; }
    setLoading(true);
    setError(null);
    try {
      await hashPIN(pin);
      const currentToken = await getToken();
      const res = await fetch(`${API}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          recipient: accountNumber,
          amount: numAmount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setResult(data);
      setStep(4);
      if (data.status === "success") {
        updateBalance(user.balance - numAmount);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); setAccountNumber(""); setRecipientBank("");
    setFoundAccount(null); setAmount(""); setNotes("");
    setPin(""); setResult(null); setError(null);
    setScreen("dashboard");
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "20px" }}>
      {lookingForAccount && <LookingForAccount />}

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={() => step === 1 ? setScreen("dashboard") : setStep(step - 1)}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>
          {step === 1 && "Transfer To Bank Account"}
          {step === 2 && "Enter Amount"}
          {step === 3 && "Confirm PIN"}
          {step === 4 && "Transfer Result"}
        </h2>
        <span style={{ color: C.gold, fontSize: "12px" }}>
          {step < 4 ? `${step}/3` : ""}
        </span>
      </div>

      <div style={{ padding: "20px" }}>

        {/* STEP 1 - Account Number */}
        {step === 1 && (
          <>
            <div style={{
              backgroundColor: C.dark, borderRadius: "12px",
              padding: "12px 16px", marginBottom: "16px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <span>⚡</span>
              <span style={{ fontSize: "13px" }}>
                Free transfers today:
                <strong style={{ color: C.success }}> 3</strong>
              </span>
            </div>

            <div style={S.card}>
              <h3 style={{ margin: "0 0 16px", color: C.orange }}>
                Recipient Account
              </h3>

              <label style={{
                color: C.gray, fontSize: "12px",
                display: "block", marginBottom: "4px"
              }}>
                Account Number
              </label>
              <input
                style={S.input}
                placeholder="Enter 10-digit Account Number"
                value={accountNumber}
                onChange={e => setAccountNumber(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )}
                type="tel"
                maxLength={10}
              />

              {/* Account Found Badge */}
              {foundAccount && (
                <div style={{
                  backgroundColor: `${C.success}22`,
                  border: `1px solid ${C.success}`,
                  borderRadius: "12px", padding: "16px",
                  marginBottom: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      backgroundColor: C.orange,
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold", fontSize: "18px"
                    }}>
                      {foundAccount.account_name?.[0]}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: "bold", color: C.white, fontSize: "16px" }}>
                        {foundAccount.account_name?.toUpperCase()}
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: "12px", color: C.gray }}>
                        {foundAccount.bank}
                      </p>
                      <p style={{ margin: 0, fontSize: "11px", color: C.success }}>
                        ✅ Verified Account
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <label style={{
                color: C.gray, fontSize: "12px",
                display: "block", marginBottom: "4px"
              }}>
                Recipient Bank
              </label>
              <select
                style={S.select}
                value={recipientBank}
                onChange={e => setRecipientBank(e.target.value)}>
                <option value="">Select Bank ›</option>
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              {accountError && <div style={S.error}>❌ {accountError}</div>}

              <button
                style={{
                  ...S.btn,
                  backgroundColor: foundAccount ? C.orange : C.gray
                }}
                onClick={() => { if (!foundAccount) return; setStep(2); }}
                disabled={!foundAccount}>
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 2 - Amount */}
        {step === 2 && (
          <>
            <div style={S.card}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: "10px", marginBottom: "16px"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  backgroundColor: C.orange,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: "bold"
                }}>
                  {foundAccount?.account_name?.[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {foundAccount?.account_name?.toUpperCase()}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>
                    {accountNumber} • {recipientBank || foundAccount?.bank}
                  </p>
                </div>
              </div>

              <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 6px" }}>Amount</p>
              <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "4px" }}>
                ₦ {amount || "0"}<span style={{ color: C.gray }}>.00</span>
              </div>

              {numAmount > 0 && numAmount < 10 && (
                <p style={{ color: C.error, fontSize: "12px" }}>
                  ⚠️ Minimum transfer is ₦10
                </p>
              )}

              <input
                style={S.input}
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
              />

              <div style={S.quickGrid}>
                {QUICK_AMOUNTS.map(q => (
                  <button key={q} style={S.quickBtn}
                    onClick={() => setAmount(q.toString())}>
                    ₦{q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 8px" }}>
                Remark (Optional)
              </p>
              <input
                style={S.input}
                placeholder="What's this for?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ ...S.quickBtn, flex: 1 }}
                  onClick={() => setNotes("Purchase")}>Purchase</button>
                <button style={{ ...S.quickBtn, flex: 1 }}
                  onClick={() => setNotes("Personal")}>Personal</button>
              </div>
            </div>

            {numAmount >= 10 && (
              <div style={S.card}>
                <div style={S.feeRow}>
                  <span style={{ color: C.gray }}>Amount</span>
                  <span>₦{numAmount.toLocaleString()}</span>
                </div>
                <div style={S.feeRow}>
                  <span style={{ color: C.gray }}>Fee</span>
                  <span style={{ color: fee === 0 ? C.success : C.white }}>
                    {fee === 0 ? "Free" : `₦${fee}`}
                  </span>
                </div>
                <div style={{
                  ...S.feeRow, borderBottom: "none",
                  fontWeight: "bold", fontSize: "16px"
                }}>
                  <span>Total</span>
                  <span style={{ color: C.orange }}>
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {error && <div style={S.error}>{error}</div>}

            <button style={S.btn} onClick={() => {
              if (!amount || numAmount < 10) {
                setError("Minimum transfer is ₦10"); return;
              }
              if (numAmount > 5000000) {
                setError("Maximum transfer is ₦5,000,000"); return;
              }
              if (numAmount > user.balance) {
                setError("Insufficient balance"); return;
              }
              setError(null); setStep(3);
            }}>
              Continue
            </button>
          </>
        )}

        {/* STEP 3 - PIN */}
        {step === 3 && (
          <div style={S.card}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p style={{ color: C.gray }}>Confirm transfer of</p>
              <h2 style={{ color: C.orange, margin: "4px 0", fontSize: "32px" }}>
                ₦{numAmount.toLocaleString()}
              </h2>
              <p style={{ color: C.gray, fontSize: "13px" }}>
                to {foundAccount?.account_name?.toUpperCase()}
              </p>
              <p style={{ color: C.gray, fontSize: "12px" }}>
                {accountNumber} • {recipientBank || foundAccount?.bank}
              </p>
            </div>

            <div style={{
              display: "flex", justifyContent: "center",
              gap: "16px", margin: "30px 0"
            }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={S.pinDot(i < pin.length)} />
              ))}
            </div>

            {error && <div style={S.error}>{error}</div>}

            <div style={S.numpad}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} style={S.numKey}
                  onClick={() => pin.length < 4 && setPin(pin + n)}>
                  {n}
                </button>
              ))}
              <div></div>
              <button style={S.numKey}
                onClick={() => pin.length < 4 && setPin(pin + "0")}>
                0
              </button>
              <button style={S.numKey}
                onClick={() => setPin(pin.slice(0, -1))}>
                ⌫
              </button>
            </div>

            <button
              style={{
                ...S.btn, marginTop: "20px",
                backgroundColor: loading ? C.gray
                  : pin.length === 4 ? C.orange : C.gray
              }}
              onClick={handleTransfer}
              disabled={loading || pin.length !== 4}>
              {loading ? "⏳ Processing your transfer..." : "Confirm Transfer"}
            </button>
          </div>
        )}

        {/* STEP 4 - Result */}
        {step === 4 && result && (
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <div style={{ fontSize: "80px", marginBottom: "16px" }}>
              {result.status === "success" ? "✅"
                : result.status === "failed" ? "❌"
                : result.status === "reversed" ? "↩️" : "⏳"}
            </div>
            <h2 style={{
              color: result.status === "success" ? C.success
                : result.status === "failed" ? C.error : C.gold
            }}>
              {result.status === "success" ? "Transfer Successful!"
                : result.status === "failed" ? "Transfer Failed"
                : result.status === "reversed" ? "Transfer Reversed"
                : "Transfer Pending"}
            </h2>
            <p style={{ color: C.gray }}>{result.message}</p>

            <div style={{
              ...S.card, backgroundColor: "#064e1b", textAlign: "center"
            }}>
              <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 4px" }}>
                Reference Number
              </p>
              <p style={{
                color: C.success, fontWeight: "bold",
                fontSize: "18px", margin: 0
              }}>
                {result.reference}
              </p>
            </div>

            <div style={S.card}>
              {[
                ["Amount", `₦${numAmount.toLocaleString()}`],
                ["To", foundAccount?.account_name?.toUpperCase()],
                ["Account", accountNumber],
                ["Bank", recipientBank || foundAccount?.bank],
                ["Status", result.status]
              ].map(([label, value]) => (
                <div key={label} style={S.feeRow}>
                  <span style={{ color: C.gray }}>{label}</span>
                  <span style={{
                    color: label === "Status"
                      ? (result.status === "success" ? C.success : C.gold)
                      : C.white
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button style={S.btn} onClick={reset}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
