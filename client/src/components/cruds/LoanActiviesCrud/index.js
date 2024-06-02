import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoanActivities } from "../../../api/loan";
import {
  formatClientName,
  getLoanSituationLabel,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/loanActivities";

function LoanActivitiesCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const loanActivities = await getLoanActivities(searchParams);
        if (loanActivities.error == true) {
          throw new Error(loanActivities.body);
        }

        setOutlets(outlets.body);
        console.log(loanActivities.body);

        loanActivities.body.map((la) => {
          la.action_type = getLoanSituationLabel(la.action_type);
          return la;
        });
        setIsLoading(false);
        console.log(loanActivities.body);
        setData(loanActivities.body);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      width: "250px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.customer_name)}
          </p>
          <span style={{ fontSize: 12 }}>{row.identification}</span>
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Préstamo",
      width: "120px",
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Acción",
      selector: (row) => row.action_type,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Nota/comentario",
      selector: (row) => row.commentary,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Empleado",
      selector: (row) => row.employee_name,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha ",
      selector: (row) => new Date(row.created_date).toLocaleString("en-US"),
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "Cliente",
      field: "customerName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    {
      label: "Tipo de Acción",
      field: "actionType",
      placeholder: "Búsqueda por acción",
      type: "select",
      options: [
        {
          label: "Todas",
          value: "",
        },
        {
          label: "Creado",
          value: "CREATED",
        },
        {
          label: "Renegociado",
          value: "RENEGOTIATED",
        },
        {
          label: "Refinanciado",
          value: "REFINANCE",
        },
        {
          label: "Des-Incautado",
          value: "NORMAL",
        },
        {
          label: "Cambio de fecha",
          value: "CHANGE_PAYMENT_DATE",
        },
        {
          label: "Incobrable",
          value: "BAD_LOAN",
        },
        {
          label: "Transferido",
          value: "TRANSFERRED",
        },
        {
          label: "Editado",
          value: "EDIT",
        },
        {
          label: "Incautado",
          value: "SEIZED",
        },
        {
          label: "Descuento Mora",
          value: "DISCOUNT_MORA",
        },
        {
          label: "Descuento Interest",
          value: "DISCOUNT_INTEREST",
        },
        {
          label: "Abono a capital",
          value: "CAPITAL_PAYMENT",
        },
        {
          label: "Descuento global",
          value: "GLOBAL_DISCOUNT",
        },
        {
          label: "Pago cancelado",
          value: "CANCEL_PAYMENT",
        },
      ],
    },
    {
      label: "No. Cédula/Pasaporte",
      field: "indetification",
      placeholder: "Cédula",
      type: "text",
    },
    {
      label: "No. Préstamo",
      field: "loanNumber",
      placeholder: "No. Préstamo",
      type: "text",
    },
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
    },
  ];

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      isActive: true,
    },
    {
      label: "Empleado",
      placeholder: "Empleado",
      field: "employeeName",
      type: "text",
      isActive: true,
    },
    {
      label: "Estatus",
      field: "loanStatus",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Creado",
          value: "CREATED",
        },
        {
          label: "Pagado",
          value: "PAID",
        },
        {
          label: "Cancelado",
          value: "CANCEL",
        },
        {
          label: "Renegociado",
          value: "RENEGOTIATED",
        },
        {
          label: "Transferido",
          value: "TRANSFERRED",
        },
        {
          label: "Incobrable",
          value: "BAD-LOAN",
        },
        {
          label: "Reenganchado",
          value: "reenganchado",
        },
      ],
      isActive: true,
    },
    {
      label: "Tipo de préstamo",
      field: "loanType",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Personal",
          value: "LOAN_TYPE_PERSONAL",
        },
        {
          label: "Vehículo",
          value: "LOAN_TYPE_VEHICLE",
        },
        {
          label: "Hipotecario",
          value: "LOAN_TYPE_MORTGAGE",
        },
        {
          label: "Pymes",
          value: "LOAN_PYMES",
        },
        {
          label: "Micro",
          value: "LOAN_MICRO",
        },
        {
          label: "Seguro",
          value: "LOAN_INSURANCE",
        },
      ],
      isActive: true,
    },
    {
      label: "Situación",
      field: "loanSituation",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Normal",
          value: "NORMAL",
        },
        {
          label: "Pagado",
          value: "PAID",
        },
        {
          label: "Atraso",
          value: "ARREARS",
        },
        {
          label: "Legal",
          value: "legal",
        },
        {
          label: "Refinanciado",
          value: "REFINANCE",
        },
        {
          label: "Incautado",
          value: "SEIZED",
        },
      ],
      isActive: true,
    },
    // {
    //   label: "Recibo",
    //   placeholder: "número recibo",
    //   field: "receiptNumber",
    //   type: "text",
    // },
  ]);

  const exportPDF = () => {
    generateReport(data, {});
  };

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}
    createdBy${item.created_by}receiptNumber${item.receipt_number}actionType${item.action_type}employeeName${item.employee_name}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  return (
    <div className="crud-container">
      <SearchBar
        mainFilters={mainFilters}
        secondaryFilters={secondaryFilters}
        setSecondaryFilters={setSecondaryFilters}
        setRequestToggle={setReqToggle}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
        exportFunction={() => exportPDF()}
      />

      <Datatable columns={columns} data={filterData} isLoading={isLoading} />
    </div>
  );
}

export { LoanActivitiesCrud };
