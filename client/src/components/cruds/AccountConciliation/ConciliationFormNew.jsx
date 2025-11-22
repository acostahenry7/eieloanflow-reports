import React, { useEffect, useState, useContext } from "react";
import Modal from "../../Modal";
import { getOutletsApi } from "../../../api/outlet";
import { AuthContext } from "../../../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createConciliationApi,
  getBankAccountsApi,
  getBankTransactionsApi,
  getMajorGeneral,
} from "../../../api/accounting";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { BiCheck } from "react-icons/bi";
import { getLabelByTransactionType } from "../../../utils/stringFunctions";
import "./index.css";

const ConciliationFormNew = ({ isPrevData, setIsFormOpened }) => {
  const { auth } = React.useContext(AuthContext);
  const [outlets, setOutlets] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [diaryTransactions, setDiaryTransactions] = useState([]);
  const [transitTransactions, setTransitTransactions] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchedText, setSearchText] = useState("");

  const currentItem = {};

  const form = useFormik({
    initialValues: {
      description: currentItem?.description || "",
      dateFrom:
        currentItem?.start_date?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      dateTo:
        currentItem?.end_date?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      createdBy: "",
      lastModifiedBy: "",
      diaryBalance: 0,
      bankBalance: 0,
      bankAccountId: currentItem?.bank_account_id || "",
      outletId: currentItem?.outlet_id || "",
      file: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      description: Yup.string().required("Favor colocar descripcion"),
    }),
    onSubmit: (values) => {
      const selected = diaryTransactions.filter((dt) =>
        checkedItems.includes(dt.transaction_id)
      );

      values.file = null;
      values.createdBy = auth.login;
      values.lastModifiedBy = auth.login;

      const data = {
        ...values,
        transactions: selected.map((item) => ({
          local: { ...item, status_type: "COMPLETED" },
        })),
      };

      if (transitTransactions.length > 0) {
        data.transactions.push(
          ...transitTransactions.map((item) => ({
            local: {
              ...item,
              status_type: "TRANSIT",
            },
          }))
        );
      }
      console.log(data);
      createConciliationApi(data)
        .then((res) => {
          console.log(res);
          setIsFormOpened(false);
        })

        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          //setIsFormOpened(false);
        });
    },
  });

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getOutletsApi({ userOutletsId: auth.outlet_id }).then((res) => res),
    ])
      .then(([outletsData]) => {
        console.log(outletsData.body);
        setOutlets(outletsData.body);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadFormInfo = async () => {
      //Loading accounts
      const accounts = await getBankAccountsApi({
        outletId: form.values.outletId,
      });

      setBankAccounts(accounts.body);
    };

    loadFormInfo();
  }, [form.values.outletId]);

  useEffect(() => {
    const params = { ...form.values };

    if (form.values.dateFrom) params.dateFrom = form.values.dateFrom;

    loadPrevBalance(params, form.values.outletId);
  }, [form.values.bankAccountId, form.values.dateFrom, form.values.dateTo]);

  useEffect(() => {
    getBankTransactionsApi({
      outletId: form.values.outletId,
      bankAccountId: form.values.bankAccountId,
      dateFrom: form.values.dateFrom,
      dateTo: form.values.dateTo,
    }).then((res) => {
      console.log(res);
      setDiaryTransactions(res.body.transactions);
    });
  }, [
    form.values.outletId,
    form.values.bankAccountId,
    form.values.dateFrom,
    form.values.dateTo,
  ]);

  //   Funciones para cargar mostrar el balance anterior del diario hasta la fecha
  const loadPrevBalance = async (values, outletId) => {
    try {
      const res = await getMajorGeneral({ ...values, outletId });

      //setPrevBalances(res.body.balanceByAccount);
      updateDiaryBalance(form.values.bankAccountId, res.body.balanceByAccount);

      console.log();
    } catch (error) {}
  };

  const updateDiaryBalance = (bankId, balances) => {
    //if (!balances) balances = prevBalances;
    const catalogId = bankAccounts.find(
      (ac) => ac.bank_account_id == bankId
    )?.account_catalog_id;
    const account = balances.find(
      (account) => account.account_catalog_id == catalogId
    );

    console.log(balances, account);
    form.setFieldValue(
      "diaryBalance",

      Math.abs(
        parseFloat(account?.credit || 0) - parseFloat(account?.debit || 0)
      )
    );
  };

  const handleCheck = (id) => {
    setCheckedItems(
      (prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id) // uncheck
          : [...prev, id] // check
    );
  };

  const handleCheckAll = () => {
    setCheckedItems((prev) =>
      prev.length > 0
        ? []
        : [...[...diaryTransactions].map((item) => item.transaction_id)]
    );
  };

  const handleSendToTransit = () => {
    const arr = [...diaryTransactions].filter(
      (dt) => !checkedItems.includes(dt.transaction_id)
    );

    setTransitTransactions((prev) => [...prev, ...arr]);
    setDiaryTransactions((prev) =>
      [...prev].filter((dt) => checkedItems.includes(dt.transaction_id))
    );
  };

  const handleSendToDiaryTransactions = (id) => {
    const arr = [...transitTransactions];
    const transaction = arr.find((item) => item.transaction_id === id);
    const newTransit = arr.filter((item) => item.transaction_id !== id);

    setTransitTransactions(newTransit);
    setDiaryTransactions((prev) => [...prev, transaction]);
  };

  const filteredTransactions = diaryTransactions
    .filter((item) => {
      const date = item.target_date.split("-").reverse().join("");
      const matchText = item?.description?.toLowerCase() + date.toLowerCase();

      return matchText?.includes(searchedText.toLowerCase());
    })
    .sort((a, b) => new Date(a.target_date) - new Date(b.target_date));

  const totalTransitTransactions = transitTransactions
    .filter((dt) => !checkedItems.includes(dt.general_diary_number_id))
    .reduce(
      (acc, t) =>
        t.transaction_type == "ENTRY"
          ? acc + parseFloat(t.amount)
          : acc - parseFloat(t.amount),
      0
    );

  //Final Balances
  const bankBalance = (
    parseFloat(form.values.bankBalance) + totalTransitTransactions
  ).toFixed(2);

  const diaryBalance = (
    parseFloat(form.values.diaryBalance || 0) +
    diaryTransactions
      ?.filter((dt) => checkedItems.includes(dt.transaction_id))
      .reduce((acc, item) => {
        return item.transaction_type == "ENTRY"
          ? acc + parseFloat(item.amount)
          : acc - parseFloat(item.amount);
      }, 0) +
    totalTransitTransactions
  ).toFixed(2);

  return (
    <Modal>
      {/*HEADER */}
      <div className="form-header">
        <h3>{isPrevData ? "Editar" : "Nueva"} conciliación Manual</h3>
        <hr />
      </div>
      {/* FORM FIELDS */}
      <div style={{ height: "80vh", overflow: "auto", paddingBottom: 32 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
            position: "relative",
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="conciliation_form_group">
              <label>Descripción</label>
              <input
                type="text"
                value={form.values.description}
                onChange={(e) =>
                  form.setFieldValue("description", e.target.value)
                }
              />
              <span style={{ color: "red", fontSize: 12 }}>
                {form.errors.description}
              </span>
            </div>
            <div className="conciliation_form_group">
              <label>Sucursal</label>
              <select
                name=""
                id=""
                value={form.values.outletId}
                onChange={(e) => form.setFieldValue("outletId", e.target.value)}
              >
                {outlets.map((o) => (
                  <option key={o.outlet_id} value={o.outlet_id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red", fontSize: 12 }}>{}</span>
            </div>
            <div className="conciliation_form_group">
              <label>Cuenta bancaria</label>
              <select
                name=""
                id=""
                value={form.values.bankAccountId}
                onChange={(e) =>
                  form.setFieldValue("bankAccountId", e.target.value)
                }
              >
                {bankAccounts.map((a) => (
                  <option key={a.bank_account_id} value={a.bank_account_id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red", fontSize: 12 }}>{}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }} className="conciliation_form_group">
                <label>Desde</label>
                <input
                  type="date"
                  name=""
                  id=""
                  value={form.values.dateFrom}
                  onChange={(e) =>
                    form.setFieldValue("dateFrom", e.target.value)
                  }
                />
                <span style={{ color: "red", fontSize: 12 }}>{}</span>
              </div>
              <div style={{ flex: 1 }} className="conciliation_form_group">
                <label>Hasta</label>
                <input
                  type="date"
                  name=""
                  id=""
                  value={form.values.dateTo}
                  onChange={(e) => form.setFieldValue("dateTo", e.target.value)}
                />
                <span style={{ color: "red", fontSize: 12 }}>{}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }} className="conciliation_form_group">
                <label>
                  Balance en diario al{" "}
                  {form.values.dateFrom.split("-").reverse().join("/")}
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={
                    form.values.diaryBalance
                      ? currencyFormat(form.values.diaryBalance, false)
                      : 0
                  }
                  onChange={(e) => {
                    form.setFieldValue("diaryBalance", e.target.value);
                  }}
                />
                <span style={{ color: "red", fontSize: 12 }}>{}</span>
              </div>
              <div style={{ flex: 1 }} className="conciliation_form_group">
                <label>
                  Balance en banco al{" "}
                  {form.values.dateTo.split("-").reverse().join("/")}
                </label>
                <input
                  type="number"
                  name=""
                  id=""
                  value={form.values.bankBalance}
                  onChange={(e) => {
                    form.setFieldValue("bankBalance", e.target.value);
                  }}
                />
                <span style={{ color: "red", fontSize: 12 }}>{}</span>
              </div>
            </div>
          </div>
        </div>
        {/* CONCILIATION LAYOUT*/}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <h4 style={{ marginBottom: 26 }}>
              Conciliar Transacciones ({filteredTransactions.length})
            </h4>
            <span
              style={{
                backgroundColor: "rgb(190, 255, 226)",
                padding: 6,
                borderRadius: 6,
                cursor: "pointer",
              }}
              onClick={handleCheckAll}
            >
              Conciliar todas
            </span>
          </div>
          <div className="conciliation_form_group">
            <input
              type="text"
              value={searchedText}
              placeholder="Buscar..."
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div style={{ borderRadius: 20, overflowX: "hidden", maxHeight: 420 }}>
          <div
            className="manual_conciliation_item"
            style={{
              fontWeight: 600,
              position: "sticky",
              top: 0,
              width: "calc(100% - 24px)",
              backgroundColor: "white",
            }}
          >
            <div>Fecha</div>
            <div>No. diario</div>
            <div>Monto</div>
            <div style={{ flexGrow: 2 }}>Descripción</div>
            <div>Tipo de transacción</div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>
          </div>
          {filteredTransactions.map((dt) => {
            const isChecked = checkedItems.includes(dt.transaction_id);

            return (
              <div
                key={dt.transaction_id}
                className={`manual_conciliation_item ${
                  isChecked ? "checked" : ""
                }`}
              >
                <div>{dt.target_date.split("-").reverse().join("/")}</div>
                <div>{dt.general_diary_number_id}</div>
                <div>{dt.amount}</div>
                <div style={{ flexGrow: 2 }}>{dt.description}</div>
                <div>{getLabelByTransactionType(dt.transaction_type)}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{ cursor: "pointer", marginRight: 20 }}
                    onClick={() => handleCheck(dt.transaction_id)}
                  >
                    <BiCheck
                      color={isChecked ? "white" : "green"}
                      size={20}
                      style={{
                        background: isChecked ? "green" : "transparent",
                        borderRadius: "50%",
                        padding: 2,
                      }}
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="manual_conciliation_button"
            style={{
              backgroundColor: "#fad36a",
              color: "48390b",
              marginTop: 30,
            }}
            onClick={handleSendToTransit}
          >
            Enviar no conciliadas a tránsito
          </button>
        </div>
        {transitTransactions.length > 0 && (
          <h4 style={{ marginBottom: 26 }}>Transacciones en tránsito</h4>
        )}
        {transitTransactions.length > 0 && (
          <div
            style={{ borderRadius: 20, overflowX: "hidden", maxHeight: 420 }}
          >
            <div
              className="manual_conciliation_item"
              style={{
                fontWeight: 600,
                position: "sticky",
                top: 0,
                width: "calc(100% - 24px)",
                backgroundColor: "white",
              }}
            >
              <div>Fecha</div>
              <div>No. diario</div>
              <div>Monto</div>
              <div>Descripción</div>
              <div>Tipo de transacción</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {/* <span style={{ cursor: "pointer" }}>
              <BiCheck
                color="green"
                size={20}
                onClick={() => {
                  console.log("hi");
                }}
              />
            </span> */}
              </div>
            </div>
            {transitTransactions.map((dt) => {
              const isChecked = checkedItems.includes(
                dt.general_diary_number_id
              );

              return (
                <div
                  key={dt.general_diary_number_id}
                  className={`manual_conciliation_item ${
                    isChecked ? "checked" : ""
                  }`}
                >
                  <div>{dt.target_date.split("-").reverse().join("/")}</div>
                  <div>{dt.general_diary_number_id}</div>
                  <div>{dt.amount}</div>
                  <div>{dt.description}</div>
                  <div>{dt.transaction_type}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span
                      style={{ cursor: "pointer", marginRight: 20 }}
                      onClick={() =>
                        handleSendToDiaryTransactions(dt.transaction_id)
                      }
                    >
                      X
                      {/* <BiCheck
                        color={isChecked ? "white" : "green"}
                        size={20}
                        style={{
                          background: isChecked ? "green" : "transparent",
                          borderRadius: "50%",
                          padding: 2,
                        }}
                      /> */}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: 30 }}>
          <p>
            Balance en banco al {form.values.dateTo}:{" "}
            <b>{currencyFormat(bankBalance)}</b>
          </p>
          <p>
            Balance en Libro al {form.values.dateTo}:{" "}
            <b>{currencyFormat(diaryBalance)}</b>
          </p>
        </div>
      </div>
      <div className="form-footer">
        <button onClick={() => setIsFormOpened(false)}>Cancelar</button>
        <button
          className={`${bankBalance != diaryBalance ? "disabled" : ""}`}
          //disabled={false}
          type="button"
          onClick={() => form.handleSubmit()}
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
};

export default ConciliationFormNew;
