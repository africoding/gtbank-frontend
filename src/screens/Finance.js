import { useState } from "react";
import { useAuth } from "../AuthContext";
import { COLORS as C } from "../constants";
import { S } from "../styles";

const SAVINGS_GOALS = [
  { id: 1, name: "Emergency Fund", target: 50000, saved: 15000, icon: "🛡️", color: "#10B981" },
  { id: 2, name: "New Phone", target: 200000, saved: 45000, icon: "📱", color: "#F47920" },
  { id: 3, name: "School Fees", target: 150000, saved: 90000, icon: "🎓", color: "#EEB211" }
];

export default function Finance({ setScreen }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("savings");
  const [goals, setGoals] = useState(SAVINGS_GOALS);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanApplied, setLoanApplied] = useState(false);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  const addGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    setGoals(prev => [...prev, {
      id: Date.now(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      saved: 0,
      icon: "🎯",
      color: C.orange
    }]);
    setNewGoalName("");
    setNewGoalTarget("");
    setShowNewGoal(false);
  };

  return (
    <div style={{ ...S.wrap, paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{ backgroundColor: C.dark, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setScreen("dashboard")} style={{
            background: "none", border: "none", color: C.white, fontSize: "22px", cursor: "pointer"
          }}>←</button>
          <h2 style={{ margin: 0, fontSize: "16px" }}>Finance</h2>
          <span></span>
        </div>

        {/* TAB TOGGLE */}
        <div style={{
          display: "flex", backgroundColor: "#1a2a4a",
          borderRadius: "12px", padding: "4px", marginTop: "16px"
        }}>
          {["savings", "loans"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "10px",
              backgroundColor: activeTab === tab ? C.orange : "transparent",
              color: C.white, border: "none", borderRadius: "10px",
              fontWeight: "bold", cursor: "pointer", textTransform: "capitalize"
            }}>{tab === "savings" ? "💰 Savings" : "💳 Loans"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {/* SAVINGS TAB */}
        {activeTab === "savings" && (
          <>
            {/* Summary Card */}
            <div style={{
              ...S.card,
              background: `linear-gradient(135deg, ${C.navy}, #1a3a6a)`,
              border: `1px solid ${C.orange}44`
            }}>
              <p style={{ margin: "0 0 8px", color: C.gray, fontSize: "13px" }}>Total Savings</p>
              <h2 style={{ margin: "0 0 4px", color: C.orange, fontSize: "28px" }}>
                ₦{totalSaved.toLocaleString()}
              </h2>
              <p style={{ margin: "0 0 12px", color: C.gray, fontSize: "12px" }}>
                of ₦{totalTarget.toLocaleString()} target
              </p>
              <div style={{ backgroundColor: "#1a2a4a", borderRadius: "10px", height: "8px" }}>
                <div style={{
                  backgroundColor: C.orange, borderRadius: "10px",
                  height: "8px", width: `${Math.round((totalSaved/totalTarget)*100)}%`
                }} />
              </div>
              <p style={{ margin: "8px 0 0", color: C.gold, fontSize: "12px" }}>
                Earning 6% interest annually 🎯
              </p>
            </div>

            {/* Goals */}
            {goals.map(goal => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              return (
                <div key={goal.id} style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        backgroundColor: `${goal.color}22`,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "22px"
                      }}>{goal.icon}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{goal.name}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: C.gray }}>
                          ₦{goal.saved.toLocaleString()} / ₦{goal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: goal.color, fontWeight: "bold" }}>{pct}%</span>
                  </div>
                  <div style={{ backgroundColor: "#1a2a4a", borderRadius: "10px", height: "6px" }}>
                    <div style={{
                      backgroundColor: goal.color, borderRadius: "10px",
                      height: "6px", width: `${pct}%`
                    }} />
                  </div>
                  <button style={{
                    ...S.btn, marginTop: "12px", padding: "10px",
                    fontSize: "13px", backgroundColor: goal.color
                  }}>
                    + Add Money to Goal
                  </button>
                </div>
              );
            })}

            {/* Add New Goal */}
            {showNewGoal ? (
              <div style={S.card}>
                <p style={{ margin: "0 0 12px", fontWeight: "bold", color: C.orange }}>New Savings Goal</p>
                <input style={S.input} placeholder="Goal name (e.g. New Car)"
                  value={newGoalName} onChange={e => setNewGoalName(e.target.value)} />
                <input style={S.input} placeholder="Target amount (₦)"
                  value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} type="number" />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ ...S.btn, flex: 1, marginTop: 0 }} onClick={addGoal}>Create Goal</button>
                  <button style={{ ...S.btn, flex: 1, marginTop: 0, backgroundColor: C.gray }}
                    onClick={() => setShowNewGoal(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button style={{ ...S.btn, backgroundColor: "transparent", border: `2px solid ${C.orange}`, color: C.orange }}
                onClick={() => setShowNewGoal(true)}>
                + Create New Savings Goal
              </button>
            )}
          </>
        )}

        {/* LOANS TAB */}
        {activeTab === "loans" && (
          <>
            {loanApplied ? (
              <div style={{ ...S.card, textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: "60px", margin: "0 0 16px" }}>🎉</p>
                <h3 style={{ color: C.success, margin: "0 0 8px" }}>Application Submitted!</h3>
                <p style={{ color: C.gray, fontSize: "13px" }}>
                  Your loan application for ₦{parseFloat(loanAmount).toLocaleString()} is under review.
                  We'll notify you within 24 hours.
                </p>
                <button style={{ ...S.btn, marginTop: "20px" }} onClick={() => setLoanApplied(false)}>
                  Apply for Another
                </button>
              </div>
            ) : (
              <>
                {/* Loan Eligibility */}
                <div style={{
                  ...S.card,
                  background: `linear-gradient(135deg, ${C.navy}, #1a3a6a)`,
                  border: `1px solid ${C.orange}44`
                }}>
                  <p style={{ margin: "0 0 4px", color: C.gray, fontSize: "13px" }}>Loan Eligibility</p>
                  <h2 style={{ margin: "0 0 4px", color: C.orange }}>₦50,000</h2>
                  <p style={{ margin: "0 0 12px", color: C.gray, fontSize: "12px" }}>
                    Based on your account activity
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1, backgroundColor: C.dark, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                      <p style={{ margin: 0, color: C.gold, fontWeight: "bold" }}>5%</p>
                      <p style={{ margin: 0, color: C.gray, fontSize: "11px" }}>Interest Rate</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: C.dark, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                      <p style={{ margin: 0, color: C.gold, fontWeight: "bold" }}>30 days</p>
                      <p style={{ margin: 0, color: C.gray, fontSize: "11px" }}>Max Duration</p>
                    </div>
                  </div>
                </div>

                {/* Loan Form */}
                <div style={S.card}>
                  <p style={{ margin: "0 0 16px", fontWeight: "bold", color: C.orange }}>
                    💳 Apply for Loan
                  </p>
                  <label style={{ color: C.gray, fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Loan Amount
                  </label>
                  <input style={S.input} placeholder="Enter amount (max ₦50,000)"
                    value={loanAmount} onChange={e => setLoanAmount(e.target.value)} type="number" />
                  <label style={{ color: C.gray, fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Purpose
                  </label>
                  <select style={S.select} value={loanPurpose} onChange={e => setLoanPurpose(e.target.value)}>
                    <option value="">Select purpose</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="medical">Medical</option>
                    <option value="personal">Personal</option>
                  </select>
                  <button style={{
                    ...S.btn,
                    backgroundColor: loanAmount && loanPurpose ? C.orange : C.gray
                  }} onClick={() => {
                    if (loanAmount && loanPurpose) setLoanApplied(true);
                  }}>
                    Apply Now
                  </button>
                </div>
              </>
            )}
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
          <button key={item.label} style={S.navBtn(item.label === "Finance")} onClick={item.action}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
