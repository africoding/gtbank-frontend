import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function Cards({ setScreen }) {
  const { user } = useAuth();
  const [cardVisible, setCardVisible] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const cardNumber = user?.phone
    ? `4084 ${user.phone.slice(1,5)} ${user.phone.slice(5,9)} 4081`
    : "4084 0000 0000 4081";

  const maskedNumber = "4084 •••• •••• 4081";

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{ backgroundColor: C.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("dashboard")} style={{
          background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer"
        }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>My Cards</h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>

        {/* VIRTUAL CARD */}
        <div style={{
          background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
          borderRadius: "20px", padding: "24px", marginBottom: "16px",
          position: "relative", overflow: "hidden",
          opacity: frozen ? 0.7 : 1
        }}>
          {/* Background pattern */}
          <div style={{
            position: "absolute", top: "-20px", right: "-20px",
            width: "150px", height: "150px", borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)"
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", right: "40px",
            width: "120px", height: "120px", borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)"
          }} />

          {/* Card Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>GTBank</p>
            <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
              {frozen ? "🔒 FROZEN" : "VIRTUAL CARD"}
            </p>
          </div>

          {/* Card Number */}
          <p style={{ margin: "0 0 20px", fontSize: "18px", letterSpacing: "3px", fontFamily: "monospace" }}>
            {cardVisible ? cardNumber : maskedNumber}
          </p>

          {/* Card Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ margin: 0, fontSize: "10px", opacity: 0.7 }}>CARD HOLDER</p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
                {user?.full_name?.toUpperCase()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "10px", opacity: 0.7 }}>EXPIRES</p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>12/28</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold", fontStyle: "italic" }}>VISA</p>
            </div>
          </div>
        </div>

        {/* CARD ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          {[
            {
              icon: cardVisible ? "🙈" : "👁",
              label: cardVisible ? "Hide Details" : "Show Details",
              action: () => setCardVisible(v => !v),
              color: C.orange
            },
            {
              icon: frozen ? "🔓" : "🔒",
              label: frozen ? "Unfreeze Card" : "Freeze Card",
              action: () => setFrozen(v => !v),
              color: frozen ? C.success : C.error
            }
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              backgroundColor: C.card, border: `1px solid ${item.color}44`,
              borderRadius: "12px", padding: "16px", cursor: "pointer",
              textAlign: "center", color: C.white
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "24px" }}>{item.icon}</p>
              <p style={{ margin: 0, fontSize: "13px", color: item.color, fontWeight: "bold" }}>
                {item.label}
              </p>
            </button>
          ))}
        </div>

        {/* CARD DETAILS */}
        {cardVisible && (
          <div style={S.card}>
            <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>Card Details</p>
            {[
              { label: "Card Number", value: cardNumber },
              { label: "CVV", value: "408" },
              { label: "Expiry", value: "12/28" },
              { label: "Billing Address", value: "Nigeria" }
            ].map(item => (
              <div key={item.label} style={S.feeRow}>
                <span style={{ color: C.gray }}>{item.label}</span>
                <span style={{ fontFamily: "monospace" }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* CARD LIMITS */}
        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>📊 Card Limits</p>
          {[
            { label: "Daily Spend", used: 2500, limit: 50000 },
            { label: "Monthly Spend", used: 15000, limit: 200000 },
            { label: "Online Transactions", used: 1000, limit: 10000 }
          ].map(item => (
            <div key={item.label} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px" }}>{item.label}</span>
                <span style={{ fontSize: "12px", color: C.gray }}>
                  ₦{item.used.toLocaleString()} / ₦{item.limit.toLocaleString()}
                </span>
              </div>
              <div style={{ backgroundColor: "#1a2a4a", borderRadius: "10px", height: "6px" }}>
                <div style={{
                  backgroundColor: C.orange, borderRadius: "10px",
                  height: "6px", width: `${Math.round((item.used/item.limit)*100)}%`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* REQUEST PHYSICAL CARD */}
        <div style={{ ...S.card, border: `1px solid ${C.gold}44`, textAlign: "center" }}>
          <p style={{ fontSize: "30px", margin: "0 0 8px" }}>💳</p>
          <p style={{ margin: "0 0 4px", fontWeight: "bold", color: C.gold }}>
            Request Physical Card
          </p>
          <p style={{ margin: "0 0 16px", color: C.gray, fontSize: "12px" }}>
            Get a physical Visa debit card delivered to your address
          </p>
          <button style={{ ...S.btn, backgroundColor: C.gold, color: C.navy }}>
            Request Card — Coming Soon
          </button>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={S.bottomNav}>
        {[
          { icon: "🏠", label: "Home", action: () => setScreen("dashboard") },
          { icon: "🎁", label: "Rewards", action: () => setScreen("rewards") },
          { icon: "📈", label: "Finance", action: () => setScreen("finance") },
          { icon: "💳", label: "Cards", action: () => setScreen("cards") },
          { icon: "👤", label: "Me", action: () => setScreen("profile") }
        ].map(item => (
          <button key={item.label} style={S.navBtn(item.label === "Cards")} onClick={item.action}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
