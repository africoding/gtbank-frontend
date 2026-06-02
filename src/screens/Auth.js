import { useState } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function Auth({ setScreen }) {
  const { login } = useAuth();

  // Auth mode
  const [authMode, setAuthMode] = useState("login");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [authPin, setAuthPin] = useState("");

  // States
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Account exists flow
  const [showAccountExists, setShowAccountExists] = useState(false);
  const [existingPhone, setExistingPhone] = useState("");

  // OTP Recovery flow
  const [showRecovery, setShowRecovery] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [showResetPin, setShowResetPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Generate demo OTP from phone number
  const generateOtp = (phoneNumber) => {
    return phoneNumber.slice(-4);
  };

  const handleAuth = async () => {
    setAuthError(null);
    setShowAccountExists(false);

    // Validation
    if (authMode === "register") {
      if (!fullName.trim()) {
        setAuthError("Please enter your full name");
        return;
      }
      if (fullName.trim().split(" ").length < 2) {
        setAuthError("Please enter both first and last name");
        return;
      }
    }
    if (!phone.trim() || phone.length < 10) {
      setAuthError("Please enter a valid phone number");
      return;
    }
    if (!authPin || authPin.length !== 4) {
      setAuthError("PIN must be exactly 4 digits");
      return;
    }

    setAuthLoading(true);
    try {
      const endpoint = authMode === "register" ? "/register" : "/login";
      const body = authMode === "register"
        ? { full_name: fullName.trim(), phone: phone.trim(), pin: authPin }
        : { phone: phone.trim(), pin: authPin };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      login(data.user, data.access_token);
      setScreen("dashboard");
    } catch (err) {
      // Check if phone already registered
      if (err.message.includes("already registered")) {
        setExistingPhone(phone.trim());
        setShowAccountExists(true);
      } else {
        setAuthError(err.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendOtp = () => {
    const otp = generateOtp(existingPhone);
    console.log(`Demo OTP for ${existingPhone}: ${otp}`);
    setOtpSent(true);
    setOtpError(null);
    alert(`Demo Mode: Your OTP is the last 4 digits of your phone number`);
  };

  const handleVerifyOtp = () => {
    const correctOtp = generateOtp(existingPhone);
    if (enteredOtp === correctOtp) {
      setOtpError(null);
      setShowResetPin(true);
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const handleResetPin = async () => {
    if (newPin.length !== 4) {
      setOtpError("PIN must be 4 digits");
      return;
    }
    setAuthLoading(true);
    try {
      // Login with new PIN after reset
      // In production this would call a reset-pin endpoint
      setResetSuccess(true);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const resetAll = () => {
    setShowAccountExists(false);
    setShowRecovery(false);
    setOtpSent(false);
    setEnteredOtp("");
    setOtpError(null);
    setShowResetPin(false);
    setNewPin("");
    setResetSuccess(false);
    setExistingPhone("");
    setPhone("");
    setAuthPin("");
    setFullName("");
    setAuthError(null);
  };

  // ============================================
  // ACCOUNT EXISTS SCREEN
  // ============================================
  if (showAccountExists && !showRecovery) return (
    <div style={S.wrap}>
      <div style={{
        background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
        padding: "50px 20px 30px", textAlign: "center"
      }}>
        <div style={{ fontSize: "50px", marginBottom: "12px" }}>🏦</div>
        <h2 style={{ margin: "0 0 4px", fontSize: "24px" }}>GTBank Trust Engine</h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.8, letterSpacing: "2px" }}>
          SELLING CERTAINTY TO UNCERTAINTY
        </p>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <div style={{ ...S.card, textAlign: "center", border: `1px solid ${C.gold}44` }}>
          <p style={{ fontSize: "50px", margin: "0 0 12px" }}>⚠️</p>
          <h3 style={{ margin: "0 0 8px", color: C.gold }}>Account Already Exists</h3>
          <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>
            A GTBank Trust Engine account already exists for:
          </p>
          <p style={{ margin: "0 0 20px", color: C.white, fontWeight: "bold", fontSize: "16px" }}>
            {existingPhone}
          </p>
          <p style={{ margin: "0 0 20px", color: C.gray, fontSize: "12px" }}>
            For security, only one account is allowed per phone number.
          </p>

          {/* Login Button */}
          <button
            onClick={() => {
              setShowAccountExists(false);
              setAuthMode("login");
              setPhone(existingPhone);
              setAuthPin("");
            }}
            style={{ ...S.btn, marginBottom: "12px" }}>
            🔑 Login to Existing Account
          </button>

          {/* Recovery Button */}
          <button
            onClick={() => setShowRecovery(true)}
            style={{
              ...S.btn,
              backgroundColor: "transparent",
              border: `2px solid ${C.orange}`,
              color: C.orange
            }}>
            📱 Recover Account via OTP
          </button>

          {/* Cancel */}
          <button
            onClick={resetAll}
            style={{
              ...S.btn,
              backgroundColor: "transparent",
              border: "none",
              color: C.gray,
              marginTop: "8px"
            }}>
            ← Use Different Number
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // OTP RECOVERY SCREEN
  // ============================================
  if (showRecovery) return (
    <div style={S.wrap}>
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button onClick={() => setShowRecovery(false)} style={{
          background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer"
        }}>←</button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>Account Recovery</h2>
        <span></span>
      </div>

      <div style={{ padding: "24px 20px" }}>

        {resetSuccess ? (
          // SUCCESS SCREEN
          <div style={{ ...S.card, textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "60px", margin: "0 0 16px" }}>🎉</p>
            <h3 style={{ color: C.success, margin: "0 0 8px" }}>Account Recovered!</h3>
            <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 20px" }}>
              Your PIN has been reset successfully. Login with your new PIN.
            </p>
            <button style={S.btn} onClick={() => {
              resetAll();
              setAuthMode("login");
              setPhone(existingPhone);
            }}>
              Login Now
            </button>
          </div>

        ) : showResetPin ? (
          // RESET PIN SCREEN
          <div style={S.card}>
            <p style={{ fontSize: "30px", textAlign: "center", margin: "0 0 8px" }}>🔑</p>
            <h3 style={{ textAlign: "center", margin: "0 0 4px" }}>Set New PIN</h3>
            <p style={{ color: C.gray, fontSize: "13px", textAlign: "center", margin: "0 0 20px" }}>
              Enter a new 4-digit PIN for your account
            </p>

            {/* PIN Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "20px 0" }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  backgroundColor: i < newPin.length ? C.orange : C.dark,
                  border: `2px solid ${i < newPin.length ? C.orange : C.gray}`
                }} />
              ))}
            </div>

            {/* Number Pad */}
            <div style={S.numpad}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} style={S.numKey}
                  onClick={() => newPin.length < 4 && setNewPin(newPin + n)}>
                  {n}
                </button>
              ))}
              <div></div>
              <button style={S.numKey} onClick={() => newPin.length < 4 && setNewPin(newPin + "0")}>0</button>
              <button style={S.numKey} onClick={() => setNewPin(newPin.slice(0, -1))}>⌫</button>
            </div>

            {otpError && <div style={{ ...S.error, marginTop: "12px" }}>❌ {otpError}</div>}

            <button
              style={{ ...S.btn, marginTop: "16px", backgroundColor: newPin.length === 4 ? C.orange : C.gray }}
              onClick={handleResetPin}
              disabled={newPin.length !== 4 || authLoading}>
              {authLoading ? "⏳ Resetting..." : "Reset PIN"}
            </button>
          </div>

        ) : otpSent ? (
          // ENTER OTP SCREEN
          <div style={S.card}>
            <p style={{ fontSize: "30px", textAlign: "center", margin: "0 0 8px" }}>📱</p>
            <h3 style={{ textAlign: "center", margin: "0 0 4px" }}>Enter OTP</h3>
            <p style={{ color: C.gray, fontSize: "13px", textAlign: "center", margin: "0 0 4px" }}>
              We sent a code to
            </p>
            <p style={{ color: C.orange, fontWeight: "bold", textAlign: "center", margin: "0 0 20px" }}>
              {existingPhone}
            </p>

            <div style={{
              backgroundColor: `${C.gold}11`, border: `1px solid ${C.gold}44`,
              borderRadius: "10px", padding: "10px 14px", marginBottom: "16px"
            }}>
              <p style={{ margin: 0, color: C.gold, fontSize: "12px" }}>
                🧪 Demo Mode: OTP is the last 4 digits of your phone number
              </p>
            </div>

            <input
              style={{ ...S.input, textAlign: "center", fontSize: "24px", letterSpacing: "8px" }}
              placeholder="• • • •"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              type="tel"
              maxLength={4}
            />

            {otpError && <div style={S.error}>❌ {otpError}</div>}

            <button
              style={{ ...S.btn, backgroundColor: enteredOtp.length === 4 ? C.orange : C.gray }}
              onClick={handleVerifyOtp}
              disabled={enteredOtp.length !== 4}>
              Verify OTP
            </button>

            <button
              onClick={handleSendOtp}
              style={{ ...S.btn, backgroundColor: "transparent", border: "none", color: C.gray, marginTop: "8px" }}>
              Resend OTP
            </button>
          </div>

        ) : (
          // SEND OTP SCREEN
          <div style={S.card}>
            <p style={{ fontSize: "30px", textAlign: "center", margin: "0 0 8px" }}>🔐</p>
            <h3 style={{ textAlign: "center", margin: "0 0 4px" }}>Recover Your Account</h3>
            <p style={{ color: C.gray, fontSize: "13px", textAlign: "center", margin: "0 0 20px" }}>
              We will send a one-time password to verify your identity
            </p>

            <div style={{ ...S.card, backgroundColor: C.dark, marginBottom: "16px" }}>
              <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "12px" }}>Phone Number</p>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>{existingPhone}</p>
            </div>

            <button style={S.btn} onClick={handleSendOtp}>
              📱 Send OTP to this number
            </button>

            <button
              onClick={resetAll}
              style={{ ...S.btn, backgroundColor: "transparent", border: "none", color: C.gray, marginTop: "8px" }}>
              ← Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );

  // ============================================
  // NORMAL AUTH SCREEN
  // ============================================
  return (
    <div style={S.wrap}>
      <div style={{
        background: `linear-gradient(135deg, ${C.orange}, ${C.darkOrange})`,
        padding: "50px 20px 30px", textAlign: "center"
      }}>
        <div style={{ fontSize: "50px", marginBottom: "12px" }}>🏦</div>
        <h2 style={{ margin: "0 0 4px", fontSize: "24px" }}>GTBank Trust Engine</h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.8, letterSpacing: "2px" }}>
          SELLING CERTAINTY TO UNCERTAINTY
        </p>
      </div>

      <div style={{ padding: "24px 20px" }}>

        {/* MODE TOGGLE */}
        <div style={{
          display: "flex", backgroundColor: C.dark,
          borderRadius: "12px", padding: "4px", marginBottom: "20px"
        }}>
          {["login", "register"].map(mode => (
            <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(null); }} style={{
              flex: 1, padding: "12px",
              backgroundColor: authMode === mode ? C.orange : "transparent",
              color: C.white, border: "none", borderRadius: "10px",
              fontWeight: "bold", cursor: "pointer", textTransform: "capitalize"
            }}>
              {mode === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div style={S.card}>

          {authMode === "register" && (
            <>
              <label style={{ color: C.gray, fontSize: "12px", marginBottom: "4px", display: "block" }}>
                Full Name *
              </label>
              <input style={S.input} placeholder="e.g. Emeka Obi"
                value={fullName} onChange={e => setFullName(e.target.value)} />
            </>
          )}

          <label style={{ color: C.gray, fontSize: "12px", marginBottom: "4px", display: "block" }}>
            Phone Number *
          </label>
          <input style={S.input} placeholder="08012345678"
            value={phone} onChange={e => setPhone(e.target.value)} type="tel" />

          <label style={{ color: C.gray, fontSize: "12px", marginBottom: "4px", display: "block" }}>
            4-digit PIN *
          </label>
          <input style={S.input} placeholder="••••"
            value={authPin}
            onChange={e => setAuthPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            type="password" maxLength={4} />

          {authError && <div style={S.error}>❌ {authError}</div>}

          <button
            style={{ ...S.btn, backgroundColor: authLoading ? C.gray : C.orange }}
            onClick={handleAuth} disabled={authLoading}>
            {authLoading ? "⏳ Please wait..."
              : authMode === "register" ? "Create Account" : "Login"}
          </button>

        </div>
      </div>
    </div>
  );
}
