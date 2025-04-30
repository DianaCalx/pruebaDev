import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router";
import Spinner from "../Components/Spinner";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./Dashboard.css";

const LS_INFO_KEY = "info";

const transformChartData = (rows) => {
  const addPerClient = rows?.reduce((acc, item) => {
    const nombre = item.clienteNombre;
    const importe = item.importeTotal || 0;

    if (!acc[nombre]) {
      acc[nombre] = 0;
    }

    acc[nombre] += importe;

    return acc;
  }, {});

  const arrayClients = Object.entries(addPerClient).map(([nombre, total]) => ({
    nombre,
    total,
  }));
  return arrayClients;
};

const formatDate = (fecha) => {
  const currentDate = new Date(fecha);
  return new Intl.DateTimeFormat("es-ES").format(currentDate);
};

const formatToUSD = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { tableData, postTable, info, setInfo, setUser } =
    useContext(UserContext);
  const [localTable, setLocalTable] = useState([]);
  const [search, setSearch] = useState("");
  const [valuesPerClients, setValuesPerClients] = useState([]);
  const { getItemLS, removeItemLS } = useLocalStorage(LS_INFO_KEY);

  useEffect(() => {
    if (info.empresa && !tableData) {
      postTable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  useEffect(() => {
    const verifyInfo = () => {
      const infoLS = getItemLS();
      if (!info?.empresa && !infoLS) {
        navigate("/");
      }
      if (!info?.empresa && infoLS) {
        setInfo(infoLS);
      }
    };
    verifyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItemLS, navigate, setInfo]);

  useEffect(() => {
    if (tableData) {
      setLocalTable(tableData);
      const arrayClients = transformChartData(tableData);
      setValuesPerClients(arrayClients);
    }
  }, [navigate, tableData]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") {
      setLocalTable(tableData);
      const arrayClients = transformChartData(tableData);
      setValuesPerClients(arrayClients);
      return;
    }

    const filtered = tableData.filter((t) =>
      [t.mov, t.cliente, t.clienteNombre].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );

    setLocalTable(filtered);
    const arrayClients = transformChartData(filtered);
    setValuesPerClients(arrayClients);
  };

  const handleLogout = () => {
    removeItemLS();
    setInfo({});
    setUser({ email: "", password: "" });
  };

  return !tableData ? (
    <Spinner />
  ) : (
    <div className="container">
      <button
        className="logout"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="table__container">
        <div>
          <form
            className="table__form"
            onSubmit={(e) => handleSearch(e)}
          >
            <input
              className="table__search"
              type="text"
              value={search}
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="table__button"
              type="submit"
              onClick={handleSearch}
            >
              Search
            </button>
          </form>

          <div className="container__table">
            <table className="table">
              <thead>
                <tr>
                  <th>Mov</th>
                  <th>Cliente</th>
                  <th>Nombre Cliente</th>
                  <th>Importe</th>
                  <th>Fecha Emision</th>
                </tr>
              </thead>
              <tbody>
                {localTable?.map((t) => (
                  <tr key={t.id}>
                    <td>{t.mov}</td>
                    <td>{t.cliente}</td>
                    <td>{t.clienteNombre}</td>
                    <td>{formatToUSD(t.importeTotal)}</td>
                    <td>{formatDate(t.fechaEmision)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <BarChart
            height={500}
            series={[
              {
                data: valuesPerClients.map((client) => client.total),
                label: "Clients",
                id: "clients",
                color: "rgb(0, 0, 153)",
              },
            ]}
            xAxis={[
              {
                data: valuesPerClients.map((client) => client.nombre),
                scaleType: "band",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
