import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Layout from "../Layout";
import AdminDashboard from "./Admin/AdminDashboard";
import DataOperatorDashboard from "./DataOperator/DataOperatorDashboard";
import { useNavigate } from "react-router-dom";

// Define the mapping object type
type DashboardComponents = {
  [key: string]: React.ComponentType;
};

// Create the mapping object
const dashboardComponents: DashboardComponents = {
  "Super Admin": AdminDashboard,
  "Data Entry Operator": DataOperatorDashboard,
};

const Dashboard: React.FC = () => {
  const authData = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("vs-token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Get the component based on the role, or fall back to a default
  const RoleDashboardComponent =
    dashboardComponents[authData.role] || (() => <div>Role not found</div>);

  return (
    <Layout title={"States - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"} Dashboard
        </h1>
      </div>
      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <RoleDashboardComponent />
      </div>
    </Layout>
  );
};

export default Dashboard;
