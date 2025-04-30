import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UserContext } from "./UserContext";

const url = "http://150.136.43.88:8064/api/DataTableToJson/GetDataToJson";

const LS_INFO_KEY = "info";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [info, setInfo] = useState({});
  const [tableData, setTableData] = useState();
  const { setItemLS } = useLocalStorage(LS_INFO_KEY);

  const postUser = async ({ onSuccess, onError }) => {
    const value = {
      string_csql: `spValidarUsarioPassword @Email='${user.email}',@Password='${user.password}'`,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const currentData = await response.json();

      if (currentData.ds.table1) {
        const newInfo = {
          usuario: currentData.ds.table[0].usuario,
          empresa: currentData.ds.table1[0].empresa,
          sucursal: currentData.ds.table2[0].sucursal,
        };
        setInfo(newInfo);
        setItemLS(newInfo);
        onSuccess();
      } else {
        onError();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postTable = async () => {
    const value = {
      string_csql: `spGetTableroVentaMaestro @Empresa = '${info.empresa}', @Sucursal=${info.sucursal}, @Usuario='${info.usuario}'`,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const currentData = await response.json();
      setTableData(currentData.ds.table);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        info,
        user,
        tableData,
        setUser,
        setInfo,
        postUser,
        postTable,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
