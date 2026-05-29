import { useState } from "react";
import { AuthProvider } from "./AuthContext";
import Splash from "./screens/Splash";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";
import Transfer from "./screens/Transfer";
import History from "./screens/History";
import Profile from "./screens/Profile";

function AppContent() {
  const [screen, setScreen] = useState("splash");

  const screens = {
    splash: <Splash setScreen={setScreen} />,
    auth: <Auth setScreen={setScreen} />,
    dashboard: <Dashboard setScreen={setScreen} />,
    transfer: <Transfer setScreen={setScreen} />,
    history: <History setScreen={setScreen} />,
    profile: <Profile setScreen={setScreen} />
  };

  return screens[screen] || screens["dashboard"];
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
