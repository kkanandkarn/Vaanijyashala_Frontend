import React from "react";
import logo from "../../public/icon.png";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-slate-900 flex justify-center items-center">
      <div className="flex gap-4 justify-center items-center w-2/3">
        <img src={logo} alt="Page not found" className="w-56 h-56" />
        <div className="flex flex-col">
          <div className="text-white font-Poppins font-bold text-[100px] text-center">
            404
          </div>
          <div className="text-white font-Poppins font-bold text-3xl w-fyll text-center pb-5">
            Sorry, The page you requested for was not found on the server.
          </div>
          <div className="flex justify-center">
            <div
              className="text-green-400 text-xl text-center border-2 border-green-500 w-20 h-10 flex justify-center items-center rounded-full cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Home
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
