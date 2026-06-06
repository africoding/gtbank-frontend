import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { API, COLORS as C } from "../constants";
import { S } from "../styles";

export default function QRScanner({ setScreen }) {
  const { user, getToken } = useAuth();
  const [mode, setMode] = useState("show");

  // ── Scan states ──
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState("scan"); // scan → confirm → pin → result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Share QR states ──
  const [shared, setShared] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Generate a simple but unique QR pattern from phone number
  const getQRPattern = (phone) => {
    if (!phone) return Array(49).fill(false);
    return Array.from({ length: 49 }).map((_, i) => {
      const corners = [0,1,2,7,8,9,14,15,16,32,33,34,39,40,41,46,47,48];
      const seed = phone.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      return corners.includes(i) || ((i * seed) % 5 === 0) || (i % 7 === 0);
    });
  };

  const qrPattern = getQRPattern(user?.phone);

  // Stop camera when leaving scan mode
  useEffect(() => {
    if (mode !== "scan") stopCamera();
    return () => stopCamera();
  }, [mode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const openCamera = async () => {
    setCameraError(null);
    setScannedUser(null);
    setStep("scan");
    setAmount("");
    setPin("");
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);

      // Simulate scanning after 3 seconds for demo
      // In production replace this with a real QR library like jsQR
      setTimeout(() => simulateScan(), 3000);

    } catch (err) {
      if (err.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
      } else {
        setCameraError("Could not open camera. Try again or use a different browser.");
      }
    }
  };

  // Simulates finding a QR code — replace with jsQR in production
  const simulateScan = async () => {
    stopCamera();
    // For demo: look up a test account
    try {
      const testPhone = "08012345678";
      const res = await fetch(`${API}/account/lookup/${testPhone}`);
      const data = await res.json();
      if (res.ok) {
        setScannedUser(data);
        setStep("confirm");
      } else {
        setCameraError("No valid QR code found. Try again.");
      }
    } catch (e) {
      setCameraError("Could not read QR code. Try again.");
    }
  };

  const handleTransfer = async () => {
    if (pin.length !== 4) { setError("Enter your 4-digit PIN"); return; }
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 10) { setError("Minimum amount is ₦10"); return; }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`${API}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient: scannedUser.account_number,
          amount: numAmount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Pay me via GTBank",
      text: `Send money to ${user?.full_name} (${user?.phone}) on GTBank Trust Engine`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } else {
        await navigator.clipboard.writeText(`Pay ${user?.full_name} — Account: ${user?.phone} on GTBank Trust Engine`);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      }
    } catch (e) {}
  };

  const reset = () => {
    setStep("scan");
    setScannedUser(null);
    setAmount("");
    setPin("");
    setResult(null);
    setError(null);
    setCameraError(null);
  };

  const numAmount = parseFloat(amount || 0);
  const fee = numAmount < 5000 ? 0 : numAmount <= 50000 ? 10 : 50;

  return (
    <div style={S.wrap}>

      {/* HEADER */}
      <div style={{
        backgroundColor: C.dark, padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={() => {
            stopCamera();
            step !== "scan" ? reset() : setScreen("dashboard");
          }}
          style={{ background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer" }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "16px" }}>QR Code</h2>
        <span></span>
      </div>

      {/* MODE TOGGLE */}
      <div style={{ display: "flex", backgroundColor: C.dark, padding: "4px 16px", gap: "4px" }}>
        {[
          { key: "show", label: "My QR Code" },
          { key: "scan", label: "Scan QR Code" }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => { reset(); setMode(item.key); }}
            style={{
              flex: 1, padding: "12px",
              backgroundColor: mode === item.key ? C.orange : "transparent",
              color: C.white, border: "none", borderRadius: "10px",
              fontWeight: "bold", cursor: "pointer"
            }}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>

        {/* ── MY QR CODE ── */}
        {mode === "show" && (
          <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
            <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 20px" }}>
              Show this QR code to receive money instantly
            </p>

            <div style={{
              width: "200px", height: "200px", backgroundColor: C.white,
              borderRadius: "16px", margin: "0 auto 20px", padding: "16px",
              display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px"
            }}>
              {qrPattern.map((filled, i) => (
                <div key={i} style={{
                  backgroundColor: filled ? "#003057" : "#ffffff",
                  borderRadius: "1px"
                }} />
              ))}
            </div>

            <h3 style={{ margin: "0 0 4px", color: C.orange, fontSize: "18px" }}>
              {user?.full_name?.toUpperCase()}
            </h3>
            <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>
              {user?.phone}
            </p>
            <p style={{ margin: "0 0 20px", color: C.gray, fontSize: "12px" }}>
              GTBank Trust Engine
            </p>

            <button
              onClick={handleShare}
              style={{ ...S.btn, marginTop: 0, backgroundColor: shared ? C.success : C.orange }}>
              {shared ? "✅ Link Copied!" : "📤 Share QR Code"}
            </button>
          </div>
        )}

        {/* ── SCAN QR CODE ── */}
        {mode === "scan" && (
          <>
            {/* STEP: SCAN */}
            {step === "scan" && (
              <div style={{ ...S.card, textAlign: "center", padding: "30px 20px" }}>
                <p style={{ color: C.gray, fontSize: "13px", margin: "0 0 20px" }}>
                  Point camera at a GTBank QR code to pay instantly
                </p>

                {/* Camera view or placeholder */}
                <div style={{
                  width: "240px", height: "240px", margin: "0 auto 20px",
                  position: "relative", borderRadius: "16px", overflow: "hidden",
                  backgroundColor: C.dark,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {scanning && (
                    <video ref={videoRef} style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%", objectFit: "cover"
                    }} muted playsInline />
                  )}

                  {/* Corner markers */}
                  {[
                    { top:"10px", left:"10px", borderTop:`3px solid ${C.orange}`, borderLeft:`3px solid ${C.orange}` },
                    { top:"10px", right:"10px", borderTop:`3px solid ${C.orange}`, borderRight:`3px solid ${C.orange}` },
                    { bottom:"10px", left:"10px", borderBottom:`3px solid ${C.orange}`, borderLeft:`3px solid ${C.orange}` },
                    { bottom:"10px", right:"10px", borderBottom:`3px solid ${C.orange}`, borderRight:`3px solid ${C.orange}` }
                  ].map((corner, i) => (
                    <div key={i} style={{ position:"absolute", width:"28px", height:"28px", ...corner }} />
                  ))}

                  {/* Scanning line animation */}
                  {scanning && (
                    <div style={{
                      position: "absolute", left: 0, right: 0,
                      height: "2px", background: C.orange,
                      animation: "scanline 1.5s linear infinite",
                      top: "50%"
                    }} />
                  )}

                  {!scanning && (
                    <div>
                      <p style={{ fontSize: "40px", margin: "0 0 8px" }}>📷</p>
                      <p style={{ color: C.gray, fontSize: "12px", margin: 0 }}>
                        Tap below to open camera
                      </p>
                    </div>
                  )}

                  {scanning && (
                    <div style={{
                      position: "absolute", bottom: "10px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      padding: "4px 10px", borderRadius: "6px"
                    }}>
                      <p style={{ color: C.orange, fontSize: "11px", margin: 0 }}>
                        🔍 Scanning...
                      </p>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div style={{ ...S.error, marginBottom: "12px" }}>
                    ❌ {cameraError}
                  </div>
                )}

                <button
                  style={{ ...S.btn, backgroundColor: scanning ? C.gray : C.orange }}
                  onClick={scanning ? stopCamera : openCamera}
                  disabled={scanning}>
                  {scanning ? "⏳ Scanning..." : "📷 Open Camera"}
                </button>

                <style>{`
                  @keyframes scanline {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                  }
                `}</style>
              </div>
            )}

            {/* STEP: CONFIRM + AMOUNT */}
            {step === "confirm" && scannedUser && (
              <div style={S.card}>
                <div style={{
                  backgroundColor: `${C.success}22`,
                  border: `1px solid ${C.success}`,
                  borderRadius: "12px", padding: "16px", marginBottom: "16px",
                  display: "flex", alignItems: "center", gap: "12px"
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    backgroundColor: C.orange, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: "18px", color: C.white
                  }}>
                    {scannedUser.account_name?.[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", color: C.white }}>
                      {scannedUser.account_name?.toUpperCase()}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>
                      {scannedUser.account_number} • {scannedUser.bank}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.success }}>
                      ✅ QR Code Verified
                    </p>
                  </div>
                </div>

                <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 6px" }}>
                  Enter Amount
                </p>
                <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
                  ₦ {amount || "0"}<span style={{ color: C.gray }}>.00</span>
                </div>
                <input
                  style={S.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  type="number"
                />

                {numAmount >= 10 && (
                  <div style={{ marginBottom: "12px" }}>
                    <div style={S.feeRow}>
                      <span style={{ color: C.gray }}>Amount</span>
                      <span>₦{numAmount.toLocaleString()}</span>
                    </div>
                    <div style={S.feeRow}>
                      <span style={{ color: C.gray }}>Fee</span>
                      <span style={{ color: fee === 0 ? C.success : C.white }}>
                        {fee === 0 ? "Free" : `₦${fee}`}
                      </span>
                    </div>
                  </div>
                )}

                {error && <div style={S.error}>{error}</div>}

                <button
                  style={{ ...S.btn, backgroundColor: numAmount >= 10 ? C.orange : C.gray }}
                  onClick={() => {
                    if (numAmount < 10) { setError("Minimum amount is ₦10"); return; }
                    setError(null);
                    setStep("pin");
                  }}>
                  Continue
                </button>
              </div>
            )}

            {/* STEP: PIN */}
            {step === "pin" && (
              <div style={S.card}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <p style={{ color: C.gray }}>Confirm transfer of</p>
                  <h2 style={{ color: C.orange, margin: "4px 0", fontSize: "32px" }}>
                    ₦{numAmount.toLocaleString()}
                  </h2>
                  <p style={{ color: C.gray, fontSize: "13px" }}>
                    to {scannedUser?.account_name?.toUpperCase()}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "24px 0" }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={S.pinDot(i < pin.length)} />
                  ))}
                </div>

                {error && <div style={S.error}>{error}</div>}

                <div style={S.numpad}>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} style={S.numKey}
                      onClick={() => pin.length < 4 && setPin(pin + n)}>
                      {n}
                    </button>
                  ))}
                  <div></div>
                  <button style={S.numKey}
                    onClick={() => pin.length < 4 && setPin(pin + "0")}>0</button>
                  <button style={S.numKey}
                    onClick={() => setPin(pin.slice(0, -1))}>⌫</button>
                </div>

                <button
                  style={{
                    ...S.btn, marginTop: "20px",
                    backgroundColor: loading ? C.gray : pin.length === 4 ? C.orange : C.gray
                  }}
                  onClick={handleTransfer}
                  disabled={loading || pin.length !== 4}>
                  {loading ? "⏳ Processing..." : "Confirm Transfer"}
                </button>
              </div>
            )}

            {/* STEP: RESULT */}
            {step === "result" && result && (
              <div style={{ textAlign: "center", paddingTop: "20px" }}>
                <div style={{ fontSize: "80px", marginBottom: "16px" }}>
                  {result.status === "success" ? "✅" : "❌"}
                </div>
                <h2 style={{ color: result.status === "success" ? C.success : C.error }}>
                  {result.status === "success" ? "Transfer Successful!" : "Transfer Failed"}
                </h2>
                <p style={{ color: C.gray }}>{result.message}</p>

                <div style={{ ...S.card, backgroundColor: "#064e1b", textAlign: "center" }}>
                  <p style={{ color: C.gray, fontSize: "12px", margin: "0 0 4px" }}>Reference</p>
                  <p style={{ color: C.success, fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                    {result.reference}
                  </p>
                </div>

                <button style={{ ...S.btn, marginTop: "16px" }} onClick={reset}>
                  Scan Another
                </button>
                <button
                  style={{ ...S.btn, marginTop: "8px", backgroundColor: C.dark }}
                  onClick={() => setScreen("dashboard")}>
                  Back to Dashboard
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}