import { useState } from "react";
import { COLORS as C } from "../constants";
import { S } from "../styles";

// ============================================
// FAQ Item - expandable question and answer
// ============================================
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid #1a2a4a` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "14px 0",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", cursor: "pointer", color: C.white
        }}>
        <span style={{ fontSize: "13px", textAlign: "left", flex: 1 }}>
          {question}
        </span>
        <span style={{ color: C.orange, fontSize: "20px", marginLeft: "10px" }}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <p style={{ margin: "0 0 14px", fontSize: "12px", color: C.gray, paddingLeft: "4px" }}>
          {answer}
        </p>
      )}
    </div>
  );
}

// ============================================
// Help Screen
// ============================================
export default function Help({ setScreen }) {

  const faqs = [
    {
      q: "How do I transfer money?",
      a: "Tap 'To Bank' on dashboard. Enter 10-digit account number, select bank, enter amount and confirm with your PIN."
    },
    {
      q: "Why is my transfer pending?",
      a: "Transfers may take up to 24 hours during NIBSS settlement windows especially after 4PM on weekdays."
    },
    {
      q: "How do I add money to my wallet?",
      a: "Tap '+ Add Money' on dashboard. Pay with your debit card via Paystack. Balance updates immediately."
    },
    {
      q: "What is my account number?",
      a: "Your registered phone number is your account number on GTBank Trust Engine."
    },
    {
      q: "How do I upgrade my account?",
      a: "Go to Profile → Upgrade Account → add your BVN and NIN to unlock higher transfer limits."
    },
    {
      q: "Transfer failed — where is my money?",
      a: "Your money is safe. Failed transfers are automatically reversed to your wallet within 24 hours."
    },
    {
      q: "How do I change my PIN?",
      a: "Go to Profile → Settings → Change PIN. Enter your current PIN then set a new 4-digit PIN."
    }
  ];

  const supportOptions = [
    {
      icon: "💬",
      label: "Live Chat",
      sub: "Chat with us now — we reply instantly",
      action: () => alert("Live chat coming soon 🚀")
    },
    {
      icon: "📞",
      label: "Call Support",
      sub: "0800-GTB-HELP (Free 24/7)",
      action: () => alert("0800-GTB-HELP")
    },
    {
      icon: "📧",
      label: "Email Support",
      sub: "support@gtbank-trust.com",
      action: () => alert("support@gtbank-trust.com")
    },
    {
      icon: "🐦",
      label: "Twitter Support",
      sub: "@GTBankTrust — reply within 1 hour",
      action: () => alert("@GTBankTrust")
    }
  ];

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
        <h2 style={{ margin: 0, fontSize: "16px" }}>Help & Support</h2>
        <span></span>
      </div>

      {/* ============ BODY ============ */}
      <div style={{ padding: "16px" }}>

        {/* SUPPORT OPTIONS */}
        <div style={S.card}>
          <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>
            📞 Contact Support
          </p>

          {supportOptions.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: "100%", background: "none", border: "none",
                borderBottom: `1px solid #1a2a4a`,
                padding: "14px 0",
                display: "flex", alignItems: "center",
                gap: "12px", cursor: "pointer"
              }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                backgroundColor: `${C.orange}22`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px",
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <p style={{ margin: 0, color: C.white, fontWeight: "bold", fontSize: "14px" }}>
                  {item.label}
                </p>
                <p style={{ margin: 0, color: C.gray, fontSize: "12px" }}>
                  {item.sub}
                </p>
              </div>
              <span style={{ color: C.gray }}>›</span>
            </button>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div style={S.card}>
          <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>
            ❓ Frequently Asked Questions
          </p>

          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div style={{
          ...S.card,
          border: `1px solid ${C.gold}44`,
          backgroundColor: `${C.gold}11`,
          textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: "12px", color: C.gold }}>
            🏦 GTBank Trust Engine v2.0.0
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: C.gray }}>
            Selling certainty to uncertainty in Nigerian payments
          </p>
        </div>

      </div>
    </div>
  );
}
