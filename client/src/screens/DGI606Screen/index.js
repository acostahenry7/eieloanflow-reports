import React from "react";
import { TopBar } from "../../components/TopBar";
import { generate606Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";

function DGI606Screen() {
  const [isLoading, setIsLoading] = React.useState(false);

  const generate606Report = async () => {
    console.log("hi");
    try {
      setIsLoading(true);
      let response = await generate606Api({});
      setIsLoading(false);

      console.log(response);
    } catch (error) {}
  };

  return (
    <div className="">
      <TopBar title="606" />
      <div className="screen-content">
        <button className="btn" onClick={async () => await generate606Report()}>
          Generar
        </button>
        {isLoading && <ThreeDots />}
      </div>
    </div>
  );
}

export { DGI606Screen };
