import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

const DAILY_TASKS = [
  { id: 1, icon: "💸", title: "Make a Transfer", points: 50, done: false },
  { id: 2, icon: "🔐", title: "Login Today", points: 10, done: true },
  { id: 3, icon: "👤", title: "Complete Profile", points: 100, done: false },
  { id: 4, icon: "📱", title: "Buy Airtime", points: 30, done: false },
  { id: 5, icon: "🎁", title: "Refer a Friend", points: 500, done: false }
];

const COUPONS = [
  { id: 1, icon: "🎯", title: "₦200 Cashback", desc: "On next transfer above ₦5,000", expiry: "Jun 30", color: "#10B981" },
  { id: 2, icon: "📱", title: "Free Airtime ₦100", desc: "On any airtime purchase", expiry: "Jun 15", color: "#F47920" },
  { id: 3, icon: "💰", title: "Zero Transfer Fee", desc: "Next 5 transfers free", expiry: "Jun 20", color: "#EEB211" }
];

export default function Rewards({ setScreen }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(DAILY_TASKS);
  const [points] = useState(1250);
  const [claimedCoupons, setClaimedCoupons] = useState([]);

  const totalPossible = tasks.reduce((sum, t) => sum + t.points, 0);
  const earned = tasks.filter(t => t.done).reduce((sum, t) => sum + t.points, 0);
  const progress = Math.round((earned / totalPossible) * 100);

  const claimCoupon = (id) => {
    if (claimedCoupons.includes(id)) return;
    setClaimedCoupons(prev => [...prev, id]);
    alert("Coupon claimed! 🎉 Check your wallet.");
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
        padding: "20px 16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setScreen("dashboard")} style={{
            background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer"
          }}>←</button>
          <h2 style={{ margin: 0, fontSize: "16px" }}>Rewards</h2>
          <span></span>
        </div>

        {/* Points Balance */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Total Points</p>
          <h1 style={{ margin: "4px 0", fontSize: "48px", fontWeight: "900" }}>
            {points.toLocaleString()}
          </h1>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>≈ ₦{(points * 0.5).toLocaleString()} value</p>
        </div>

        {/* Redeem Button */}
        <button style={{
          width: "100%", padding: "14px", marginTop: "16px",
          backgroundColor: "rgba(0,0,0,0.3)", border: `1px solid ${C.white}`,
          color: C.white, borderRadius: "30px", fontWeight: "bold",
          cursor: "pointer", fontSize: "14px"
        }}>
          🎁 Redeem Points
        </button>
      </div>

      <div style={{ padding: "16px" }}>

        {/* DAILY TASKS */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ margin: 0, fontWeight: "bold", color: C.orange }}>📋 Daily Tasks</p>
            <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>{progress}% complete</p>
          </div>

          {/* Progress Bar */}
          <div style={{ backgroundColor: "#1a2a4a", borderRadius: "10px", height: "8px", marginBottom: "16px" }}>
            <div style={{
              backgroundColor: C.orange, borderRadius: "10px",
              height: "8px", width: `${progress}%`,
              transition: "width 0.3s ease"
            }} />
          </div>

          {tasks.map(task => (
            <div key={task.id} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "12px 0",
              borderBottom: `1px solid #1a2a4a`,
              opacity: task.done ? 0.6 : 1
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  backgroundColor: task.done ? `${C.success}22` : `${C.orange}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px"
                }}>
                  {task.done ? "✅" : task.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>{task.title}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: C.gold }}>+{task.points} pts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!task.done) {
                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: true } : t));
                  }
                }}
                style={{
                  padding: "6px 14px", border: "none", borderRadius: "20px",
                  backgroundColor: task.done ? C.success : C.orange,
                  color: C.white, fontSize: "12px", cursor: "pointer",
                  fontWeight: "bold"
                }}>
                {task.done ? "Done" : "Go"}
              </button>
            </div>
          ))}
        </div>

        {/* COUPONS */}
        <div style={S.card}>
          <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>🎟️ Your Coupons</p>

          {COUPONS.map(coupon => (
            <div key={coupon.id} style={{
              backgroundColor: C.dark, borderRadius: "12px",
              padding: "16px", marginBottom: "12px",
              border: `1px solid ${coupon.color}44`,
              opacity: claimedCoupons.includes(coupon.id) ? 0.5 : 1
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    backgroundColor: `${coupon.color}22`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "22px"
                  }}>
                    {coupon.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", color: coupon.color }}>{coupon.title}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>{coupon.desc}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.gray }}>Expires: {coupon.expiry}</p>
                  </div>
                </div>
                <button
                  onClick={() => claimCoupon(coupon.id)}
                  style={{
                    padding: "8px 14px", border: "none", borderRadius: "20px",
                    backgroundColor: claimedCoupons.includes(coupon.id) ? C.gray : coupon.color,
                    color: C.white, fontSize: "12px", cursor: "pointer",
                    fontWeight: "bold", flexShrink: 0
                  }}>
                  {claimedCoupons.includes(coupon.id) ? "Claimed" : "Claim"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* HOW TO EARN */}
        <div style={S.card}>
          <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>💡 How to Earn Points</p>
          {[
            { icon: "💸", action: "Make a transfer", points: "50 pts" },
            { icon: "📱", action: "Buy airtime/data", points: "30 pts" },
            { icon: "👤", action: "Refer a friend", points: "500 pts" },
            { icon: "🔐", action: "Daily login", points: "10 pts" },
            { icon: "✅", action: "Complete profile", points: "100 pts" }
          ].map(item => (
            <div key={item.action} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: `1px solid #1a2a4a`
            }}>
              <span style={{ fontSize: "13px" }}>{item.icon} {item.action}</span>
              <span style={{ color: C.gold, fontSize: "13px", fontWeight: "bold" }}>{item.points}</span>
            </div>
          ))}
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
          <button key={item.label} style={S.navBtn(item.label === "Rewards")} onClick={item.action}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
