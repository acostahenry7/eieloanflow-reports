import React from "react";
import { TopBar } from "../../components/TopBar";
//import { generate607Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";

function DGI607Screen() {
  const [isLoading, setIsLoading] = React.useState(false);

  const generate607Report = async () => {
    console.log("hi");
    try {
      setIsLoading(true);
      let response = {}; //await generate607Api({});
      setIsLoading(false);

      console.log(response);
    } catch (error) {}
  };

  return (
    <div className="">
      <TopBar title="Formulario 607" />
      <div className="screen-content">
        <button className="btn" onClick={async () => await generate607Report()}>
          Generar
        </button>
        {isLoading && <ThreeDots />}
      </div>
    </div>
  );
}

export { DGI607Screen };
