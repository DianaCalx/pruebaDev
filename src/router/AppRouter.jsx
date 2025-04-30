import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "../views/Dashboard";
import Login from "../views/Login";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
