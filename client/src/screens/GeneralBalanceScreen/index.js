import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import "./index.css";

function GeneralBalanceScreen() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        let balance = await getGeneralBalance({});
        console.log(balance);
        setData(balance.body);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="">
      <TopBar title="Balance General" />
      <div className="screen-content">
        <ExpandableItem title="Activos">
          <ExpandableItem title="Activos Circulantes">
            <div className="expandable-layout">
              <p>EFECTIVOS EN CAJA Y BANCO</p>
              <span>{data[0]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>Total Activos circulantes</p>
              <span>{data[0]?.balance}</span>
            </div>
          </ExpandableItem>
          <ExpandableItem title="Activos Corrientes">
            <div className="expandable-layout">
              <p>DOCUMENTOS Y CUENTAS POR COBRAR</p>
              <span>{data[23]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>OTRAS CUENTAS POR PAGAR</p>
              <span>{data[55]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>IMPUESTOS PAGADOS POR ADELANTADO</p>
              <span>{data[22]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>Total Activos corrientes</p>
              <span>
                {parseFloat(data[55]?.balance) +
                  parseFloat(data[22]?.balance) +
                  parseFloat(data[23]?.balance)}
              </span>
            </div>
          </ExpandableItem>
          <ExpandableItem title="Activos Fijos">
            <div className="expandable-layout">
              <p>EQUIPOS DE OFICINA</p>
              <span>{data[24]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>DEPRECIACION</p>
              <span>{data[29]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>MOTOR</p>
              <span>{data[36]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>Total Activos fijos</p>
              <span>
                {parseFloat(data[29]?.balance) +
                  parseFloat(data[36]?.balance) +
                  parseFloat(data[24]?.balance)}
              </span>
            </div>
          </ExpandableItem>
          <div className="expandable-layout">
            <p>Total Activos</p>
            <span>
              {parseFloat(data[29]?.balance) +
                parseFloat(data[36]?.balance) +
                parseFloat(data[24]?.balance) +
                parseFloat(data[55]?.balance) +
                parseFloat(data[22]?.balance) +
                parseFloat(data[23]?.balance) +
                parseFloat(data[0]?.balance)}
            </span>
          </div>
        </ExpandableItem>
        <ExpandableItem title="Pasivos">
          <ExpandableItem title="Padivos Circulantes">
            <div className="expandable-layout">
              <p>CUENTAS POR PAGAR</p>
              <span>{data[40]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>BONIFICACIÓN POR PAGAR</p>
              <span>{data[43]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>OTROS</p>
              <span>3000</span>
            </div>
            <div className="expandable-layout">
              <p>IMPUESTOS SOBRE LA RENTA LEY 11-92</p>
              <span>{data[6]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RETENCIÓN INT. PAGADOS A PERSONAS FÍSICAS</p>
              <span>{data[48]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>PLAN DE PENSIÓN Y JUBILACIÓN</p>
              <span>{data[49]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>SEGURO FAMILIAR DE SALUD</p>
              <span>{data[25]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RIESGOS LABORALES</p>
              <span>{data[50]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RETENCIÓN DE ITBIS</p>
              <span>{data[51]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>ANTICIPO POR PAGAR</p>
              <span>{data[54]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INTERESES GANADOS NO COBRADOS</p>
              <span>{data[70]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>Total Pasivos circulantes</p>
              <span>
                {parseFloat(data[6]?.balance) +
                  parseFloat(data[48]?.balance) +
                  parseFloat(data[49]?.balance) +
                  parseFloat(data[25]?.balance) +
                  parseFloat(data[50]?.balance) +
                  parseFloat(data[51]?.balance) +
                  parseFloat(data[54]?.balance) +
                  parseFloat(data[70]?.balance)}
              </span>
            </div>
          </ExpandableItem>
          <div className="expandable-layout">
            <p>Total Pasivos</p>
            <span>
              {parseFloat(data[6]?.balance) +
                parseFloat(data[48]?.balance) +
                parseFloat(data[49]?.balance) +
                parseFloat(data[25]?.balance) +
                parseFloat(data[50]?.balance) +
                parseFloat(data[51]?.balance) +
                parseFloat(data[54]?.balance) +
                parseFloat(data[70]?.balance)}
            </span>
          </div>
        </ExpandableItem>
        <ExpandableItem title="Capital">
          <ExpandableItem title="Capital, Reserva y Superávit">
            <div className="expandable-layout">
              <p>CAPITAL SUSCRITO Y PAGADO</p>
              <span>{data[75]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RESUMEN DE GANANCIAS O PÉRDIDAS</p>
              <span>{data[58]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>REVALUACIÓN DE ACTIVOS</p>
              <span>{data[62]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RESULTADOS DEL PERIODO</p>
              <span>0.00</span>
            </div>
            <div className="expandable-layout">
              <p>RESERVA LEGAL</p>
              <span>{data[65]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>UTILIDADES NO DISTRIBUIDAS</p>
              <span>{data[67]?.balance}</span>
            </div>

            <div className="expandable-layout">
              <p>
                <b>Total Capital</b>
              </p>
              <span>
                {parseFloat(data[75]?.balance) +
                  parseFloat(data[58]?.balance) +
                  parseFloat(data[62]?.balance) +
                  parseFloat(data[65]?.balance) +
                  parseFloat(data[67]?.balance)}
              </span>
            </div>
            <div className="expandable-layout">
              <p>Total Pasivos y Capital</p>
              <span>
                {parseFloat(data[6]?.balance) +
                  parseFloat(data[48]?.balance) +
                  parseFloat(data[49]?.balance) +
                  parseFloat(data[25]?.balance) +
                  parseFloat(data[50]?.balance) +
                  parseFloat(data[51]?.balance) +
                  parseFloat(data[54]?.balance) +
                  parseFloat(data[70]?.balance) +
                  parseFloat(data[75]?.balance) +
                  parseFloat(data[58]?.balance) +
                  parseFloat(data[62]?.balance) +
                  parseFloat(data[65]?.balance) +
                  parseFloat(data[67]?.balance)}
              </span>
            </div>
          </ExpandableItem>
        </ExpandableItem>
        <ExpandableItem title="Ingresos">
          <ExpandableItem title="Ingresos">
            <div className="expandable-layout">
              <p>INTERESES COBRADOS</p>
              <span>{data[133]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INGRESOS POR MORA</p>
              <span>{data[74]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INTERESES BANCARIOS</p>
              <span>{data[70]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>OTROS INGRESOS</p>
              <span>{data[76]?.balance}</span>
            </div>

            <div className="expandable-layout">
              <p>
                <b>Total Ingresos</b>
              </p>
              <span>
                {parseFloat(data[70]?.balance) +
                  parseFloat(data[74]?.balance) +
                  parseFloat(data[76]?.balance) +
                  parseFloat(data[133]?.balance)}
              </span>
            </div>
          </ExpandableItem>
        </ExpandableItem>
        <ExpandableItem title="Gastos">
          <ExpandableItem title="Gastos">
            <div className="expandable-layout">
              <p>SUELDOS</p>
              <span>{data[135]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>PREAVISO Y CESANTÍA</p>
              <span>{data[92]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INFOTEP</p>
              <span>{data[85]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>VACACIONES</p>
              <span>{data[87]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>REGALÍA PASCUAL</p>
              <span>{data[84]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>SEGURO FAMILIAR DE SALUD</p>
              <span>{data[25]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>PLAN DE PENSIÓN Y JUBILACIÓN</p>
              <span>{data[49]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>RIESGO LABORAL</p>
              <span>{data[50]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>BONIFICACIONES</p>
              <span>{data[88]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>TELÉFONO</p>
              <span>{data[91]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>COMBUSTIBLE</p>
              <span>{data[90]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>COMISIONES</p>
              <span>{data[96]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INTERESES PAGADOS A DEPOSITANTES</p>
              <span>{data[97]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>NOTIFICACIONES</p>
              <span>{data[80]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>OPOSICIONES</p>
              <span>{data[81]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>INCAUTACIONES</p>
              <span>{data[95]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>REGISTRO DE CONTRATOS</p>
              <span>{data[83]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>MASTERIAL GASTABLE</p>
              <span>{data[108]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>CARGOS Y COMISIONES BANCARIAS</p>
              <span>{data[127]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>DEPRECIACIÓN</p>
              <span>{data[29]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>SUSCRIPCIONES</p>
              <span>{data[99]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>PÉRDIDAS INCOBRABLES</p>
              <span>{data[101]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>OTRAS REMUNERACIONES A EMPLEAR</p>
              <span>{data[113]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>COMISION Y OTROS SERVICIOS BA</p>
              <span>{data[138]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>MISCELANEOS</p>
              <span>{data[117]?.balance}</span>
            </div>
            <div className="expandable-layout">
              <p>
                <b>Total Gastos</b>
              </p>
              <span>
                {parseFloat(data[70]?.balance) +
                  parseFloat(data[74]?.balance) +
                  parseFloat(data[76]?.balance) +
                  parseFloat(data[133]?.balance)}
              </span>
            </div>
          </ExpandableItem>
        </ExpandableItem>
      </div>
    </div>
  );
}

export { GeneralBalanceScreen };
