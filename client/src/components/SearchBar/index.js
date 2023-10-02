import React from "react";
import "./index.css";
import { MdFilterListAlt } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { useFormik } from "formik";

function SearchBar({ mainFilters, setRequestToggle, setSearchParams }) {
  const searchForm = useFormik({
    initialValues: getInitialValues(mainFilters),
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      setSearchParams(values);
    },
  });

  return (
    <div className="SearchBar">
      <div className="SearchBar-main-items">
        {mainFilters.map((mf) => (
          <div className="SearchBar-main-item">
            <label>{mf.label}</label>
            <input
              value={searchForm.values[mf.field]}
              onChange={(e) =>
                searchForm.setFieldValue(mf.field, e.target.value)
              }
              type="text"
              placeholder={mf.placeholder}
            />
          </div>
        ))}
      </div>
      <div className="SearchBar-actions">
        <button
          className="SearchBar-actions-icon button"
          onClick={() => searchForm.handleSubmit()}
        >
          Buscar
        </button>
        <MdFilterListAlt className="SearchBar-actions-icon" />
        <HiOutlineRefresh
          className="SearchBar-actions-icon"
          onClick={() => setRequestToggle((state) => !state)}
        />
        <AiOutlineUnorderedList className="SearchBar-actions-icon" />
      </div>
    </div>
  );
}

function getInitialValues(arr) {
  let initialValues = {};
  arr.forEach((item) => {
    if (item.type != "text") {
      initialValues[item.name] = item.options[0]?.value;
    }
  });

  return initialValues;
}

export { SearchBar };
