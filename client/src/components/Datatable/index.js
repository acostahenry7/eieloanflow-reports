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
        // borderRadius: 20,
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

        // fontSize: 14,
        // borderRadius: 20,
        fontSize: 13,
        fontWeight: "bold",
      },
    },

    pagination: {
      style: {
        marginTop: 15,
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
      customStyles={dataTableStyles}
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
      pagination
      {...dtOptions}
    />
  );
}

export { Datatable };
