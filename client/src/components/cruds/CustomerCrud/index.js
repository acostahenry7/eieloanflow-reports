import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getArrearCustomersApi } from "../../../api/customer";

function CustomerCrud() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const customers = await getArrearCustomersApi(searchParams);
        if (customers.error == true) {
          throw new Error(customers.body);
        }

        console.log(customers.body);
        setData(customers.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const columns = [
    {
      name: "Cliente",
      width: "230px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>{row.customer_name}</p>
          <span style={{ fontSize: 12 }}>{row.identification}</span>
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
    },
    {
      name: "Préstamo",
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.phone,
      sortable: true,
      reorder: true,
    },
    {
      name: "Fecha Préstamo",
      selector: (row) => row.created_date,
      sortable: true,
      reorder: true,
    },
    {
      name: "Monto aprobado",
      selector: (row) => row.amount_approved,
      sortable: true,
      reorder: true,
    },
    {
      name: "Monto cuota",
      selector: (row) => row.amount_of_free,
      sortable: true,
      reorder: true,
      hide: "lg",
    },
    {
      name: "Cuotas",
      selector: (row) => row.number_of_installments,
      sortable: true,
      reorder: true,
      hide: "lg",
    },
    {
      name: "Cuotas Pagadas",
      selector: (row) => row.paid_dues,
      sortable: true,
      reorder: true,
      hide: "lg",
    },
    {
      name: "Cuotas en atraso",
      selector: (row) => row.arrears_dues,
      sortable: true,
      reorder: true,
      hide: "lg",
    },
    {
      name: "Porcentaje atraso",
      selector: (row) => `${row.arrear_percentaje} %`,
      sortable: true,
      reorder: true,
    },
    {
      name: "Vencido desde",
      selector: (row) => row.defeated_since,
      sortable: true,
      reorder: true,
    },
    {
      name: "Monto Vencido",
      selector: (row) => row.defeated_amount,
      sortable: true,
      reorder: true,
    },
  ];

  const mainFilters = [
    {
      label: "Cliente",
      field: "customerName",
      placeholder: "Búsqueda por nombre",
      type: "text",
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
  ];

  return (
    <div className="crud-container">
      <SearchBar
        mainFilters={mainFilters}
        setRequestToggle={setReqToggle}
        setSearchParams={setSearchParams}
      />
      <Datatable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}

export { CustomerCrud };
