import { useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function Profile({ setScreen }) {
  const { user, logout, updateBalance } = useAuth();
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(user?.profile_photo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  const uploadPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("gtbank_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API}/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setPhotoUrl(data.photo_url);
      alert("Profile photo updated! ✅");
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
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

          {/* Profile Photo */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
            <div style={{
              width: "90px", height: "90px", borderRadius: "50%",
              backgroundColor: C.orange,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: photoUrl ? "0" : "36px", fontWeight: "bold",
              overflow: "hidden", border: `3px solid ${C.orange}`
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user?.full_name?.[0]
              )}
            </div>

            {/* Edit Photo Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: "0", right: "0",
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: C.orange, border: `2px solid ${C.dark}`,
                color: C.white, cursor: "pointer", fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
              ✏️
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => uploadPhoto(e.target.files[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            onChange={e => uploadPhoto(e.target.files[0])}
          />

          {/* Photo Upload Buttons */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: "6px 14px", backgroundColor: `${C.orange}22`,
                border: `1px solid ${C.orange}`, color: C.orange,
                borderRadius: "20px", cursor: "pointer", fontSize: "12px"
              }}>
              {uploading ? "⏳ Uploading..." : "📁 Gallery"}
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: "6px 14px", backgroundColor: `${C.orange}22`,
                border: `1px solid ${C.orange}`, color: C.orange,
                borderRadius: "20px", cursor: "pointer", fontSize: "12px"
              }}>
              📷 Camera
            </button>
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
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>⚙️ Settings</p>

          {/* Change PIN */}
          <button onClick={() => setShowPinChange(!showPinChange)} style={{
            width: "100%", background: "none", border: "none",
            borderBottom: `1px solid #1a2a4a`, padding: "14px 0",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", cursor: "pointer", color: C.white
          }}>
            <span style={{ fontSize: "14px" }}>🔑 Change PIN</span>
            <span style={{ color: C.gray }}>{showPinChange ? "−" : "›"}</span>
          </button>

          {showPinChange && (
            <div style={{ padding: "12px 0" }}>
              <input
                style={{ ...S.input, marginBottom: "8px" }}
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                type="password" maxLength={4}
              />
              {pinMsg && (
                <p style={{ color: pinMsg.type === "error" ? C.error : C.success, fontSize: "13px", margin: "0 0 8px" }}>
                  {pinMsg.text}
                </p>
              )}
              <button onClick={handlePinChange} style={{ ...S.btn, marginTop: 0, padding: "12px" }}>
                Update PIN
              </button>
            </div>
          )}

          {/* Notifications */}
          <button onClick={() => setScreen("notifications")} style={{
            width: "100%", background: "none", border: "none",
            borderBottom: `1px solid #1a2a4a`, padding: "14px 0",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", cursor: "pointer", color: C.white
          }}>
            <span style={{ fontSize: "14px" }}>🔔 Notifications</span>
            <span style={{ color: C.gray }}>›</span>
          </button>

          {/* Help */}
          <button onClick={() => setScreen("help")} style={{
            width: "100%", background: "none", border: "none",
            borderBottom: `1px solid #1a2a4a`, padding: "14px 0",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", cursor: "pointer", color: C.white
          }}>
            <span style={{ fontSize: "14px" }}>🎧 Help & Support</span>
            <span style={{ color: C.gray }}>›</span>
          </button>

          {/* About */}
          <button onClick={() => alert("GTBank Trust Engine v2.0.0\nSelling certainty to uncertainty\nBuilt for unbanked Nigerians 🇳🇬")} style={{
            width: "100%", background: "none", border: "none",
            padding: "14px 0", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", color: C.white
          }}>
            <span style={{ fontSize: "14px" }}>ℹ️ About GTBank Trust Engine</span>
            <span style={{ color: C.gray }}>›</span>
          </button>
        </div>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={{ ...S.btn, backgroundColor: C.error, marginTop: "8px" }}>
          🚪 Logout
        </button>

      </div>
    </div>
  );
}
