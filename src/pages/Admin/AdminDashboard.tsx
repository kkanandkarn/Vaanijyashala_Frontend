import React from "react";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="h-screen flex">
      <div className="w-2/12">
        <Sidebar />
      </div>
      <div className="">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
