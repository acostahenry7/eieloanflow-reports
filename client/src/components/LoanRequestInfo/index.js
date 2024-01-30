import React from "react";
import "./index.css";
import { currencyFormat } from "../../utils/reports/report-helpers";

function LoanRequestInfo({ data }) {
  return (
    <div>
      <div className="LoanReq-section">
        <h3>Datos Generales</h3>
        <ul>
          <li>
            <span>Nombre</span>
            <span>{data?.customer_name}</span>
          </li>
          <li>
            <span>Fecha de nacimiento</span>
            <span>{data?.birth_date}</span>
          </li>
          <li>
            <span>Móvil</span>
            <span>{data?.mobile || "(Sin teléfono móvil)"}</span>
          </li>
          <li>
            <span>Provincia</span>
            <span>{data?.province}</span>
          </li>
          <li>
            <span>Calle y Número</span>
            <span>{data?.street}</span>
          </li>
          <li>
            <span>Sexo</span>
            <span>{data?.sex == "MALE" ? "Masculino" : "Femenino"}</span>
          </li>
          <li>
            <span>Nacionalidad</span>
            <span>{data?.nationality.toLowerCase()}</span>
          </li>
          <li>
            <span>Monto Solicitado</span>
            <span>{currencyFormat(data?.requested_amount)}</span>
          </li>
          <li>
            <span>Municipio</span>
            <span>{data?.municipality.toLowerCase()}</span>
          </li>
          <li>
            <span>Sector</span>
            <span>{data?.section.toLowerCase()}</span>
          </li>
          <li>
            <span>Cédula</span>
            <span>{data?.identification}</span>
          </li>
          <li>
            <span>Teléfono</span>
            <span>{data?.phone}</span>
          </li>
          <li>
            <span>Tipo de vivienda</span>
          </li>
          <li>
            <span>Tiempo en esta dirección</span>
            <span>
              {data?.year_living} año
              {(data?.year_living > 1 && "s") ||
                (data?.year_living == 0 && "s")}{" "}
              {""}y {data?.month_living} mes
              {(data?.month_living > 1 && "es") ||
                (data?.month_living == 0 && "es")}
            </span>
          </li>
        </ul>
        <h3>Información Laboral</h3>
        <ul>
          <li>
            <span>Nombre de la empresa</span>
            <span>{data?.work_place_company}</span>
          </li>
          <li>
            <span>Tipo de empresa</span>
            <span>{data?.work_place_company_type}</span>
          </li>
          <li>
            <span>Otros Ingresos</span>
            <span>{currencyFormat(data?.work_place_other_income)}</span>
          </li>
          <li>
            <span>Tiempo</span>
            <span>{data?.work_place_journey || "(Sin teléfono móvil)"}</span>
          </li>
          <li>
            <span>Tiempo en la empresa</span>
            <span>
              {data?.work_place_years} año
              {(data?.work_place_years > 1 && "s") ||
                (data?.work_place_years == 0 && "s")}{" "}
              {""}y {data?.work_place_months} mes
              {(data?.work_place_months > 1 && "es") ||
                (data?.work_place_months == 0 && "es")}
            </span>
          </li>
          <li>
            <span>Ocupación</span>
            <span>{data?.ocupation}</span>
          </li>
          <li>
            <span>Ingreso Mensual</span>
            <span>{currencyFormat(data?.monthly_income)}</span>
          </li>
          <li>
            <span>Calle y Número</span>
            <span>{data?.street}</span>
          </li>
          <li>
            <span>Municipio</span>
            <span>{data?.municipality.toLowerCase()}</span>
          </li>
          <li>
            <span>Sector</span>
            <span>{data?.section.toLowerCase()}</span>
          </li>
        </ul>
        <h3>Garante</h3>
        <ul>
          <li>
            <span>Nombre</span>
            <span>{data?.guarantor_name || "No garante"}</span>
          </li>
        </ul>
        {data.vehicle_brand && (
          <>
            <h3>Datos del vehículo</h3>
            <ul>
              <li>
                <span>Costo</span>
                <span>{currencyFormat(data?.vehicle_amount)}</span>
              </li>
              <li>
                <span>Marca</span>
                <span>{data?.vehicle_brand}</span>
              </li>
              <li>
                <span>Model</span>
                <span>{data?.vehicle_model}</span>
              </li>
              <li>
                <span>Año</span>
                <span>{data?.vehicle_year}</span>
              </li>
              <li>
                <span>Tipo</span>
                <span>{data?.vehicle_type}</span>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default LoanRequestInfo;
