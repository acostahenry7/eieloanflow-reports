import React from "react";
import "./index.css";
import { MdFilterListAlt } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { useFormik } from "formik";
import Popover from "@mui/material/Popover";
import { TiExport } from "react-icons/ti";

function SearchBar({
  mainFilters,
  secondaryFilters,
  setRequestToggle,
  searchParams,
  setSearchParams,
  setSearchedText,
  columns,
  setColumns,
  exportFunction,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showOtherfilters, setShowOtherFilters] = React.useState(
    secondaryFilters.length > 0 ? true : false
  );
  const searchForm = useFormik({
    initialValues: getInitialValues([...mainFilters, ...secondaryFilters]),
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setSearchParams({});
      console.log(values);
      setSearchParams(values);
      setRequestToggle((state) => !state);
    },
  });

  const changeColumnVisibility = (columName) => {
    let newColumns = [...columns];

    newColumns.forEach((column) => {
      if (column.name === columName) {
        column.omit = !column.omit;
      }
    });

    setColumns(newColumns);
  };

  return (
    <div className="SearchBar">
      <div className="SearchBar-main-items">
        {mainFilters
          .filter((item) => item.type === "text")
          .map((mf, index) => (
            <div key={index} className="SearchBar-main-item">
              <label>{mf.label}</label>
              <input
                value={searchForm.values[mf.field]}
                onChange={(e) => {
                  setSearchedText(mf.field + e.target.value);
                  searchForm.setFieldValue(mf.field, e.target.value);
                }}
                type="search"
                placeholder={mf.placeholder}
              />
              <div style={{ fontSize: 12, marginTop: 2, color: "grey" }}>
                <span>Búsqueda: </span>
                <b style={{ color: "rgba(0,0,0,0.6)" }}>
                  {searchParams != undefined ? searchParams[`${mf.field}`] : ""}
                </b>
              </div>
            </div>
          ))}
        {mainFilters
          .filter((item) => item.type === "date")
          .map((mf, index) => (
            <div key={index} className="SearchBar-main-item">
              <label>{mf.label}</label>
              <input
                value={searchForm.values[mf.field]}
                onChange={(e) => {
                  // setSearchedText(mf.field + e.target.value);
                  searchForm.setFieldValue(mf.field, e.target.value);
                }}
                type="date"
                name="begin"
                min="1997-01-01"
                max="2030-12-31"
                placeholder={mf.placeholder}
              />
              {/* <div style={{ fontSize: 12, marginTop: 2, color: "grey" }}>
                <span>Búsqueda: </span>
                <b style={{ color: "rgba(0,0,0,0.6)" }}>
                  {searchParams != undefined ? searchParams[`${mf.field}`] : ""}
                </b>
              </div> */}
            </div>
          ))}
        {mainFilters
          .filter((item) => item.type === "select")
          .map((mf, index) => (
            <div key={index} className="SearchBar-main-item">
              <label>{mf.label}</label>
              <select
                value={searchForm.values[mf.field]}
                onChange={(e) => {
                  if (mf.updateForm == true) {
                    setSearchParams({ [mf.field]: e.target.value });
                  }
                  searchForm.setFieldValue(mf.field, e.target.value);
                }}
              >
                {mf.options.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>
      <div
        className={`SearchBar-seconday-items ${
          showOtherfilters === true ? "open" : ""
        }`}
      >
        {secondaryFilters
          ?.filter((item) => item.type === "text")
          .map((sf, index) => (
            <div key={index} className={`SearchBar-secondary-item `}>
              <label>{sf.label}</label>
              <input
                value={searchForm.values[sf.field]}
                onChange={(e) => {
                  setSearchedText(sf.field + e.target.value);
                  searchForm.setFieldValue(sf.field, e.target.value);
                }}
                type="search"
                placeholder={sf.placeholder}
              />
            </div>
          ))}
        {secondaryFilters
          .filter((item) => item.type === "select")
          .map((mf, index) => (
            <div key={index} className="SearchBar-main-item">
              <label>{mf.label}</label>
              <select
                value={searchForm.values[mf.field]}
                onChange={(e) =>
                  searchForm.setFieldValue(mf.field, e.target.value)
                }
              >
                {mf.options.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        {secondaryFilters
          ?.filter((item) => item.type === "dateRange")
          .map((sf, index) => (
            <div key={index} className={`SearchBar-secondary-item`}>
              <label>{sf.label}</label>
              <div className="SearchBar-secondary-item--date">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <label>Desde</label>
                  <input
                    value={searchForm.values[sf.field + "From"]}
                    onChange={(e) => {
                      searchForm.setFieldValue(
                        sf.field + "From",
                        e.target.value + ""
                      );
                    }}
                    type="date"
                    name="begin"
                    min="01-01-1997"
                    max="31-12-2030"
                    placeholder="dd-mm-yyyy"
                    // placeholder={sf.placeholder}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <label>Hasta</label>
                  <input
                    value={searchForm.values[sf.field + "To"]}
                    onChange={(e) => {
                      searchForm.setFieldValue(sf.field + "To", e.target.value);
                    }}
                    type="date"
                    placeholder={sf.placeholder}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="SearchBar-actions">
        <button
          title="buscar"
          className="SearchBar-actions-icon button"
          onClick={() => searchForm.handleSubmit()}
        >
          Buscar
        </button>
        <MdFilterListAlt
          title="Mas filtros"
          className="SearchBar-actions-icon"
          onClick={() => setShowOtherFilters((state) => !state)}
        />
        <HiOutlineRefresh
          title="Refresh and clear filters"
          className="SearchBar-actions-icon"
          onClick={() => {
            // window.location.reload();
            searchForm.resetForm();
            setSearchParams({
              outletId: "857b8b3b-d603-4474-9b35-4a90277d9bc0",
              dateFrom: new Date().toISOString().split("T")[0],
              dateTo: new Date().toISOString().split("T")[0],
            });
            setSearchedText("");
            setRequestToggle((state) => !state);
          }}
        />
        <AiOutlineUnorderedList
          title="Mostrar / ocultar columnas"
          className="SearchBar-actions-icon"
          aria-describedby={"filter-pop"}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
        <Popover
          id={"filter-pop"}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <ul className="search-bar-filter-list">
            {columns?.map((column, index) => (
              <li className="search-bar-filter-list-item" key={index}>
                <span>{column.name}</span>
                <input
                  type="checkbox"
                  onChange={() => {
                    changeColumnVisibility(column.name);
                  }}
                  checked={column.omit === false ? true : false}
                />
              </li>
            ))}
          </ul>
        </Popover>
        <button
          title="Exportar"
          style={{
            marginLeft: 12,
            backgroundColor: "#4cb2f1",
            display: "flex",
            alignItems: "center",
          }}
          className="SearchBar-actions-icon button"
          onClick={() => exportFunction()}
        >
          <TiExport size={20} style={{ marginTop: -5, marginRight: 8 }} />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
}

function getInitialValues(arr) {
  let initialValues = {};
  arr.forEach((item) => {
    switch (item.type) {
      case "text":
        initialValues[item.field] = "";
        break;
      case "select":
        initialValues[item.field] = item.options[0]?.value;
        break;
      case "dateRange":
        initialValues[item.field + "From"] = new Date()
          .toISOString()
          .split("T")[0];
        initialValues[item.field + "To"] = new Date()
          .toISOString()
          .split("T")[0];
        break;
      case "date":
        initialValues[item.field] = new Date().toISOString().split("T")[0];
        break;
      default:
        break;
    }
  });

  return initialValues;
}

export { SearchBar };
