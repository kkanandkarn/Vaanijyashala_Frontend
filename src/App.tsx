import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

import Hello from "./pages/Hello";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Roles from "./pages/Admin/Roles";
import AddRole from "./pages/Admin/AddRole";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
        <Route path="/add-role" element={<AddRole />}></Route>
        <Route path="/roles" element={<Roles />}></Route>
      </Routes>
    </>
  );
}

export default App;
