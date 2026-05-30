import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function Notifications({ setScreen }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on load
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch real transactions
      const res = await fetch(`${API}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // Convert transactions to notification format
      const txNotifs = Array.isArray(data) ? data.map(t => ({
        id: t.transaction_id,
        icon: t.status === "success" ? "✅"
          : t.status === "failed" ? "❌" : "↩️",
        title: t.status === "success" ? "Transfer Successful"
          : t.status === "failed" ? "Transfer Failed" : "Transfer Reversed",
        message: t.message,
        amount: t.amount,
        time: new Date(t.timestamp).toLocaleString(),
        read: false,
        type: "transaction"
      })) : [];

      // Add system notifications
      const systemNotifs = [
        {
          id: "sys1",
          icon: "🔐",
          title: "Security Alert",
          message: "New login detected on your account. If this was not you, change your PIN immediately.",
          time: "Just now",
          read: false,
          type: "security"
        },
        {
          id: "sys2",
          icon: "🎁",
          title: "Earn 6% Interest",
          message: "Start saving today and earn up to 6% annually on your savings balance.",
          time: "2 hours ago",
          read: true,
          type: "promo"
        },
        {
          id: "sys3",
          icon: "✅",
          title: "Account Verified",
          message: "Your GTBank Trust Engine account is fully verified and ready to use.",
          time: "Yesterday",
          read: true,
          type: "system"
        }
      ];

      setNotifications([...txNotifs, ...systemNotifs]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Color per notification type
  const typeColor = (type) => {
    if (type === "security") return C.error;
    if (type === "promo") return C.gold;
    if (type === "transaction") return C.orange;
    return C.success;
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "20px" }}>

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

        <h2 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          Notifications
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: C.error, color: C.white,
              borderRadius: "50%", width: "20px", height: "20px",
              fontSize: "11px", display: "inline-flex",
              alignItems: "center", justifyContent: "center"
            }}>
              {unreadCount}
            </span>
          )}
        </h2>

        <button
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          style={{ background: "none", border: "none", color: C.orange, fontSize: "12px", cursor: "pointer" }}>
          Mark all read
        </button>
      </div>

      {/* ============ BODY ============ */}
      <div style={{ padding: "16px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: C.gray }}>⏳ Loading notifications...</p>
          </div>

        ) : notifications.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "50px", margin: "0 0 16px" }}>🔔</p>
            <p style={{ color: C.gray }}>No notifications yet</p>
          </div>

        ) : notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              ...S.card,
              marginBottom: "12px",
              opacity: notif.read ? 0.7 : 1,
              borderLeft: notif.read
                ? "none"
                : `3px solid ${typeColor(notif.type)}`
            }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>

              {/* Icon */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                backgroundColor: `${typeColor(notif.type)}22`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px",
                flexShrink: 0
              }}>
                {notif.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div style={{
                      width: "8px", height: "8px",
                      borderRadius: "50%",
                      backgroundColor: C.orange
                    }} />
                  )}
                </div>

                <p style={{ margin: "0 0 4px", fontSize: "12px", color: C.gray }}>
                  {notif.message}
                </p>

                {notif.amount && (
                  <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "bold", color: C.error }}>
                    -₦{notif.amount?.toLocaleString()}
                  </p>
                )}

                <p style={{ margin: 0, fontSize: "11px", color: C.gray }}>
                  {notif.time}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
