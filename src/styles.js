import { COLORS as C } from "./constants";

export const S = {
  wrap: { backgroundColor: C.navy, minHeight: "100vh", maxWidth: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif", color: C.white },
  input: { width: "100%", padding: "14px", backgroundColor: C.dark, border: "none", borderBottom: `2px solid ${C.orange}`, color: C.white, fontSize: "16px", marginBottom: "16px", boxSizing: "border-box", outline: "none" },
  select: { width: "100%", padding: "14px", backgroundColor: C.dark, border: "none", borderBottom: `2px solid ${C.orange}`, color: C.white, fontSize: "16px", marginBottom: "16px", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "18px", backgroundColor: C.orange, color: C.white, border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  card: { backgroundColor: C.card, borderRadius: "16px", padding: "20px", marginBottom: "16px" },
  error: { color: C.error, fontSize: "13px", marginBottom: "12px", padding: "10px", backgroundColor: "#2d0a0a", borderRadius: "8px", borderLeft: `3px solid ${C.error}` },
  quickGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" },
  quickBtn: { padding: "12px", backgroundColor: C.dark, color: C.white, border: `1px solid ${C.orange}`, borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontWeight: "bold" },
  numpad: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "20px" },
  numKey: { padding: "18px", backgroundColor: C.dark, color: C.white, border: "none", borderRadius: "12px", fontSize: "20px", fontWeight: "bold", cursor: "pointer" },
  pinDot: (f) => ({ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: f ? C.orange : C.dark, border: `2px solid ${f ? C.orange : C.gray}` }),
  feeRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px", borderBottom: "1px solid #1a2a4a" },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "400px", backgroundColor: C.dark, display: "flex", justifyContent: "space-around", padding: "10px 0 16px", borderTop: `2px solid ${C.orange}` },
  navBtn: (a) => ({ background: "none", border: "none", color: a ? C.orange : C.gray, fontSize: "11px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" })
};
