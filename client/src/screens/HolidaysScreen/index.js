import React from "react";
import { TopBar } from "../../components/TopBar";
import { HolidaysCrud } from "../../components/cruds/HolidaysCrud";

function HolidaysScreen({ title, type }) {
  return (
    <div className="">
      <TopBar title={title} />
      <div className="screen-content">
        <HolidaysCrud type={type} />
      </div>
    </div>
  );
}

export { HolidaysScreen };
