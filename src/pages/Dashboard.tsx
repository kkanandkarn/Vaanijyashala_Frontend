import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const authData = useSelector((state: RootState) => state.auth);

  return (
    <div className="h-screen flex bg-slate-600">
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col px-0 py-4">
        <div className="border-t-2 border-b-2 h-10 flex items-center justify-start mt-2">
          <h1 className="font-Poppins text-xl text-white font-bold px-4">
            {authData.role} {">"} Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
