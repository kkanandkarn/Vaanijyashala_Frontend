import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Roles from "./pages/Admin/Roles";
import AddRole from "./pages/Admin/AddRole";

import Users from "./pages/Admin/Users";
import AddUser from "./pages/Admin/AddUser";

import useReload from "./hooks/useReload";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { showLoader, hideLoader } from "./components/Loader";
import Permissions from "./pages/Admin/Permissions";
import State from "./pages/State/State";
import AddState from "./pages/State/AddState";
import NotFound from "./pages/NotFound";
import AddDistrict from "./pages/State/AddDistrict";

function App() {
  const [loading, setLoading] = useState(false);

  const { isDataFetched } = useReload();

  useEffect(() => {
    console.log("isDataFetched: ", isDataFetched);
    if (!loading && isDataFetched) {
      // hideLoader();
      return;
    }
    if (loading || !isDataFetched) {
      // showLoader();
      return;
    }
  }, [loading, isDataFetched]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route
          path="/super-admin-dashboard"
          element={<AdminDashboard />}
        ></Route>
        <Route path="/add-role" element={<AddRole />}></Route>
        <Route path="/roles" element={<Roles />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/add-user" element={<AddUser />}></Route>
        <Route path="/permissions" element={<Permissions />}></Route>
        <Route path="/states" element={<State />}></Route>
        <Route path="/add-state" element={<AddState />}></Route>
        <Route path="/states/add-district" element={<AddDistrict />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
