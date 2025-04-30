import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router";
import Spinner from "../Components/Spinner";
import "./Dashboard.css";

const formatDate = (fecha) => {
  const currentDate = new Date(fecha);
  return new Intl.DateTimeFormat("es-ES").format(currentDate);
};
const Dashboard = () => {
  const navigate = useNavigate();
  const { tableData, postTable, info, setInfo } = useContext(UserContext);
  const [localTable, setLocalTable] = useState([]);
  const [search, setSearch] = useState("");
  const [valuesPerClients, setValuesPerClients] = useState([]);

  useEffect(() => {
    postTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!info?.empresa) {
      navigate("/");
    }
  }, [info, navigate]);

  useEffect(() => {
    console.clear();
    console.log("tableData", tableData);
    if (tableData) {
      setLocalTable(tableData);

      const addPerClient = tableData?.reduce((acc, item) => {
        const nombre = item.clienteNombre;
        const importe = item.importeTotal || 0;

        if (!acc[nombre]) {
          acc[nombre] = 0;
        }

        acc[nombre] += importe;

        return acc;
      }, {});

      const arrayClients = Object.entries(addPerClient).map(
        ([nombre, total]) => ({
          nombre,
          total,
        })
      );

      console.log(arrayClients);
      setValuesPerClients(arrayClients);
    }
  }, [navigate, tableData]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") {
      setLocalTable(tableData);
      return;
    }

    const filtered = tableData.filter((t) =>
      [t.mov, t.cliente, t.clienteNombre].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );

    setLocalTable(filtered);
  };

  const handleLogout = () => {
    setInfo({});
    // navigate("/");
  };

  return !tableData ? (
    <Spinner />
  ) : (
    <div className="container">
      <button
        className="back"
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
              type="text"
              value={search}
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSearch}
            >
              Search
            </button>
          </form>

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
                  <td>${t.importeTotal}</td>
                  <td>{formatDate(t.fechaEmision)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
