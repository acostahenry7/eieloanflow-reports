import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AuthContext } from "./contexts/AuthContext";
import { SidebarContext } from "./contexts/SidebarContext";
import { TopNavbar } from "./components/TopNavbar";
import { Sidebar } from "./components/Sidebar";
import { CustomerReportScreen } from "./screens/CustomerReportScreen";

function App() {
  const { token, logout } = React.useContext(AuthContext);
  const { isSidebarOpened } = React.useContext(SidebarContext);

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <div className="App">
      <TopNavbar />
      <div className="main">
        <Router>
          <Sidebar />
          <div className={`content ${isSidebarOpened ? "opened" : "closed"}`}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route
                path="/reports/arrear-customers"
                element={<CustomerReportScreen />}
              />
            </Routes>
          </div>
        </Router>
      </div>
      {/* <p onClick={() => logout()}>Logout</p> */}
    </div>
  );
}

export default App;
