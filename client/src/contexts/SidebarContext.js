import React from "react";

const SidebarContext = React.createContext({});

function SidebarProvider({ children }) {
  const [isSidebarOpened, setIsSidebarOpened] = React.useState(true);

  const ctxValue = {
    isSidebarOpened,
    setIsSidebarOpened,
  };

  return (
    <SidebarContext.Provider value={ctxValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export { SidebarContext, SidebarProvider };
