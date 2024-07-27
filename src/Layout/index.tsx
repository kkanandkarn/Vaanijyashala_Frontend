import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { Helmet } from "react-helmet";

const Layout = ({ children, title = "Vaanijyashala" }: any) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="h-screen flex bg-slate-600">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-1/5 h-full">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
