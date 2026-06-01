import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

const MESSAGES = [
  { icon: "🎁", text: "Earn up to 6% interest on your savings — Start today!" },
  { icon: "🔐", text: "Never share your PIN with anyone. GTBank will never ask." },
  { icon: "💸", text: "Send money free — You have 3 free transfers today!" },
  { icon: "🚀", text: "Upgrade your account with BVN to unlock ₦500,000 limit." },
  { icon: "⚡", text: "Instant transfers to all Nigerian banks — 24/7." },
  { icon: "🛡️", text: "Your money is protected by GTBank Trust Engine." },
  { icon: "📱", text: "Buy airtime and data directly from your wallet." },
  { icon: "💰", text: "Refer a friend and earn ₦5,600 reward instantly!" },
];

export default function Dashboard({ setScreen }) {
  const { user, token } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txIndex, setTxIndex] = useState(0);
  const [txAnim, setTxAnim] = useState("in");
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgAnim, setMsgAnim] = useState("in");
  const [unreadCount, setUnreadCount] = useState(4);
  const tokenRef = useRef(token);

  // Fetch transactions once on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/transactions`, {
          headers: { Authorization: `Bearer ${tokenRef.current}` }
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // Transaction ticker — flips UP every 2.5s
  useEffect(() => {
    if (transactions.length < 2) return;
    const timer = setInterval(() => {
      setTxAnim("out");
      setTimeout(() => {
        setTxIndex(prev => (prev + 1) % transactions.length);
        setTxAnim("in");
      }, 400);
    }, 2500);
    return () => clearInterval(timer);
  }, [transactions]);

  // Message ticker — slides LEFT every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgAnim("out");
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % MESSAGES.length);
        setMsgAnim("in");
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentTx = transactions[txIndex];
  const currentMsg = MESSAGES[msgIndex];

  const txStyle = {
    in:  { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(-16px)" }
  };

  const msgStyle = {
    in:  { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(-30px)" }
  };

  const comingSoon = (name) => alert(`${name} coming soon! 🚀`);

  const services = [
    { icon: "📱", label: "Airtime", badge: "6%", action: () => comingSoon("Airtime") },
    { icon: "📊", label: "Data", badge: "6%", action: () => comingSoon("Data") },
    { icon: "🎰", label: "Betting", badge: null, action: () => comingSoon("Betting") },
    { icon: "📺", label: "TV", badge: null, action: () => comingSoon("TV Bills") },
    { icon: "🐷", label: "Savings", badge: null, action: () => setScreen("finance") },
    { icon: "💰", label: "Loan", badge: "New", action: () => setScreen("finance") },
    { icon: "🎁", label: "Invite", badge: "₦5600", action: () => setScreen("rewards") },
    { icon: "⋯", label: "More", badge: null, action: () => comingSoon("More Services") }
  ];

  return (
    <div style={{ ...S.wrap, paddingBottom: "120px" }}>

      {/* TOP BAR */}
      <div style={{
        backgroundColor: C.dark, padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div onClick={() => setScreen("profile")} style={{
          width: "40px", height: "40px", borderRadius: "50%",
          backgroundColor: C.orange, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "18px", fontWeight: "bold", cursor: "pointer"
        }}>
          {user?.full_name?.[0]}
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "11px", color: C.gray }}>Welcome back</p>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>
            Hi, {user?.full_name?.split(" ")[0]} 👋
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setScreen("help")} style={{
            background: `${C.orange}22`, border: "none", color: C.white,
            fontSize: "16px", cursor: "pointer", width: "32px", height: "32px",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
          }}>🎧</button>

          <button onClick={() => setScreen("qrscanner")} style={{
            background: `${C.orange}22`, border: "none", color: C.white,
            fontSize: "16px", cursor: "pointer", width: "32px", height: "32px",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
          }}>📷</button>

          <button onClick={() => { setUnreadCount(0); setScreen("notifications"); }} style={{
            background: `${C.orange}22`, border: "none", color: C.white,
            fontSize: "16px", cursor: "pointer", width: "32px", height: "32px",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", position: "relative"
          }}>
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-3px", right: "-3px",
                backgroundColor: C.error, color: C.white, borderRadius: "50%",
                width: "15px", height: "15px", fontSize: "8px", fontWeight: "bold",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{unreadCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "16px" }}>

        {/* BALANCE CARD */}
        <div style={{
          background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
          borderRadius: "20px", padding: "20px", marginBottom: "16px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px" }}>✅ Available Balance</span>
              <button onClick={() => setBalanceVisible(v => !v)} style={{
                background: "none", border: "none", color: C.white, cursor: "pointer", fontSize: "15px"
              }}>{balanceVisible ? "👁" : "🙈"}</button>
            </div>
            <button onClick={() => setScreen("history")} style={{
              background: "none", border: "none", color: C.white, cursor: "pointer", fontSize: "12px"
            }}>Transaction History ›</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "900" }}>
              {balanceVisible ? `₦${user?.balance?.toLocaleString()}` : "₦ ••••••"}
            </h1>
            <button onClick={() => setScreen("addmoney")} style={{
              backgroundColor: "rgba(0,0,0,0.3)", border: "none", color: C.white,
              padding: "10px 14px", borderRadius: "20px", cursor: "pointer",
              fontWeight: "bold", fontSize: "13px"
            }}>+ Add Money</button>
          </div>
        </div>

        {/* TRANSACTION TICKER */}
        {transactions.length > 0 && currentTx && (
          <div onClick={() => setScreen("history")} style={{
            backgroundColor: C.card, borderRadius: "12px",
            padding: "12px 16px", marginBottom: "16px",
            cursor: "pointer", height: "64px",
            display: "flex", alignItems: "center", overflow: "hidden"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", width: "100%",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              ...txStyle[txAnim]
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  backgroundColor: currentTx.status === "success"
                    ? `${C.success}22` : `${C.error}22`,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "18px"
                }}>
                  {currentTx.status === "success" ? "✅"
                    : currentTx.status === "failed" ? "❌" : "↩️"}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>
                    Transfer to {currentTx.recipient}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: C.gray }}>
                    {new Date(currentTx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: "bold", color: C.error, fontSize: "14px" }}>
                  -₦{currentTx.amount?.toLocaleString()}
                </p>
                <p style={{ margin: 0, fontSize: "10px", color: C.gold }}>
                  {currentTx.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div style={S.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { icon: "👤", label: "To GTBank", action: () => setScreen("transfer") },
              { icon: "🏦", label: "To Bank", action: () => setScreen("transfer") },
              { icon: "💳", label: "Withdraw", action: () => comingSoon("Withdraw") }
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{
                background: "none", border: "none", cursor: "pointer",
                textAlign: "center", padding: "10px 0"
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  backgroundColor: `${C.orange}22`, border: `1px solid ${C.orange}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px", fontSize: "22px"
                }}>{item.icon}</div>
                <p style={{ margin: 0, color: C.white, fontSize: "12px" }}>{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <div style={S.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            {services.map(item => (
              <button key={item.label} onClick={item.action} style={{
                background: "none", border: "none", cursor: "pointer",
                textAlign: "center", position: "relative"
              }}>
                {item.badge && (
                  <span style={{
                    position: "absolute", top: "-4px", right: "2px",
                    backgroundColor: item.badge === "New" ? C.gold : C.error,
                    color: C.white, fontSize: "7px",
                    padding: "2px 4px", borderRadius: "8px"
                  }}>
                    {item.badge === "6%" ? `Up to ${item.badge}` : item.badge}
                  </span>
                )}
                <div style={{
                  width: "46px", height: "46px", borderRadius: "14px",
                  backgroundColor: `${C.orange}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px", fontSize: "20px"
                }}>{item.icon}</div>
                <p style={{ margin: 0, color: C.white, fontSize: "11px" }}>{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* SAVINGS CHALLENGE */}
        <div style={{
          ...S.card,
          background: `linear-gradient(135deg, ${C.navy}, #1a3a6a)`,
          border: `1px solid ${C.orange}44`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 4px", color: C.gold, fontWeight: "bold" }}>
                Saving Challenge 2026
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>
                Special Target — Start small, finish big
              </p>
            </div>
            <button onClick={() => setScreen("finance")} style={{
              backgroundColor: C.orange, border: "none", color: C.white,
              padding: "8px 14px", borderRadius: "20px",
              cursor: "pointer", fontSize: "12px", fontWeight: "bold"
            }}>Go</button>
          </div>
        </div>

      </div>

      {/* MESSAGE TICKER */}
      <div style={{
        backgroundColor: `${C.orange}18`,
        borderTop: `1px solid ${C.orange}44`,
        borderBottom: `1px solid ${C.orange}44`,
        padding: "8px 16px", height: "38px",
        display: "flex", alignItems: "center", overflow: "hidden"
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", width: "100%",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          ...msgStyle[msgAnim]
        }}>
          <span style={{ fontSize: "14px", flexShrink: 0 }}>{currentMsg.icon}</span>
          <p style={{
            margin: 0, fontSize: "12px", color: C.white,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}>{currentMsg.text}</p>
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
          <button key={item.label} style={S.navBtn(item.label === "Home")} onClick={item.action}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
