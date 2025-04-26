import React, { useEffect } from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoanDetail } from "../../../api/loan";
import {
  formatClientName,
  getLoanSituationLabel,
  getLoanTypeLabel,
  getPaymentTotalByType,
} from "../../../utils/stringFunctions";
import {
  getBankAccountsApi,
  getConciliationApi,
  removeConciliationApi,
} from "../../../api/accounting";
import { getOutletsApi } from "../../../api/outlet";
import { ThreeDots } from "react-loader-spinner";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { generateReport } from "../../../utils/reports/accountConciliation";
import { tableUIHelper } from "../../../utils/ui-helpers";
import Modal from "../../Modal";
import ConciliationForm from "./ConciliationForm";
import PopoverMenu from "../../PopoverMenu";
import {} from "react-icons/bi";
import { BsEye, BsTrash } from "react-icons/bs";

function AccountConciliationCrud({ isFormOpened, setIsFormOpened }) {
  const [outlets, setOutlets] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({});

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const response = await getConciliationApi(searchParams);
        if (response.error == true) {
          throw new Error(response.body);
        }
        console.log(response.body);
        setOutlets(outlets.body);
        setData(response.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const getBankAccounts = async (outletId) => {
    try {
      setAccounts([]);

      const res = await getBankAccountsApi({ outletId });

      setAccounts(res.body);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(searchParams);
  const handleRemoveConciliation = async (conciliationId) => {
    console.log(conciliationId);
    return removeConciliationApi({ conciliationId })
      .then((res) => {
        setReqToggle((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [columns, setColumns] = React.useState([
    {
      name: "Fecha",
      width: "250px",
      selector: (row) => (
        <p style={{ margin: 0, fontWeight: 500 }}>
          {new Date(row.start_date).toLocaleString({})}
        </p>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Sucursal",
      width: "140px",
      selector: (row) => row.outlet_name,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Monto",
      // width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        currencyFormat(
          row.bankTransactions.reduce(
            (acc, i) => acc + parseFloat(i.amount),
            0
          ),
          false
        ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estado",
      //width: tableUIHelper.columns.width.amount,
      selector: (row) => row.status,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Acciones",
      //width: "400px",
      selector: (row) => (
        <PopoverMenu
          options={[
            {
              name: "Imprimir",
              icon: <BsEye />,
              action: () => {
                exportPDF(row);
              },
            },
            // {
            //   name: "Visualizar",
            //   icon: <BsEye />,
            //   action: (setIsVisible) => {
            //     console.log(row);
            //     setCurrentItem(row);
            //     setIsVisible(null);
            //     setIsFormOpened(true);
            //   },
            // },
            {
              name: "Eliminar",
              icon: <BsTrash />,
              action: (setIsVisible) => {
                console.log("hi");
                handleRemoveConciliation(row.conciliation_id);

                setIsVisible(null);
              },
            },
          ]}
        />
      ),
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "Descripcion",
      field: "description",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    // {
    //   label: "No. Cédula/Pasaporte",
    //   field: "identification",
    //   placeholder: "Cédula",
    //   type: "text",
    // },
    // {
    //   label: "No. Préstamo",
    //   field: "loanNumber",
    //   placeholder: "No. Préstamo",
    //   type: "text",
    // },
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      options: [
        {
          label: "Todas las sucursales",
          value: "",
        },
        ...outlets.map((item) => {
          return {
            label: item.name,
            value: item.outlet_id,
          };
        }),
      ],
      customAction: async (id) => {
        console.log(id);
        await getBankAccounts(id);
      },
    },
    // {
    //   label: "Cuenta",
    //   field: "bankAccountId",
    //   type: "select",
    //   options: [
    //     ...accounts.map((item) => {
    //       return {
    //         label: item.name,
    //         value: item.bank_account_id,
    //       };
    //     }),
    //   ],
    // },
  ];

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      isActive: true,
    },
    // {
    //   label: "Estatus",
    //   field: "loanStatus",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Creado",
    //       value: "CREATED",
    //     },
    //     {
    //       label: "Pagado",
    //       value: "PAID",
    //     },
    //     {
    //       label: "Cancelado",
    //       value: "CANCEL",
    //     },
    //     {
    //       label: "Renegociado",
    //       value: "RENEGOTIATED",
    //     },
    //     {
    //       label: "Transferido",
    //       value: "TRANSFERRED",
    //     },
    //     {
    //       label: "Incobrable",
    //       value: "BAD-LOAN",
    //     },
    //     {
    //       label: "Reenganchado",
    //       value: "reenganchado",
    //     },
    //   ],
    // },
    // {
    //   label: "Tipo de préstamo",
    //   field: "loanType",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Personal",
    //       value: "LOAN_TYPE_PERSONAL",
    //     },
    //     {
    //       label: "Vehículo",
    //       value: "LOAN_TYPE_VEHICLE",
    //     },
    //     {
    //       label: "Hipotecario",
    //       value: "LOAN_TYPE_MORTGAGE",
    //     },
    //     {
    //       label: "Pymes",
    //       value: "LOAN_PYMES",
    //     },
    //     {
    //       label: "Micro",
    //       value: "LOAN_MICRO",
    //     },
    //     {
    //       label: "Seguro",
    //       value: "LOAN_INSURANCE",
    //     },
    //   ],
    // },
    // {
    //   label: "Situación",
    //   field: "loanSituation",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Normal",
    //       value: "NORMAL",
    //     },
    //     {
    //       label: "Pagado",
    //       value: "PAID",
    //     },
    //     {
    //       label: "Atraso",
    //       value: "ARREARS",
    //     },
    //     {
    //       label: "Legal",
    //       value: "legal",
    //     },
    //     {
    //       label: "Refinanciado",
    //       value: "REFINANCE",
    //     },
    //     {
    //       label: "Incautado",
    //       value: "SEIZED",
    //     },
    //   ],
    // },
  ]);
  const filterData = data.filter((item) => {
    let searchText = `description${item.description}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const exportPDF = (row) => {
    let reportDate = new Date(row.start_date);
    let reportDateTo = new Date(row.end_date);

    console.log(row);
    let outletName = outlets.filter(
      (item) => item.outlet_id == searchParams.outletId
    )[0]?.name;
    let conf = {
      title: outletName || "Todas las sucursales",
      date: reportDate.toLocaleString("es-Es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dateTo: reportDateTo.toLocaleString("es-Es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    generateReport(row, conf);
  };

  return (
    <div className="crud-container">
      {isFormOpened && (
        <ConciliationForm
          prevData={currentItem}
          isFormOpened={isFormOpened}
          setIsFormOpened={setIsFormOpened}
          setPrevData={setCurrentItem}
          onRefetch={() => {
            setReqToggle((prev) => !prev);
          }}
        />
      )}

      <SearchBar
        mainFilters={mainFilters}
        secondaryFilters={secondaryFilters}
        setSecondaryFilters={setSecondaryFilters}
        setRequestToggle={setReqToggle}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
        exportFunction={() => exportPDF()}
      />
      <Datatable
        columns={columns}
        data={filterData}
        isLoading={isLoading}
        // marginTopPagination={100}
        // dtOptions={{
        //   expandableRows: true,
        //   expandableRowsComponent: ({ data }) => {
        //     // console.log(data);

        //     return <LoanDetailSummary data={data} />;
        //   },
        // }}
      />
      {!isLoading && filterData.length > 0 && 1 == 2 && (
        <div
          style={{
            display: "flex",
            marginTop: "-150px",
            alignItems: "center",
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          <span style={{ paddingLeft: 15 }}>Totales</span>
          <p style={{ marginLeft: 467, width: 130 }}>
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_due),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid_capital),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid_interest),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_pending || 0),
                //parseFloat(item.total_paid),
                0
              )
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export { AccountConciliationCrud };
