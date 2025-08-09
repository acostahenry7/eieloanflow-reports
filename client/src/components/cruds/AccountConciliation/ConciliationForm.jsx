import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Datatable } from "../../Datatable";
import { BiBlock, BiCheck, BiUpload } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import {
  createConciliationApi,
  getBankAccountsApi,
  getBanksApi,
  getMajorGeneral,
  loadFileTransactionsApi,
} from "../../../api/accounting";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { getOutletsApi } from "../../../api/outlet";
import { AuthContext } from "../../../contexts/AuthContext";
import { Oval } from "react-loader-spinner";
import "./index.css";
import {
  getLabelByBankTransactionType,
  getLabelByTransactionType,
} from "../../../utils/stringFunctions";

const ConciliationForm = ({
  prevData,
  setPrevData,
  isFormOpened,
  setIsFormOpened,
  onRefetch,
}) => {
  const isPrevData = prevData?.transactions?.length > 0;

  let currentItem = undefined;

  if (isPrevData) {
    currentItem = prevData;
  }
  //   const [file, setFile] = useState(null);
  const { auth } = React.useContext(AuthContext);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);
  const [selectedBankTransactions, setSelectedBankTransactions] = useState([]);
  const [conciliatedTransactions, setConciliatedTransactions] = useState([]);
  const [transitTransactions, setTransitTransactions] = useState([]);
  const [prevBalances, setPrevBalances] = useState([]);
  const loadersSize = 18;

  //Loaders
  const [isFirstSectionLoading, setIsFirstSectionLoading] = useState(false);
  const [isSecondSectionLoading, setIsSecondSectionLoading] = useState(false);
  const [isThirdSectionLoading, setIsThirdSectionLoading] = useState(false);

  const totalBankTransactions = bankTransactions
    .filter((item) => item.selected)
    .reduce((acc, t) => acc + parseFloat(t.bank.amount), 0);

  const totalLocalTransactions = data
    .filter((item) => item.selected)
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const totalTransitTransactions = transitTransactions.reduce(
    (acc, t) =>
      t.transaction_type == "ENTRY"
        ? acc + parseFloat(t.amount)
        : acc - parseFloat(t.amount),
    0
  );

  const getBankAccounts = async (outletId) => {
    try {
      setAccounts([]);
      setIsFirstSectionLoading(true);
      const res = await getBankAccountsApi({ outletId });
      setIsFirstSectionLoading(false);
      setAccounts(res.body);

      if (!isPrevData) {
        form.setFieldValue(
          "bankAccountId",
          res?.body[0]?.bank_account_id || null
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadPreviousData = async () => {
      setIsFirstSectionLoading(true);
      const userOutlets = await getOutletsApi({
        userOutletsId: auth.outlet_id,
      });
      setOutlets(userOutlets.body);

      const userBanks = await getBanksApi();
      setBanks(userBanks.body);
      setIsFirstSectionLoading(false);

      if (isPrevData) {
        setConciliatedTransactions(prevData.transactions);
        getBankAccounts(prevData.outlet_id);
      }
    };

    if (isFormOpened == true) {
      loadPreviousData();
    }
  }, [isFormOpened]);

  const form = useFormik({
    initialValues: {
      description: currentItem?.description || "",
      dateFrom:
        currentItem?.start_date.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      dateTo:
        currentItem?.end_date.split("T")[0] ||
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
      values.file = null;

      values.createdBy = auth.login;
      values.lastModifiedBy = auth.login;

      for (let i = 0; i < conciliatedTransactions.length; i++) {
        if (Array.isArray(conciliatedTransactions[i].local) == false) {
          conciliatedTransactions[i].local = [
            { ...conciliatedTransactions[i].local },
          ];
        }
      }

      console.log(values);
      console.log(transitTransactions);

      createConciliationApi({
        ...values,
        transactions: [
          ...conciliatedTransactions,
          ...transitTransactions.map((item) => ({ local: [item] })),
        ],
      })
        .then((res) => {
          onRefetch();
        })
        .catch((err) => {})
        .finally(() => {
          handleCloseForm();
        });
    },
  });

  console.log(transitTransactions);

  const conciliateTransaction = () => {
    let bTIndex = -1;
    const bT = [...bankTransactions].filter((item, index) => {
      if (item.selected && item.selected == true) {
        bTIndex = index;
        return true;
      }
    });
    let lTIndexes = [];
    const lT = [...data]
      .filter((item, index) => {
        if (item.selected && item.selected == true) {
          let i = [...data].findIndex(
            (sbItem) => sbItem.transaction_id == item.transaction_id
          );
          lTIndexes.push(i);
          return true;
        }
      })
      .map((item) => {
        item.selected = false;
        return item;
      });

    console.log(lT);

    const obj = {
      bank: bT[0].bank,
      local: lT,
    };

    console.log(obj);

    setData((prev) =>
      prev.filter((item, index) => lTIndexes.some((i) => i == index) == false)
    );
    setBankTransactions((prev) =>
      prev.filter((item, index) => index != bTIndex)
    );
    setConciliatedTransactions((prev) => [...prev, obj]);

    // setBankTransactions((prev) =>
    //   prev.filter((item) => item.selected == false)
    // );
    // setConciliatedTransactions((prev) => [...prev, obj]);
    // console.log(conciliateTransaction)
    //console.log(conciliatedTransactions.map((item) => (item.selected = false)));
  };

  const discardTransaction = (transaction) => {
    console.log(transaction);
    if (Array.isArray(transaction.local) == false) {
      transaction.local = [{ ...transaction.local }];
    }
    let currentTransactions = [...conciliatedTransactions];
    const bankIndex = currentTransactions.findIndex(
      (item) => item.bank.id == transaction.bank.id
    );

    currentTransactions.splice(bankIndex, 1);
    setConciliatedTransactions(currentTransactions);
    setData((prev) => [...prev, ...transaction.local]);
    setBankTransactions((prev) => [...prev, transaction]);
  };

  const selectTransaction = (type, id) => {
    let arr = [];
    let index;
    if (type == "local") {
      arr = [...data];
      index = arr.findIndex((item) => item.transaction_id == id);
    } else {
      arr = [...bankTransactions];

      index = arr.findIndex((item) => item.bank.id == id);
    }

    if (arr[index].selected && arr[index].selected == true) {
      arr[index].selected = false;
    } else {
      arr[index].selected = true;
    }

    type == "local" ? setData(arr) : setBankTransactions(arr);
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.bank.date,
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Cuenta",
      selector: (row) => row.bank.bank_account,
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Descripción",
      selector: (row) =>
        isPrevData ? row.transaction_description : row.bank.description,
      width: "180px",
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Referencia",
      selector: (row) =>
        row.bank.reference_bank ||
        row.local.reference_bank ||
        row.local.bank_reference,
      width: "140px",
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Banco",
      selector: (row) => (
        <b style={{ fontSize: 16 }}>
          {" "}
          {currencyFormat(row.bank.amount, false)}
        </b>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    // {
    //   name: "Diario",
    //   selector: (row) => (
    //     <b style={{ fontSize: 16 }}>
    //       {" "}
    //       {currencyFormat(row.local.diary_amount || 0, false)}
    //     </b>
    //   ),
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },

    // {
    //   name: "Banco (sistema)",
    //   selector: (row) => <b> {currencyFormat(row.local_amount || 0, false)}</b>,
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },
    {
      name: "Tipo transacción",
      selector: (row) =>
        getLabelByBankTransactionType(row.bank.transaction_type),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    !isPrevData && {
      name: "Conciliar",
      selector: (row) =>
        row.local ? (
          row.local.is_conciliated == false ? (
            <BiCheck
              style={{ cursor: "pointer" }}
              onClick={() => conciliateTransaction(row.local)}
              color="green"
              size={24}
            />
          ) : (
            <IoMdClose
              style={{ cursor: "pointer" }}
              onClick={() => discardTransaction(row)}
              color="red"
              size={24}
            />
          )
        ) : (
          <BiBlock
            size={24}
            color={"red"}
            title="Transacción no registrada o se encuetra en tránsito"
            style={{ cursor: "help" }}
          />
        ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
  ];

  const transitColumns = [
    {
      name: "Fecha",
      selector: (row) => row.target_date,
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Cuenta",
      selector: (row) => row.bank_number,
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      width: "180px",
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Referencia",
      selector: (row) => row.reference,
      width: "140px",
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Banco",
      selector: (row) => (
        <b style={{ fontSize: 16 }}>
          {" "}
          {currencyFormat(parseFloat(row.amount), false)}
        </b>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    // {
    //   name: "Diario",
    //   selector: (row) => (
    //     <b style={{ fontSize: 16 }}>
    //       {" "}
    //       {currencyFormat(row.local.diary_amount || 0, false)}
    //     </b>
    //   ),
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },

    // {
    //   name: "Banco (sistema)",
    //   selector: (row) => <b> {currencyFormat(row.local_amount || 0, false)}</b>,
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },
    {
      name: "Tipo transacción",
      selector: (row) => getLabelByTransactionType(row.transaction_type),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    !isPrevData && {
      name: "Conciliar",
      selector: (row) =>
        row.local ? (
          row.local.is_conciliated == false ? (
            <BiCheck
              style={{ cursor: "pointer" }}
              onClick={() => conciliateTransaction(row.local)}
              color="green"
              size={24}
            />
          ) : (
            <IoMdClose
              style={{ cursor: "pointer" }}
              onClick={() => discardTransaction(row)}
              color="red"
              size={24}
            />
          )
        ) : (
          <BiBlock
            size={24}
            color={"red"}
            title="Transacción no registrada o se encuetra en tránsito"
            style={{ cursor: "help" }}
          />
        ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
  ];

  //console.log("DIARY TRANSACTOINS", data);

  const conciliatedColumns = [];

  const loadFileTransactions = async (values) => {
    try {
      setIsSecondSectionLoading(true);
      const res = await loadFileTransactionsApi(values);
      setData([]);
      // const trasactions = res.body.filter((item) => {
      //   if (
      //     conciliatedTransactions.some(
      //       (sbItem) => sbItem.transaction_id == item.transaction_id
      //     ) == false
      //   ) {
      //     return item;
      //   }
      // });

      //setData(trasactions.filter((item) => item.is_conciliated == false));

      console.log(res.body.unconciliated);

      setData(res.body.unconciliated);
      setBankTransactions(res.body.manualRevisions);
      setConciliatedTransactions(res.body.conciliated);
      setOriginalData(res.body);
      setTransitTransactions(res.body.transit);
      setIsSecondSectionLoading(false);
    } catch (error) {}
  };

  const loadPrevBalance = async (values, outletId) => {
    try {
      const res = await getMajorGeneral({ ...values, outletId });

      setPrevBalances(res.body.balanceByAccount);
      updateDiaryBalance(form.values.bankAccountId, res.body.balanceByAccount);

      console.log();
    } catch (error) {}
  };

  const updateDiaryBalance = (bankId, balances) => {
    if (!balances) balances = prevBalances;
    const catalogId = accounts.find(
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

  // useEffect(() => {
  //   updateDiaryBalance(form.bankId);
  // }, [form.bankId, form.dateFrom, form.dateTo]);

  const handleCloseForm = () => {
    setPrevData([]);
    setIsFormOpened(false);
  };

  //Final Balances
  const bankBalance =
    parseFloat(form.values.bankBalance) +
    conciliatedTransactions.reduce(
      (acc, item) =>
        item.bank.transaction_type == "CR"
          ? acc + parseFloat(item.bank.amount)
          : acc - parseFloat(item.bank.amount),
      0
    ) +
    totalTransitTransactions;

  const diaryBalance =
    parseFloat(form.values.diaryBalance || 0) +
    conciliatedTransactions?.reduce((acc, item) => {
      if (Array.isArray(item.local)) {
        const currentAmount = item.local.reduce(
          (acc2, sbItem) =>
            sbItem.transaction_type == "ENTRY"
              ? acc2 + parseFloat(sbItem.amount)
              : acc2 - parseFloat(sbItem.amount),
          0
        );

        return acc + currentAmount;
      } else {
        return item.local.transaction_type == "ENTRY"
          ? acc + parseFloat(item.local.amount)
          : acc - parseFloat(item.local.amount);
      }
    }, 0) +
    totalTransitTransactions;

  //console.log(conciliatedTransactions);

  return (
    <Modal>
      <div>
        <div className="form-header">
          <h3>{isPrevData ? "Editar" : "Nueva"} conciliación</h3>
          <hr />
        </div>
        <div className="form-body">
          <div className="form-section">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4>Informacion General</h4>
              {isFirstSectionLoading && (
                <Oval
                  color="var(--main-color)"
                  secondaryColor="lightgray"
                  width={loadersSize}
                  height={loadersSize}
                  strokeWidth={8}
                />
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <div className="SearchBar-main-item">
                <label>Descripción</label>
                <input
                  name=""
                  id=""
                  value={form.values.description}
                  onChange={(e) => {
                    form.setFieldValue(
                      "description",
                      e.target.value.toUpperCase()
                    );
                  }}
                />
                <span style={{ color: "red", fontSize: 12 }}>
                  {form.errors.description}
                </span>
              </div>

              <div className="SearchBar-main-item">
                <label>Sucursal</label>
                <select
                  name=""
                  id=""
                  value={form.values.outletId}
                  onChange={(e) => {
                    form.setFieldValue("outletId", e.target.value);
                    getBankAccounts(e.target.value)
                      .then((res) => {})
                      .catch((err) => {});

                    loadPrevBalance(form.values, e.target.value);
                  }}
                >
                  {outlets.map((o) => (
                    <option key={o.outlet_id} value={o.outlet_id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {accounts.length > 0 || prevData ? (
                <>
                  <div className="SearchBar-main-item">
                    <label>Cuenta Bancaria</label>
                    <select
                      name=""
                      id=""
                      value={form.values.bankAccountId}
                      onChange={(e) => {
                        form.setFieldValue("bankAccountId", e.target.value);
                        updateDiaryBalance(e.target.value);
                      }}
                    >
                      {accounts.map((a) => (
                        <option
                          key={a.bank_account_id}
                          value={a.bank_account_id}
                        >
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`SearchBar-secondary-item`}>
                    <label>Fecha</label>
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
                          value={form.values.dateFrom}
                          onChange={(e) => {
                            form.setFieldValue("dateFrom", e.target.value);
                            loadPrevBalance(
                              { ...form.values, dateFrom: e.target.value },
                              form.values.outletId
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
                          value={form.values.dateTo}
                          onChange={(e) => {
                            form.setFieldValue("dateTo", e.target.value);
                            //loadPrevBalance(form.values, form.values.outletId);
                          }}
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <span
                  style={{ alignSelf: "center", color: "red", fontSize: 12 }}
                >
                  No hay cuentas bancarias asociadas
                </span>
              )}
            </div>
          </div>
          <div className="form-section" style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {/* <h4>Balance del banco</h4>
              {isFirstSectionLoading && (
                <Oval
                  color="var(--main-color)"
                  secondaryColor="lightgray"
                  width={loadersSize}
                  height={loadersSize}
                  strokeWidth={8}
                />
              )} */}

              <div className="SearchBar-main-item" style={{ marginTop: 10 }}>
                <label>
                  Balance en banco al{" "}
                  {form.values.dateFrom.split("-").reverse().join("/")}
                </label>
                <input
                  name=""
                  id=""
                  type="number"
                  value={form.values.bankBalance}
                  onChange={(e) => {
                    form.setFieldValue("bankBalance", e.target.value);
                  }}
                />
              </div>
              <div className="SearchBar-main-item" style={{ marginTop: 10 }}>
                <label>
                  Balance en diario al{" "}
                  {form.values.dateFrom.split("-").reverse().join("/")}
                </label>
                <input
                  name=""
                  id=""
                  type="text"
                  disabled
                  value={
                    form.values.diaryBalance
                      ? currencyFormat(form.values.diaryBalance, false)
                      : 0
                  }
                  // onChange={(e) => {
                  //   form.setFieldValue("diaryBalance", e.target.value);
                  // }}
                />
              </div>
            </div>
          </div>
          {form.values.bankAccountId && (
            <>
              {!isPrevData && (
                <>
                  <div className="form-section upload-section">
                    <div>
                      <h4>Cargar las transacciones del banco</h4>
                      <input
                        type="file"
                        onChange={(e) => {
                          form.setFieldValue("file", e.target.files[0]);
                        }}
                      />
                    </div>
                    <button onClick={() => loadFileTransactions(form.values)}>
                      {" "}
                      <BiUpload /> Cargar transacciones
                    </button>
                  </div>

                  <div className="form-section">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <h4>Conciliación</h4>
                      {isSecondSectionLoading && (
                        <Oval
                          color="var(--main-color)"
                          secondaryColor="lightgray"
                          width={loadersSize}
                          height={loadersSize}
                          strokeWidth={8}
                        />
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: "60%" }}>
                        <h4 style={{ marginTop: 0 }}>
                          Transacciones del Banco (
                          {
                            bankTransactions.filter(
                              (t) =>
                                !t.bank.description
                                  .toLowerCase()
                                  .includes("servicio") &&
                                !t.bank.description
                                  .toLowerCase()
                                  .includes("impuesto") &&
                                !t.bank.description
                                  .toLowerCase()
                                  .includes("com.") &&
                                !t.bank.description
                                  .toLowerCase()
                                  .includes("comisi") &&
                                !t.bank.description
                                  .toLowerCase()
                                  .includes("reten")
                            ).length
                          }
                          ) / Cargos bancarios (
                          {
                            bankTransactions.filter(
                              (t) =>
                                t.bank.description
                                  .toLowerCase()
                                  .includes("servicio") ||
                                t.bank.description
                                  .toLowerCase()
                                  .includes("impuesto") ||
                                t.bank.description
                                  .toLowerCase()
                                  .includes("com.") ||
                                t.bank.description
                                  .toLowerCase()
                                  .includes("comisi") ||
                                t.bank.description
                                  .toLowerCase()
                                  .includes("reten")
                            ).length
                          }
                          )
                        </h4>
                        <div className="comparison-card">
                          <ul>
                            {bankTransactions
                              .filter(
                                (t) =>
                                  !t.bank.description
                                    .toLowerCase()
                                    .includes("servicio") &&
                                  !t.bank.description
                                    .toLowerCase()
                                    .includes("impuesto") &&
                                  !t.bank.description
                                    .toLowerCase()
                                    .includes("com.") &&
                                  !t.bank.description
                                    .toLowerCase()
                                    .includes("comisi") &&
                                  !t.bank.description
                                    .toLowerCase()
                                    .includes("reten")
                              )
                              .map((item) => (
                                <li
                                  onClick={() =>
                                    selectTransaction("bank", item.bank.id)
                                  }
                                  className={`${
                                    item.selected ? "active" : "disabled"
                                  }`}
                                >
                                  <input
                                    checked={item.selected}
                                    type="checkbox"
                                  />
                                  <label htmlFor="card-bank-trans">
                                    <p>
                                      <b>Fecha: </b> {item.bank.date}
                                    </p>
                                    <p>
                                      <b>Referencia: </b> {item.bank.reference}
                                    </p>
                                    <p>
                                      <b>Tipo: </b>{" "}
                                      {getLabelByBankTransactionType(
                                        item.bank.transaction_type
                                      )}
                                    </p>
                                    <p>
                                      <b>Cuenta: </b> {item.bank.bank_account}
                                    </p>
                                    <p>
                                      <b>Monto: </b>{" "}
                                      <span
                                        style={{
                                          color: "green",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.bank.amount}
                                      </span>
                                    </p>
                                    <p style={{}}>
                                      <b>Descripcion: </b>{" "}
                                      {item.bank.description}
                                    </p>
                                  </label>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <p>
                          Total transacciones:{" "}
                          {currencyFormat(totalBankTransactions)}
                        </p>
                        <p>
                          Total cargos{" "}
                          {currencyFormat(
                            bankTransactions
                              .filter(
                                (t) =>
                                  t.bank.description
                                    .toLowerCase()
                                    .includes("servicio") ||
                                  t.bank.description
                                    .toLowerCase()
                                    .includes("impuesto")
                              )
                              .reduce((acc, i) => acc + i.bank.amount, 0)
                          )}
                        </p>
                      </div>
                      <div style={{ width: "40%" }}>
                        <h4 style={{ marginTop: 0 }}>
                          Transacciones del Diario ({data.length})
                        </h4>
                        <div className={"comparison-card"}>
                          <ul>
                            {data.map((item) => (
                              <li
                                className={`${
                                  item.selected ? "active" : "disabled"
                                }`}
                                onClick={() =>
                                  selectTransaction(
                                    "local",
                                    item.transaction_id
                                  )
                                }
                              >
                                <input
                                  checked={item.selected}
                                  type="checkbox"
                                />
                                <label htmlFor="card-bank-trans">
                                  <p>
                                    <b>Fecha: </b> {item.target_date}
                                  </p>
                                  <p>
                                    <b>Referencia: </b>{" "}
                                    {item.bank_reference || item.reference_bank}
                                  </p>
                                  <p>
                                    <b>Tipo: </b>{" "}
                                    {getLabelByTransactionType(
                                      item.transaction_type
                                    )}
                                  </p>
                                  <p>
                                    <b>Cuenta: </b> {item.bank_number}
                                  </p>
                                  <p>
                                    <b>Monto: </b>
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item.amount}
                                    </span>
                                  </p>
                                  <p style={{}}>
                                    <b>Descripcion: </b>{" "}
                                    {item.diary_description}
                                  </p>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p>{currencyFormat(totalLocalTransactions)}</p>
                      </div>
                      {/* <Datatable
                        columns={columns}
                        data={data}
                        customStyles={{ marginTop: 0 }}
                      /> */}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className={`${
                          totalLocalTransactions == totalBankTransactions &&
                          totalBankTransactions > 0
                            ? ""
                            : "disabled-btn"
                        }`}
                        disabled={
                          totalLocalTransactions == totalBankTransactions &&
                          totalBankTransactions > 0
                            ? false
                            : true
                        }
                        onClick={() => conciliateTransaction()}
                        style={{
                          margin: "10px 10px 0 0",
                          backgroundColor: "var(--main-color)",
                          padding: "8px 12px",
                          borderRadius: 4,
                          border: "none",
                          color: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Emparejar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {/* <div className="form-section">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4>Transacciones en transito</h4>
              {isThirdSectionLoading && (
                <Oval
                  color="var(--main-color)"
                  secondaryColor="lightgray"
                  width={loadersSize}
                  height={loadersSize}
                  strokeWidth={8}
                />
              )}
            </div>
            <div style={{}}>
              <Datatable
                columns={columns}
                data={conciliatedTransactions}
                customStyles={{ marginTop: 0 }}
              />
            </div>
          </div> */}
          <div className="form-section">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4>Transacciones en tránsito</h4>
              {isThirdSectionLoading && (
                <Oval
                  color="var(--main-color)"
                  secondaryColor="lightgray"
                  width={loadersSize}
                  height={loadersSize}
                  strokeWidth={8}
                />
              )}
            </div>
            <div style={{}}>
              <Datatable
                columns={transitColumns}
                data={transitTransactions}
                customStyles={{ marginTop: 0 }}
              />
            </div>
          </div>
          <div className="form-section">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4>
                Transacciones conciliadas ({conciliatedTransactions.length})
              </h4>
              {isThirdSectionLoading && (
                <Oval
                  color="var(--main-color)"
                  secondaryColor="lightgray"
                  width={loadersSize}
                  height={loadersSize}
                  strokeWidth={8}
                />
              )}
            </div>
            <div style={{}}>
              <Datatable
                columns={columns}
                data={conciliatedTransactions}
                customStyles={{ marginTop: 0 }}
                dtOptions={{
                  expandableRows: true,
                  expandableRowsComponent: ({ data }) => {
                    if (Array.isArray(data.local) == false) {
                      data.oldLocal = data.local;
                      data.local = [];
                      data.local.push(data.oldLocal);
                    }

                    console.log(data);
                    return (
                      <div
                        style={{
                          backgroundColor: "aliceblue",
                          boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)",
                          padding: "20px",
                        }}
                      >
                        <Datatable
                          columns={[
                            {
                              name: "No. Diario",
                              selector: (row) => row.general_diary_number_id,
                              sortable: true,
                              reorder: true,
                              wrap: true,
                              omit: false,
                            },
                            {
                              name: "Fecha",
                              selector: (row) => row.target_date,
                              sortable: true,
                              reorder: true,
                              wrap: true,
                              omit: false,
                            },
                            {
                              name: "Cuenta",
                              selector: (row) => row.bank_number,
                              sortable: true,
                              reorder: true,
                              wrap: true,
                              omit: false,
                            },
                            {
                              name: "Diario",
                              selector: (row) => (
                                <b style={{ fontSize: 16 }}>
                                  {" "}
                                  {currencyFormat(row.amount || 0, false)}
                                </b>
                              ),
                              sortable: true,
                              reorder: true,
                              wrap: true,
                              omit: false,
                            },
                            {
                              name: "Descriipcion",
                              selector: (row) => row.diary_description,
                              sortable: true,
                              reorder: true,
                              wrap: true,
                              omit: false,
                            },
                          ]}
                          data={data.local}
                        />
                      </div>
                    );
                  },
                }}
              />
            </div>
          </div>

          {/* <div>
            <p>
              Balance en banco (No Conciliado):{" "}
              <b>
                {currencyFormat(
                  data.reduce(
                    (acc, item) => acc + parseFloat(item.local_amount),
                    0
                  )
                )}
              </b>
            </p>
            <p>
              Balance en Diario (No conciliado):{" "}
              <b>
                {currencyFormat(
                  data.reduce(
                    (acc, item) => acc + parseFloat(item.diary_amount),
                    0
                  )
                )}
              </b>
            </p>
          </div> */}
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
          <button onClick={handleCloseForm}>Cancelar</button>
          <button
            className={`${bankBalance != diaryBalance ? "disabled" : ""}`}
            disabled={bankBalance != diaryBalance ? true : false}
            onClick={form.handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConciliationForm;
