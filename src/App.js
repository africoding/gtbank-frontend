import { useState } from "react";
import { AuthProvider } from "./AuthContext";
import Splash from "./screens/Splash";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";
import Transfer from "./screens/Transfer";
import History from "./screens/History";
import Profile from "./screens/Profile";
import AddMoney from "./screens/AddMoney";
import Notifications from "./screens/Notifications";
import Help from "./screens/Help";
import QRScanner from "./screens/QRScanner";
import Rewards from "./screens/Rewards";
import Finance from "./screens/Finance";
import Cards from "./screens/Cards";

function AppContent() {
  const [screen, setScreen] = useState("splash");

  const screens = {
    splash:        <Splash setScreen={setScreen} />,
    auth:          <Auth setScreen={setScreen} />,
    dashboard:     <Dashboard setScreen={setScreen} />,
    transfer:      <Transfer setScreen={setScreen} />,
    history:       <History setScreen={setScreen} />,
    profile:       <Profile setScreen={setScreen} />,
    addmoney:      <AddMoney setScreen={setScreen} />,
    notifications: <Notifications setScreen={setScreen} />,
    help:          <Help setScreen={setScreen} />,
    qrscanner:     <QRScanner setScreen={setScreen} />,
    rewards:       <Rewards setScreen={setScreen} />,
    finance:       <Finance setScreen={setScreen} />,
    cards:         <Cards setScreen={setScreen} />
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
