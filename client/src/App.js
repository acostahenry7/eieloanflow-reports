import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import { CustomerLoanScreen } from "./screens/CustomerLoanScreen";
import { GroupedRegisterCloseScreen } from "./screens/GroupedRegisterCloseScreen";
import { BoxMajorScreen } from "./screens/BoxMajorScreen";
import { LoanRequest } from "./screens/Dashboards/LoanRequest";
import { LoanDash } from "./screens/Dashboards/Loan";
import { validateifUserHasAccess } from "./utils/auth-helpers";
import { NoAccessMessage } from "./components/NoAccessMessage";
import { AccountingDash } from "./screens/Dashboards/AccountingDash";
import { MantainingMessage } from "./components/MantainingMessage";
import { PaymentsDash } from "./screens/Dashboards/Payments";
import { AccountingConciliation } from "./screens/AccountingConciliation";
import { ToChargeAccountAgedScreen } from "./screens/ToChargeAccountAgedScreen";
import { CustomerAccountScreen } from "./screens/CustomerAccountScreen";
import { HolidaysScreen } from "./screens/HolidaysScreen";
import { EmployeeLoanScreen } from "./screens/EmployeeLoanScreen";

function App() {
  const { token, auth, logout } = React.useContext(AuthContext);
  const { isSidebarOpened } = React.useContext(SidebarContext);

  if (!token) {
    return <LoginScreen />;
  }

  let checkRole = (moduleRole, component) => {
    if (
      validateifUserHasAccess(moduleRole, auth.allowed_modules) ||
      auth.role_name == "ROLE_ADMIN"
    ) {
      return component;
    } else {
      return component;
      //return <NoAccessMessage role={moduleRole} />;
    }
  };

  return (
    <div className="App">
      <TopNavbar />
      <div className="main">
        <Router>
          <Sidebar />
          <div className={`content ${isSidebarOpened ? "opened" : "closed"}`}>
            <Routes>
              <Route path="/" element={<LoanRequest />} />
              <Route
                path="/dash/loan-requests"
                element={checkRole(
                  "DASHBOARD_LOAN_APPLICATION",
                  <LoanRequest />
                )}
              />
              <Route
                path="/dash/loan"
                element={checkRole("DASHBOARD_LOAN", <LoanDash />)}
              />
              <Route
                path="/dash/accounting"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <AccountingDash />
                  // <MantainingMessage />
                )}
              />
              <Route
                path="/dash/payments"
                element={checkRole("REPORT_PAYMENTS", <PaymentsDash />)}
              />
              <Route
                path="/reports/arrear-customers"
                element={checkRole("CUSTOMERS", <CustomerReportScreen />)}
              />
              <Route
                path="/reports/customer-loan"
                element={checkRole("CUSTOMERS", <CustomerLoanScreen />)}
              />
              <Route
                path="/reports/customer-account-status"
                element={checkRole("CUSTOMERS", <CustomerAccountScreen />)}
              />

              <Route
                path="/reports/register-close"
                element={checkRole(
                  "REPORT_REGISTER_CLOSE",
                  <RegisterCloseScreen />
                )}
              />
              <Route
                path="/reports/grouped-register-close"
                element={checkRole(
                  "REPORT_REGISTER_CLOSE",
                  <GroupedRegisterCloseScreen />
                )}
              />
              <Route
                path="/reports/today-payments"
                element={checkRole("REPORT_PAYMENTS", <TodayPaymentScreen />)}
              />
              <Route
                path="/reports/canceled-payments"
                element={checkRole(
                  "REPORT_PAYMENTS",
                  <CanceledPaymentScreen />
                )}
              />
              <Route
                path="/reports/received-payments"
                element={checkRole(
                  "REPORT_PAYMENTS",
                  <ReceivedPaymentScreen />
                )}
              />
              <Route
                path="/reports/payment-proyection"
                element={checkRole(
                  "REPORT_PAYMENTS",
                  <PaymentProyectionScreen />
                )}
              />
              <Route
                path="/reports/payment-control-history"
                element={checkRole(
                  "REPORT_PAYMENTS",
                  <PaymentControlHistoryScreen />
                )}
              />
              <Route
                path="/reports/paid-mora"
                element={checkRole("REPORT_PAYMENTS", <PaidMoraScreen />)}
              />
              <Route
                path="/reports/payment-visits"
                element={checkRole(
                  "REPORT_PAYMENTS",
                  <CollectorVisitsScreen />
                )}
              />

              <Route
                path="/reports/loan-application"
                element={checkRole(
                  "LOAN_APPLICATIONS",
                  <LoanApplicationScreen />
                )}
              />
              <Route
                path="/reports/loan-detail"
                element={checkRole("LOANS", <LoanDetailScreen />)}
              />
              <Route
                path="/reports/loan-activities"
                element={checkRole("LOANS", <LoanActivitiesScreen />)}
              />

              <Route
                path="/reports/loan-movement"
                element={checkRole("LOANS", <LoanMovementScreen />)}
              />
              <Route
                path="/reports/loan-discounts"
                element={checkRole("LOANS", <LoanDiscountsScreen />)}
              />
              <Route
                path="/reports/datacredit"
                element={checkRole("REPORT_CREDIT_DATA", <DatacreditScreen />)}
              />
              <Route
                path="/reports/loan-amortization"
                element={checkRole("LOANS", <AmortizationTableScreen />)}
              />

              <Route
                path="/reports/accounting-catalog"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <AccountCatalogSCreen />
                )}
              />
              <Route
                path="/reports/accounting-general-balance"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <GeneralBalanceScreen />
                )}
              />
              <Route
                path="/reports/accounting-result-status"
                element={checkRole("ACCOUNT_CATALOGS", <ResultStatusScreen />)}
              />

              <Route
                path="/reports/accouting-validation-balance"
                element={checkRole(
                  "REPORT_CHECKING_BALANCE",
                  <ValidationBalanceScreen />
                )}
              />
              <Route
                path="/reports/accouting-606"
                element={checkRole("ACCOUNT_CATALOGS", <DGI606Screen />)}
              />
              <Route
                path="/reports/accouting-607"
                element={checkRole("ACCOUNT_CATALOGS", <DGI607Screen />)}
              />
              <Route
                path="/reports/accounting-conciliation"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <AccountingConciliation />
                )}
              />
              <Route
                path="/reports/accouting-major-general"
                element={checkRole("ACCOUNT_CATALOGS", <GeneralMajor />)}
              />
              <Route
                path="/reports/accounting-box-major"
                element={checkRole("ACCOUNT_CATALOGS", <BoxMajorScreen />)}
              />
              <Route
                path="/reports/accounting-account-payable"
                element={checkRole(
                  "REPORT_ACCOUNT_PAYABLE",
                  <AccountPayableScren />
                )}
              />
              <Route
                path="/reports/charge-account"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <ToChargeAccountScreen />
                )}
              />
              <Route
                path="/reports/charge-account-aged"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <ToChargeAccountAgedScreen />
                )}
              />
              <Route
                path="/reports/paid-interest"
                element={checkRole("ACCOUNT_CATALOGS", <PaidInterestScreen />)}
              />
              <Route
                path="/reports/receipt-detail"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <ReceiptsDetailScreen />
                )}
              />
              <Route
                path="/reports/detailed-accouting-major-general"
                element={checkRole(
                  "ACCOUNT_CATALOGS",
                  <DetailedGeneralMajor />
                )}
              />
              <Route
                path="/reports/rrhh-employees"
                element={checkRole("EMPLOYEES", <EmployeeScreen />)}
              />
              <Route
                path="/reports/rrhh-collector-commission"
                element={checkRole(
                  "REPORT_COMMISSION",
                  <CollectorCommissionScreen />
                )}
              />
              <Route
                path="/reports/rrhh-holidays"
                element={checkRole(
                  "REPORT_COMMISSION",
                  <HolidaysScreen title={"Dias feriados"} type={"DF"} />
                )}
              />
              <Route
                path="/reports/rrhh-extra-hours"
                element={checkRole(
                  "REPORT_COMMISSION",
                  <HolidaysScreen title={"Horas Extra"} type={"HE"} />
                )}
              />
              <Route
                path="/reports/rrhh-employee-loan"
                element={checkRole("REPORT_COMMISSION", <EmployeeLoanScreen />)}
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
