import React from "react";
import DataTable from "react-data-table-component";
import { ThreeDots } from "react-loader-spinner";

function Datatable({
  columns,
  data,
  isLoading,
  dtOptions,
  onChangePage,
  onChangePageSize,
  totalRows,
  marginTopPagination,
  customStyles,
}) {
  const styles = {
    boxShadow: "0 0 10px grey",
    color: "blue",
  };
  const dataTableStyles = {
    table: {
      style: {
        // marginTop: 10,
        backgroundColor: "whitesmoke",
      },
    },
    header: {
      style: {
        backgroundColor: "whitesmoke",
      },
    },
    responsiveWrapper: {
      style: {
        marginTop: customStyles?.marginTop || 40,
      },
    },
    rows: {
      style: {
        color: "#343433",
        fontSize: 13,
        "&:not(:last-of-type)": {
          borderBottomStyle: "none",
        },
        padding: "4px 0",
      },
      stripedStyle: {
        color: "#343433",
        backgroundColor: "#fafafa",
        border: "none",
      },
    },
    headRow: {
      style: {
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // backgroundColor: "var(--main-bg-color)",
        borderTop: "1px solid rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(0,0,0,0.2)",
        color: "#364454",
        // position: "fixed",
        // top: 300,

        // fontSize: 14,
        // borderRadius: 20,
        fontSize: 13,
        fontWeight: "bold",
      },
    },

    body: {
      marginTop: 40,
    },

    pagination: {
      style: {
        marginTop: marginTopPagination,
        borderRadius: 20,
        // boxShadow: "0px 0px 10px var(--container-shadow-color)",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      striped={true}
      data={data}
      progressPending={isLoading}
      customStyles={{
        ...dataTableStyles,
        responsiveWrapper: {
          ...customStyles,
        },
      }}
      progressComponent={
        <ThreeDots
          height="80"
          width="60"
          radius="9"
          color="var(--main-color)"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      }
      pagination={true}
      paginationComponentOptions={{
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
      }}
      {...dtOptions}
      noDataComponent={
        <span>No se encontraron coincidencias para la búsqueda</span>
      }
      //expandOnRowClicked
    />
  );
}

export { Datatable };
