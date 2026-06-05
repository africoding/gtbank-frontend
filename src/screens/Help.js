import { useState } from "react";
import { COLORS as C } from "../constants";
import { S } from "../styles";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid #1a2a4a` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "14px 0", display: "flex",
          justifyContent: "space-between",
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

export default function Help({ setScreen }) {
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);
    try {
      window.location.href = `mailto:nliaustemak@gmail.com?subject=GTBank Support Request&body=${encodeURIComponent(chatMessage)}`;
      setTimeout(() => {
        setChatSent(true);
        setSending(false);
      }, 1000);
    } catch (e) {
      setSending(false);
    }
  };

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
      sub: "Send us a message — we reply within minutes",
      action: () => { setShowChat(true); setChatSent(false); setChatMessage(""); }
    },
    {
      icon: "📞",
      label: "Call Support",
      sub: "0800-GTB-HELP (Free 24/7)",
      action: () => { window.location.href = "tel:08004824357"; }
    },
    {
      icon: "📧",
      label: "Email Support",
      sub: "nliaustemak@gmail.com",
      action: () => { window.location.href = "mailto:nliaustemak@gmail.com?subject=GTBank Support"; }
    },
    {
      icon: "💚",
      label: "WhatsApp Support",
      sub: "Chat on WhatsApp — fastest response",
      action: () => { window.open("https://wa.me/2348004824357?text=Hello%20GTBank%20Support%2C%20I%20need%20help%20with%20my%20account.", "_blank"); }
    }
  ];

  return (
    <div style={{ ...S.wrap, paddingBottom: "20px" }}>

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <button
          onClick={() => showChat ? setShowChat(false) : setScreen("dashboard")}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>
          {showChat ? "Send us a Message" : "Help & Support"}
        </h2>
        <span></span>
      </div>

      <div style={{ padding: "16px" }}>

        {/* LIVE CHAT PANEL */}
        {showChat && (
          <div style={S.card}>
            {!chatSent ? (
              <>
                <p style={{ margin: "0 0 6px", fontWeight: "bold", color: C.orange }}>
                  💬 Send us a Message
                </p>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: C.gray }}>
                  Describe your issue below and we'll reply to your registered email shortly.
                </p>
                <textarea
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="e.g. My transfer of ₦5,000 is showing pending for 2 hours..."
                  style={{
                    width: "100%", minHeight: "120px",
                    background: "#0d1625", border: `1px solid #1e293b`,
                    borderRadius: "10px", color: C.white,
                    fontSize: "13px", padding: "12px",
                    resize: "vertical", outline: "none",
                    fontFamily: "inherit"
                  }}
                />
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !chatMessage.trim()}
                  style={{
                    ...S.btn,
                    backgroundColor: chatMessage.trim() ? C.orange : C.gray,
                    marginTop: "12px"
                  }}>
                  {sending ? "⏳ Opening email..." : "📧 Send Message"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "50px", marginBottom: "12px" }}>✅</div>
                <h3 style={{ color: C.success, margin: "0 0 8px" }}>Message Sent!</h3>
                <p style={{ color: C.gray, fontSize: "13px", margin: 0 }}>
                  We received your message and will reply to your email within 24 hours.
                </p>
                <button
                  onClick={() => setShowChat(false)}
                  style={{ ...S.btn, marginTop: "20px", backgroundColor: C.orange }}>
                  Back to Help
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUPPORT OPTIONS */}
        {!showChat && (
          <>
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
                    padding: "14px 0", display: "flex",
                    alignItems: "center", gap: "12px", cursor: "pointer"
                  }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    backgroundColor: `${C.orange}22`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px", flexShrink: 0
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

            {/* FAQ */}
            <div style={S.card}>
              <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>
                ❓ Frequently Asked Questions
              </p>
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>

            {/* FOOTER */}
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
          </>
        )}
      </div>
    </div>
  );
}