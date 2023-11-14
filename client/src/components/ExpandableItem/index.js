import React from "react";
import "./index.css";
import { BiChevronDown } from "react-icons/bi";

function ExpandableItem(props) {
  const [opened, setOpened] = React.useState(false);
  const toggleItem = () => {
    setOpened(!opened);
  };

  return (
    <div className="expandable">
      <div className="expandable-header" onClick={toggleItem}>
        <span>{props?.title}</span>
        <BiChevronDown
          size={20}
          className={`expandable-header-icon ${opened == true ? "open" : ""}`}
        />
      </div>
      <div className={`expandable-body ${opened == true ? "open" : ""}`}>
        {props.children}
      </div>
    </div>
  );
}

export { ExpandableItem };
