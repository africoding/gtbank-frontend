import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function Profile({ setScreen }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setScreen("auth");
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>
      <div style={{ backgroundColor: C.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>My Profile</h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: C.orange, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "32px", fontWeight: "bold" }}>
            {user?.full_name?.[0]}
          </div>
          <h2 style={{ margin: "0 0 4px" }}>{user?.full_name?.toUpperCase()}</h2>
          <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>{user?.phone}</p>
          <p style={{ margin: "0 0 12px", color: C.gray, fontSize: "13px" }}>Account: {user?.phone}</p>
          <span style={{ backgroundColor: `${C.gold}22`, color: C.gold, padding: "4px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
            {user?.kyc_tier?.toUpperCase()} • Verified
          </span>
        </div>

        <div style={{ ...S.card, border: `1px solid ${C.orange}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: "bold", color: C.orange }}>🚀 Upgrade Account</p>
              <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>Add BVN/NIN to unlock higher limits</p>
            </div>
            <span style={{ color: C.orange, fontSize: "20px" }}>›</span>
          </div>
        </div>

        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>📊 Transaction Limits</p>
          <div style={S.feeRow}><span style={{ color: C.gray }}>Daily Transfer</span><span>₦50,000</span></div>
          <div style={S.feeRow}><span style={{ color: C.gray }}>Max Balance</span><span>₦300,000</span></div>
          <div style={{ ...S.feeRow, borderBottom: "none" }}><span style={{ color: C.gray }}>KYC Tier</span><span style={{ color: C.gold }}>{user?.kyc_tier?.toUpperCase()}</span></div>
        </div>

        <div style={S.card}>
          <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>⚙️ Settings</p>
          {[
            { icon: "🔑", label: "Change PIN" },
            { icon: "🔔", label: "Notifications" },
            { icon: "🎧", label: "Help & Support" },
            { icon: "ℹ️", label: "About GTBank Trust Engine" }
          ].map(item => (
            <button key={item.label} style={{ width: "100%", background: "none", border: "none", borderBottom: `1px solid #1a2a4a`, padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: C.white }}>
              <span style={{ fontSize: "14px" }}>{item.icon} {item.label}</span>
              <span style={{ color: C.gray }}>›</span>
            </button>
          ))}
        </div>

        <button onClick={handleLogout} style={{ ...S.btn, backgroundColor: C.error, marginTop: "8px" }}>
          🚪 Logout
        </button>
      </div>

      <div style={S.bottomNav}>
        {[
          { icon: "🏠", label: "Home", sc: "dashboard" },
          { icon: "🎁", label: "Rewards", sc: "rewards" },
          { icon: "📈", label: "Finance", sc: "finance" },
          { icon: "💳", label: "Cards", sc: "cards" },
          { icon: "👤", label: "Me", sc: "profile" }
        ].map(item => (
          <button key={item.label} style={S.navBtn(item.sc === "profile")} onClick={() => setScreen(item.sc)}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
