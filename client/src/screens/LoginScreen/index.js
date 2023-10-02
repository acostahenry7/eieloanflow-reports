import React from "react";
import { useFormik } from "formik";
import logo from "../../media/logo-fianance.png";

import { loginApi } from "../../api/auth";
import { AuthContext } from "../../contexts/AuthContext";
import "./index.css";

function LoginScreen() {
  const { login } = React.useContext(AuthContext);

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      let { username, password } = values;
      try {
        const res = await loginApi(username, password);
        if (res.error === true) {
          throw new Error(res.body);
        }
        console.log(res.body[0]);

        login(res.body[0]);
        resetForm();

        console.log(res);
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <div className="LoginScreen-container">
      <img src={logo} />
      <div className="LoginScreen-form">
        <p>Iniciar sesión</p>
        <div className="LoginScreen-form-section">
          <label>Nombre de usuario</label>
          <input
            type="text"
            placeholder=""
            value={loginForm.values.username}
            onChange={(e) =>
              loginForm.setFieldValue("username", e.target.value)
            }
          />
        </div>
        <div className="LoginScreen-form-section">
          <label>Contraseña</label>
          <input
            value={loginForm.values.password}
            onChange={(e) =>
              loginForm.setFieldValue("password", e.target.value)
            }
            type="password"
            placeholder=""
          />
        </div>
        <div className="LoginScreen-form-section">
          <button onClick={loginForm.handleSubmit}>Acceder</button>
        </div>
      </div>
      <span>Copyright © Finance Management System</span>
    </div>
  );
}

export { LoginScreen };
