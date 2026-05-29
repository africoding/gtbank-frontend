import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function Dashboard({ setScreen }) {
  const { user, logout } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const comingSoon = () => alert("Coming Soon 🚀");

  const bottomNav = [
    { icon: "🏠", label: "Home", action: () => setScreen("dashboard") },
    { icon: "🎁", label: "Rewards", action: comingSoon },
    { icon: "📈", label: "Finance", action: comingSoon },
    { icon: "💳", label: "Cards", action: comingSoon },
    { icon: "👤", label: "Me", action: () => setScreen("profile") }
  ];

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>

      {/* TOP BAR */}
      <div style={{ backgroundColor: C.dark, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={() => setScreen("profile")}
            style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>
            {user?.full_name?.[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: C.gray }}>Welcome back</p>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>Hi, {user?.full_name?.split(" ")[0]}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={comingSoon} style={{ background: "none", border: "none", color: C.white, fontSize: "20px", cursor: "pointer" }}>🎧</button>
          <button onClick={comingSoon} style={{ background: "none", border: "none", color: C.white, fontSize: "20px", cursor: "pointer" }}>📷</button>
          <button onClick={comingSoon} style={{ background: "none", border: "none", color: C.white, fontSize: "20px", cursor: "pointer", position: "relative" }}>
            🔔
            <span style={{ position: "absolute", top: "-4px", right: "-4px", backgroundColor: C.error, borderRadius: "50%", width: "14px", height: "14px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>
          </button>
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {/* BALANCE CARD */}
        <div style={{ background: `linear-gradient(135deg, ${C.orange}dd, ${C.darkOrange})`, borderRadius: "20px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>✅ Available Balance</span>
              <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: "none", border: "none", color: C.white, cursor: "pointer", fontSize: "16px" }}>
                {balanceVisible ? "👁" : "🙈"}
              </button>
            </div>
            <button onClick={() => setScreen("history")} style={{ background: "none", border: "none", color: C.white, cursor: "pointer", fontSize: "13px" }}>
              Transaction History ›
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "900" }}>
              {balanceVisible ? `₦${user?.balance?.toLocaleString()}` : "₦ ••••••"}
              <span style={{ fontSize: "16px", opacity: 0.8 }}> ›</span>
            </h1>
            <button onClick={comingSoon} style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "none", color: C.white, padding: "10px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
              + Add Money
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={S.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { icon: "👤", label: "To GTBank", action: () => setScreen("transfer") },
              { icon: "🏦", label: "To Bank", action: () => setScreen("transfer") },
              { icon: "💳", label: "Withdraw", action: comingSoon }
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: "10px 0" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: `${C.orange}22`, border: `1px solid ${C.orange}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "22px" }}>
                  {item.icon}
                </div>
                <p style={{ margin: 0, color: C.white, fontSize: "12px" }}>{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <div style={S.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            {[
              { icon: "📱", label: "Airtime", badge: "6%" },
              { icon: "📊", label: "Data", badge: "6%" },
              { icon: "🎰", label: "Betting", badge: null },
              { icon: "📺", label: "TV", badge: null },
              { icon: "🐷", label: "Savings", badge: null },
              { icon: "💰", label: "Loan", badge: "New" },
              { icon: "🎁", label: "Invite", badge: "₦5600" },
              { icon: "⋯", label: "More", badge: null }
            ].map(item => (
              <button key={item.label} onClick={comingSoon} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", position: "relative" }}>
                {item.badge && (
                  <span style={{ position: "absolute", top: "-4px", right: "4px", backgroundColor: item.badge === "New" ? C.gold : C.error, color: C.white, fontSize: "8px", padding: "2px 4px", borderRadius: "8px" }}>
                    {item.badge === "6%" ? `Up to ${item.badge}` : item.badge}
                  </span>
                )}
                <div style={{ width: "46px", height: "46px", borderRadius: "14px", backgroundColor: `${C.orange}22`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: "20px" }}>
                  {item.icon}
                </div>
                <p style={{ margin: 0, color: C.white, fontSize: "11px" }}>{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* SAVINGS CHALLENGE */}
        <div style={{ ...S.card, background: `linear-gradient(135deg, ${C.navy}, #1a3a6a)`, border: `1px solid ${C.orange}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px", color: C.gold, fontWeight: "bold" }}>Saving Challenge 2026</p>
              <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>Special Target — Start small, finish big</p>
            </div>
            <button onClick={comingSoon} style={{ backgroundColor: C.orange, border: "none", color: C.white, padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Go</button>
          </div>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={S.bottomNav}>
        {bottomNav.map(item => (
          <button key={item.label} style={S.navBtn(item.label === "Home")} onClick={item.action}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
