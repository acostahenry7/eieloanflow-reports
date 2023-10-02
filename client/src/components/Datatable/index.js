import React from "react";
import DataTable from "react-data-table-component";

function Datatable({
  columns,
  data,
  isLoading,

  onChangePage,
  onChangePageSize,
  totalRows,
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={isLoading}
      progressComponent={<p>Loading...</p>}
      pagination
    />
  );
}

export { Datatable };
