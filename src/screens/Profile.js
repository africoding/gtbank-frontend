import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function Profile({ setScreen }) {
  const { user, logout } = useAuth();
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState(null);

  const handleLogout = () => {
    logout();
    setScreen("auth");
  };

  const handlePinChange = () => {
    if (newPin.length !== 4) {
      setPinMsg({ type: "error", text: "PIN must be 4 digits" });
      return;
    }
    setPinMsg({ type: "success", text: "PIN changed successfully!" });
    setNewPin("");
    setTimeout(() => {
      setShowPinChange(false);
      setPinMsg(null);
    }, 2000);
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "20px" }}>

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button onClick={() => setScreen("dashboard")} style={{
          background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer"
        }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>My Profile</h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>

        {/* PROFILE CARD */}
        <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            backgroundColor: C.orange,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "32px", fontWeight: "bold"
          }}>
            {user?.full_name?.[0]}
          </div>
          <h2 style={{ margin: "0 0 4px" }}>{user?.full_name?.toUpperCase()}</h2>
          <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>{user?.phone}</p>
          <p style={{ margin: "0 0 12px", color: C.gray, fontSize: "13px" }}>
            Account: {user?.phone}
          </p>
          <span style={{
            backgroundColor: `${C.gold}22`, color: C.gold,
            padding: "4px 16px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "bold"
          }}>
            {user?.kyc_tier?.toUpperCase()} • Verified
          </span>
        </div>

        {/* UPGRADE */}
        <div style={{ ...S.card, border: `1px solid ${C.orange}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: "bold", color: C.orange }}>
                🚀 Upgrade Account
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>
                Add BVN/NIN to unlock higher limits
              </p>
            </div>
            <span style={{ color: C.orange, fontSize: "20px" }}>›</span>
          </div>
        </div>

        {/* TRANSACTION LIMITS */}
        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>
            📊 Transaction Limits
          </p>
          <div style={S.feeRow}>
            <span style={{ color: C.gray }}>Daily Transfer</span>
            <span>₦50,000</span>
          </div>
          <div style={S.feeRow}>
            <span style={{ color: C.gray }}>Max Balance</span>
            <span>₦300,000</span>
          </div>
          <div style={{ ...S.feeRow, borderBottom: "none" }}>
            <span style={{ color: C.gray }}>KYC Tier</span>
            <span style={{ color: C.gold }}>{user?.kyc_tier?.toUpperCase()}</span>
          </div>
        </div>

        {/* SETTINGS */}
        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>
            ⚙️ Settings
          </p>

          {/* Change PIN */}
          <button
            onClick={() => setShowPinChange(!showPinChange)}
            style={{
              width: "100%", background: "none",
              border: "none", borderBottom: `1px solid #1a2a4a`,
              padding: "14px 0", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", color: C.white
            }}>
            <span style={{ fontSize: "14px" }}>🔑 Change PIN</span>
            <span style={{ color: C.gray }}>{showPinChange ? "−" : "›"}</span>
          </button>

          {/* PIN Change Form */}
          {showPinChange && (
            <div style={{ padding: "12px 0" }}>
              <input
                style={{ ...S.input, marginBottom: "8px" }}
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                type="password"
                maxLength={4}
              />
              {pinMsg && (
                <p style={{ color: pinMsg.type === "error" ? C.error : C.success, fontSize: "13px", margin: "0 0 8px" }}>
                  {pinMsg.text}
                </p>
              )}
              <button
                onClick={handlePinChange}
                style={{ ...S.btn, marginTop: 0, padding: "12px" }}>
                Update PIN
              </button>
            </div>
          )}

          {/* Notifications */}
          <button
            onClick={() => setScreen("notifications")}
            style={{
              width: "100%", background: "none",
              border: "none", borderBottom: `1px solid #1a2a4a`,
              padding: "14px 0", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", color: C.white
            }}>
            <span style={{ fontSize: "14px" }}>🔔 Notifications</span>
            <span style={{ color: C.gray }}>›</span>
          </button>

          {/* Help */}
          <button
            onClick={() => setScreen("help")}
            style={{
              width: "100%", background: "none",
              border: "none", borderBottom: `1px solid #1a2a4a`,
              padding: "14px 0", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", color: C.white
            }}>
            <span style={{ fontSize: "14px" }}>🎧 Help & Support</span>
            <span style={{ color: C.gray }}>›</span>
          </button>

          {/* About */}
          <button
            onClick={() => alert("GTBank Trust Engine v2.0.0\nSelling certainty to uncertainty\nBuilt with ❤️ for unbanked Nigerians")}
            style={{
              width: "100%", background: "none",
              border: "none", padding: "14px 0",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", cursor: "pointer", color: C.white
            }}>
            <span style={{ fontSize: "14px" }}>ℹ️ About GTBank Trust Engine</span>
            <span style={{ color: C.gray }}>›</span>
          </button>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{ ...S.btn, backgroundColor: C.error, marginTop: "8px" }}>
          🚪 Logout
        </button>

      </div>
    </div>
  );
}
