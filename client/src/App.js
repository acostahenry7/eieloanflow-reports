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
import { ValidationBalanceScreen } from "./screens/ValidationBalanceScreen";
import { DGI606Screen } from "./screens/DGI606Screen";
import { DGI607Screen } from "./screens/DGI607Screen";
import { GeneralMajor } from "./screens/GeneralMajor";
import { DetailedGeneralMajor } from "./screens/DetailedGeneralMajor";
import { PaidMoraScreen } from "./screens/PaidMoraScreen";
import { ReceiptsDetailScreen } from "./screens/ReceiptsDetailScreen";
import { LoanApplicationScreen } from "./screens/LoanApplicationScreen";
import { AccountCatalogSCreen } from "./screens/AccountCatalogScreen";
import { DatacreditScreen } from "./screens/DatacreditScreen";
import { LoanMovementScreen } from "./screens/LoanMovementScreen";
import { AmortizationTableScreen } from "./screens/AmortizationTableScreen";
import { CollectorCommissionScreen } from "./screens/CollectorCommissionScreen";
import { ToChargeAccountScreen } from "./screens/ToChargeAccountScreen";
import { EmployeeScreen } from "./screens/EmployeeScreen";
import { AccountPayableScren } from "./screens/AccountPayableScreen";
import { PaidInterestScreen } from "./screens/PaidInterestScreen";

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
              <Route path="/reports/paid-mora" element={<PaidMoraScreen />} />
              <Route
                path="/reports/receipt-detail"
                element={<ReceiptsDetailScreen />}
              />
              <Route
                path="/reports/loan-application"
                element={<LoanApplicationScreen />}
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
                path="/reports/loan-movement"
                element={<LoanMovementScreen />}
              />
              <Route
                path="/reports/loan-discounts"
                element={<LoanDiscountsScreen />}
              />
              <Route
                path="/reports/datacredit"
                element={<DatacreditScreen />}
              />
              <Route
                path="/reports/loan-amortization"
                element={<AmortizationTableScreen />}
              />
              <Route
                path="/reports/accounting-catalog"
                element={<AccountCatalogSCreen />}
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
              <Route
                path="/reports/accouting-validation-balance"
                element={<ValidationBalanceScreen />}
              />
              <Route path="/reports/accouting-606" element={<DGI606Screen />} />
              <Route path="/reports/accouting-607" element={<DGI607Screen />} />
              <Route
                path="/reports/accouting-major-general"
                element={<GeneralMajor />}
              />

              <Route
                path="/reports/accounting-account-payable"
                element={<AccountPayableScren />}
              />
              <Route
                path="/reports/charge-account"
                element={<ToChargeAccountScreen />}
              />
              <Route
                path="/reports/paid-interest"
                element={<PaidInterestScreen />}
              />
              <Route
                path="/reports/detailed-accouting-major-general"
                element={<DetailedGeneralMajor />}
              />
              <Route
                path="/reports/rrhh-employees"
                element={<EmployeeScreen />}
              />
              <Route
                path="/reports/rrhh-collector-commission"
                element={<CollectorCommissionScreen />}
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
