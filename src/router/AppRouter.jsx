import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "../view/Dashboard";
import Login from "../view/Login";

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
