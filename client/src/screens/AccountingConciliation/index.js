import React, { useEffect, useState } from "react";
import { TopBar } from "../../components/TopBar";
import { Datatable } from "../../components/Datatable";
import { getBankTransactionsApi } from "../../api/accounting";
import TransactionItem from "./TransactionItem";
import FilterItem from "./FilterItem";
import { TailSpin } from "react-loader-spinner";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { currencyFormat } from "../../utils/reports/report-helpers";
import TransactionHeader from "./TransactionHeader";
import { AccountConciliationCrud } from "../../components/cruds/AccountConciliation";

// function AccountingConciliation() {
//   const defaultFilters = [
//     {
//       name: "disbursement",
//       label: "Desembolsos",
//     },
//     {
//       name: "entry",
//       label: "Depósitos",
//     },
//     {
//       name: "payment",
//       label: "Pagos",
//     },
//     {
//       name: "differences",
//       label: "Ver diferencias",
//       condition: (item) => {
//         return (filter) => item.amount != item.diary_amount;
//       },
//     },
//   ];
//   const [currentFilters, setCurrentFilters] = useState([]);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const getTransactions = async () => {
//       setIsLoading(true);
//       let res = await getBankTransactionsApi({
//         dateFrom: "2024-03-01",
//         dateTo: "2024-03-31",
//         outletId: "11d63958-e505-49c6-8cd5-09e8d8ae0776",
//       });
//       setIsLoading(false);
//       setData(res.body.transactions);
//       console.log(res.body);
//     };

//     getTransactions();
//   }, []);

//   const applyFilters = (filter) => {
//     const filters = [...currentFilters];
//     if (filter.checked === false) {
//       console.log(filter.checked);
//       const index = filters.findIndex((item) => item.name == filter.name);
//       filters.splice(index, 1);
//       setCurrentFilters(filters);
//     } else {
//       filters.push(filter);
//       setCurrentFilters((prev) => [...prev, filter]);
//     }
//     console.log(filters);

//     const currentData = [...data];
//     setFilteredData(
//       currentData.filter(
//         (item) => filters.some(filter.condition(item)) == true
//         //filters.some((filter) => item.transaction_type == filter.name) == true
//       )
//     );
//   };

//   const getTotalByCondition = (arr, condition) => {
//     let result = 0;
//     console.log(arr.filter(condition).length);
//     result = arr
//       .filter(condition)
//       .reduce((acc, item) => acc + parseFloat(item.amount), 0);

//     return currencyFormat(result);
//   };

//   return (
//     <>
//       <TopBar title="Conciliación bancaria" />
//       <div className="screen-content">
//         <div>
//           <h3>Transacciones</h3>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               paddingRight: 30,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 gap: 16,
//                 marginBottom: 10,
//               }}
//             >
//               {defaultFilters.map((filter) => (
//                 <div key={filter.name}>
//                   <FilterItem
//                     name={filter.name}
//                     label={filter.label}
//                     onChange={(e) => {
//                       //setSeeDisbursement(e.target.checked);
//                       applyFilters({
//                         name: filter.name.toUpperCase(),
//                         checked: e.target.checked,
//                         condition: filter.condition
//                           ? filter.condition
//                           : (item) => {
//                               return (filter) =>
//                                 filter.name === item.transaction_type;
//                             },
//                       });
//                     }}
//                   />
//                 </div>
//               ))}
//               {isLoading && <TailSpin width={25} height={25} />}
//             </div>
//             <div style={{ display: "flex", gap: 20 }}>
//               <div>
//                 <ImArrowUp color="green" />{" "}
//                 <span style={{ fontSize: 20 }}>
//                   {currentFilters.length > 0
//                     ? getTotalByCondition(
//                         filteredData,
//                         (item) => item.transaction_type == "ENTRY"
//                       )
//                     : getTotalByCondition(
//                         data,
//                         (item) => item.transaction_type == "ENTRY"
//                       )}
//                 </span>
//               </div>
//               <div>
//                 <ImArrowDown color="red" />{" "}
//                 <span style={{ fontSize: 20 }}>
//                   {currentFilters.length > 0
//                     ? getTotalByCondition(
//                         filteredData,
//                         (item) => item.transaction_type != "ENTRY"
//                       )
//                     : getTotalByCondition(
//                         data,
//                         (item) => item.transaction_type != "ENTRY"
//                       )}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <TransactionHeader />
//           <div
//             style={{
//               marginTop: 20,
//               display: "flex",
//               flexDirection: "column",
//               gap: 14,
//               height: 430,
//               overflowY: "scroll",
//             }}
//           >
//             {currentFilters.length > 0
//               ? filteredData?.map((t, index) => (
//                   <TransactionItem key={index} {...t} />
//                 ))
//               : data?.map((t, index) => <TransactionItem key={index} {...t} />)}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

function AccountingConciliation() {
  const [isFormOpened, setIsFormOpened] = useState(false);
  return (
    <div className="">
      <TopBar
        title="Conciliación bancaria"
        buttonTitle={"Nueva conciliacion"}
        btnOnClick={() => setIsFormOpened(true)}
      />
      <div className="screen-content">
        <AccountConciliationCrud
          isFormOpened={isFormOpened}
          setIsFormOpened={setIsFormOpened}
        />
      </div>
    </div>
  );
}

export { AccountingConciliation };
