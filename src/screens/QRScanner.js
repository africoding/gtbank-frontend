import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function QRScanner({ setScreen }) {
  const { user } = useAuth();
  const [mode, setMode] = useState("show");

  return (
    <div style={S.wrap}>

      {/* ============ HEADER ============ */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <button
          onClick={() => setScreen("dashboard")}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>QR Code</h2>
        <span></span>
      </div>

      {/* ============ MODE TOGGLE ============ */}
      <div style={{
        display: "flex", backgroundColor: C.dark,
        padding: "4px 16px", gap: "4px"
      }}>
        {[
          { key: "show", label: "My QR Code" },
          { key: "scan", label: "Scan QR Code" }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setMode(item.key)}
            style={{
              flex: 1, padding: "12px",
              backgroundColor: mode === item.key ? C.orange : "transparent",
              color: C.white, border: "none",
              borderRadius: "10px", fontWeight: "bold",
              cursor: "pointer"
            }}>
            {item.label}
          </button>
        ))}
      </div>

      {/* ============ BODY ============ */}
      <div style={{ padding: "20px" }}>

        {/* SHOW MY QR CODE */}
        {mode === "show" && (
          <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
            <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 20px" }}>
              Show this QR code to receive money instantly
            </p>

            {/* QR Code Box */}
            <div style={{
              width: "200px", height: "200px",
              backgroundColor: C.white,
              borderRadius: "16px",
              margin: "0 auto 20px",
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "3px"
            }}>
              {/* Simple QR pattern using account number hash */}
              {Array.from({ length: 49 }).map((_, i) => {
                const corners = [0, 1, 2, 7, 8, 9, 14, 15, 16, 32, 33, 34, 39, 40, 41, 46, 47, 48];
                const filled = corners.includes(i) || (i % 3 === 0) || (i % 7 === 0);
                return (
                  <div key={i} style={{
                    backgroundColor: filled ? "#003057" : "#ffffff",
                    borderRadius: "1px"
                  }} />
                );
              })}
            </div>

            {/* Account Info */}
            <h3 style={{ margin: "0 0 4px", color: C.orange, fontSize: "18px" }}>
              {user?.full_name?.toUpperCase()}
            </h3>
            <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>
              {user?.phone}
            </p>
            <p style={{ margin: "0 0 20px", color: C.gray, fontSize: "12px" }}>
              GTBank Trust Engine
            </p>

            <button style={{ ...S.btn, marginTop: 0 }}>
              📤 Share QR Code
            </button>
          </div>
        )}

        {/* SCAN QR CODE */}
        {mode === "scan" && (
          <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
            <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 20px" }}>
              Point camera at a GTBank QR code to pay instantly
            </p>

            {/* Scanner Frame */}
            <div style={{
              width: "240px", height: "240px",
              margin: "0 auto 20px",
              position: "relative",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              backgroundColor: C.dark,
              borderRadius: "16px"
            }}>
              {/* Corner markers */}
              {[
                { top: "10px", left: "10px", borderTop: `3px solid ${C.orange}`, borderLeft: `3px solid ${C.orange}` },
                { top: "10px", right: "10px", borderTop: `3px solid ${C.orange}`, borderRight: `3px solid ${C.orange}` },
                { bottom: "10px", left: "10px", borderBottom: `3px solid ${C.orange}`, borderLeft: `3px solid ${C.orange}` },
                { bottom: "10px", right: "10px", borderBottom: `3px solid ${C.orange}`, borderRight: `3px solid ${C.orange}` }
              ].map((corner, i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: "28px", height: "28px",
                  ...corner
                }} />
              ))}

              {/* Center content */}
              <div>
                <p style={{ fontSize: "40px", margin: "0 0 8px" }}>📷</p>
                <p style={{ color: C.gray, fontSize: "12px", margin: 0 }}>
                  Camera access needed
                </p>
              </div>
            </div>

            <button
              style={S.btn}
              onClick={() => alert("Camera QR scanning coming soon! 🚀")}>
              📷 Open Camera
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
