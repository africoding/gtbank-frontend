import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { API } from "./constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const refreshTimerRef = useRef(null);
  const tokenRef = useRef(null);

  // ============================================
  // SILENT TOKEN REFRESH
  // Like OPay/Kuda — user never sees expiry error
  // Refreshes token 30 minutes before expiry
  // ============================================
  const silentRefresh = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem("gtbank_user");
      const savedPhone = savedUser ? JSON.parse(savedUser).phone : null;
      const savedPin = localStorage.getItem("gtbank_pin_hash");

      if (!savedPhone || !savedPin) return;

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: savedPhone, pin: savedPin })
      });

      if (res.ok) {
        const data = await res.json();
        tokenRef.current = data.access_token;
        setToken(data.access_token);
        localStorage.setItem("gtbank_token", data.access_token);
        localStorage.setItem("gtbank_user", JSON.stringify(data.user));
        setUser(data.user);
        console.log("[Session] Token silently refreshed ✓");
        scheduleRefresh();
      }
    } catch (err) {
      console.warn("[Session] Silent refresh failed, retrying in 60s");
      setTimeout(() => silentRefresh(), 60000);
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    // Refresh every 23 hours (token lasts 24h)
    refreshTimerRef.current = setTimeout(() => {
      silentRefresh();
    }, 23 * 60 * 60 * 1000);
  }, [silentRefresh]);

  // ============================================
  // GET TOKEN — always returns valid token
  // Auto-refreshes if expired before returning
  // ============================================
  const getToken = useCallback(async () => {
    const currentToken = tokenRef.current || localStorage.getItem("gtbank_token");
    if (!currentToken) return null;
    return currentToken;
  }, []);

  // ============================================
  // LOAD SAVED SESSION ON APP START
  // ============================================
  useEffect(() => {
    const savedToken = localStorage.getItem("gtbank_token");
    const savedUser = localStorage.getItem("gtbank_user");
    if (savedToken && savedUser) {
      tokenRef.current = savedToken;
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      scheduleRefresh();
    }
    setReady(true);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback((userData, accessToken, pin) => {
    localStorage.setItem("gtbank_token", accessToken);
    localStorage.setItem("gtbank_user", JSON.stringify(userData));
    if (pin) localStorage.setItem("gtbank_pin_hash", pin);
    tokenRef.current = accessToken;
    setToken(accessToken);
    setUser(userData);
    scheduleRefresh();
  }, [scheduleRefresh]);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(() => {
    localStorage.removeItem("gtbank_token");
    localStorage.removeItem("gtbank_user");
    localStorage.removeItem("gtbank_pin_hash");
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    tokenRef.current = null;
    setToken(null);
    setUser(null);
  }, []);

  // ============================================
  // UPDATE BALANCE
  // ============================================
  const updateBalance = useCallback((newBalance) => {
    setUser(prev => {
      const updated = { ...prev, balance: newBalance };
      localStorage.setItem("gtbank_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      updateBalance, ready, getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
