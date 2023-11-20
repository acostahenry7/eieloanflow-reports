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
import { TodayPaymentScreen } from "./screens/TodayPaymentScreen";
import { CanceledPaymentScreen } from "./screens/CanceledPaymentScreen";
import { LoanDetailScreen } from "./screens/LoanDetailScreen";
import { ReceivedPaymentScreen } from "./screens/ReceivedPaymentScreen";
import { PaymentProyectionScreen } from "./screens/PaymentProyectionScreen";
import { PaymentControlHistoryScreen } from "./screens/PaymentControlHistoryScreen";
import { LoanActivitiesScreen } from "./screens/LoanActiviesScreen";
import { LoanDiscountsScreen } from "./screens/LoanDiscountsScreen";
import { RegisterCloseScreen } from "./screens/RegisterCloseScreen";
import { GeneralBalanceScreen } from "./screens/GeneralBalanceScreen";
import { ResultStatusScreen } from "./screens/ResultStatusScreen";
import { CollectorVisitsScreen } from "./screens/CollectorVisitsScreen";

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
              <Route
                path="/reports/today-payments"
                element={<TodayPaymentScreen />}
              />
              <Route
                path="/reports/canceled-payments"
                element={<CanceledPaymentScreen />}
              />
              <Route
                path="/reports/received-payments"
                element={<ReceivedPaymentScreen />}
              />
              <Route
                path="/reports/payment-proyection"
                element={<PaymentProyectionScreen />}
              />
              <Route
                path="/reports/payment-control-history"
                element={<PaymentControlHistoryScreen />}
              />
              <Route
                path="/reports/loan-detail"
                element={<LoanDetailScreen />}
              />
              <Route
                path="/reports/loan-activities"
                element={<LoanActivitiesScreen />}
              />
              <Route
                path="/reports/register-close"
                element={<RegisterCloseScreen />}
              />
              <Route
                path="/reports/loan-discounts"
                element={<LoanDiscountsScreen />}
              />
              <Route
                path="/reports/accounting-general-balance"
                element={<GeneralBalanceScreen />}
              />
              <Route
                path="/reports/accounting-result-status"
                element={<ResultStatusScreen />}
              />
              <Route
                path="/reports/payment-visits"
                element={<CollectorVisitsScreen />}
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
