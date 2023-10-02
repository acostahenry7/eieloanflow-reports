import React from "react";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const defaultToken = () => {
    if (sessionStorage.getItem("session") != "undefined") {
      return JSON.parse(sessionStorage.getItem("session"))?.user_id;
    } else {
      return "";
    }
  };

  const [token, setToken] = React.useState(defaultToken());

  const login = (data) => {
    console.log(data);
    sessionStorage.setItem("session", JSON.stringify(data));
    setToken(data.user_id);
  };

  const logout = () => {
    sessionStorage.setItem("session", JSON.stringify({}));
    setToken(undefined);
  };

  const auth = (() => {
    if (sessionStorage.getItem("session") != "undefined") {
      return JSON.parse(sessionStorage.getItem("session")) || {};
    }
  })();

  let ctxValue = {
    login,
    logout,
    auth,
    token,
    setToken,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
