import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchFromApi } from "../../store/apiSlice";
import { hideLoader, showLoader } from "../../components/Loader";
import {
  ADD_ROLE,
  ADD_ROLE_METHOD,
  ROLE_STATUS,
  ROLE_STATUS_METHOD,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
} from "../../ApiEndpoints";
import toast, { Toaster } from "react-hot-toast";

interface Role {
  id: string;
  title: string;
  status: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  permissionName: string;
}

const AddRole = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [globalPermissions, setGlobalPermissions] = useState<Permission[]>([]);
  const [inputRole, setInputRole] = useState<string>("");
  const [roleError, setRoleError] = useState<Boolean>(false);
  const [roleErrorMsg, setRoleErrorMsg] = useState<string>("");

  const roleExists = (roleTitle: string) => {
    return roles.some(
      (role) => role.title.toLowerCase() === roleTitle.toLowerCase()
    );
  };

  const fetchRoles = async () => {
    showLoader();
    try {
      const response = await fetchFromApi<{
        status: string;
        data: { roles: Role[] };
      }>(VIEW_ROLE, VIEW_ROLE_METHOD);
      if (response.status === "success") {
        setRoles(response.data.roles);
        hideLoader();
      } else {
        throw new Error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError("Error fetching roles.");
      hideLoader();
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);
  console.log(roles);

  const addRole = async () => {
    if (inputRole.trim() == "") {
      setRoleError(true);
      setRoleErrorMsg("Role is required");
      setInputRole("");
      return;
    }
    if (roleExists(inputRole)) {
      setRoleError(true);
      setRoleErrorMsg("Role already exists.");
      return;
    }
    showLoader();
    try {
      const data = {
        title: inputRole,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        ADD_ROLE,
        ADD_ROLE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Role added Successfully.");
        setRoleError(false);
        fetchRoles();
        setInputRole("");
        hideLoader();
      } else {
        toast.error(response.message);
        setRoleError(false);
        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setRoleError(false);
      hideLoader();
    }
  };

  const handleRoleStatus = async (roleId: string) => {
    showLoader();
    try {
      const data = {
        roleId: roleId,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        ROLE_STATUS,
        ROLE_STATUS_METHOD,
        data
      );

      if (response.status === "success") {
        setRoleError(false);
        fetchRoles();
        hideLoader();
      } else {
        setRoleError(false);
        toast.error(response.message);

        hideLoader();
      }
    } catch (error: any) {
      setRoleError(false);
      console.error("Error:", error.message);

      hideLoader();
    }
  };

  return (
    <div className="h-screen flex bg-slate-600">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="border-t-2 px-4 border-b-2 h-10 flex items-center justify-start mt-2">
          <h1 className="font-Poppins text-xl text-white font-bold">
            Super Admin {">"} Add Role
          </h1>
        </div>
        <div className="flex-1 mt-4 px-12 overflow-y-auto custom-scrollbar">
          <h1 className="text-center text-white font-Poppins font-bold text-2xl">
            Add Role
          </h1>
          <div className="mt-4 flex justify-center gap-4 w-full">
            <input
              type="text"
              placeholder="Enter Role"
              value={inputRole}
              onChange={(e) => setInputRole(e.target.value)}
              className="rounded-lg p-2 w-6/12 outline-none bg-slate-700 text-white"
            />

            <div
              className="bg-slate-700 py-2 px-4 h-10 flex justify-center items-center rounded-lg text-white font-Poppins font-bold cursor-pointer"
              onClick={addRole}
            >
              Add
            </div>
          </div>
          {roleError && (
            <p className="text-center text-red-500 font-Poppins  text-base">
              {roleErrorMsg}
            </p>
          )}

          <div className="mt-4">
            <h2 className="text-center text-white font-Poppins font-bold text-xl">
              Existing Roles
            </h2>
            <div className="mt-4 flex flex-col">
              {roles.map((role, index) => (
                <div
                  key={role.id}
                  className="bg-slate-700 p-4 rounded-lg shadow-md text-white hover:bg-slate-500 transition-colors flex justify-between items-center px-8 mt-4"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-bold font-Poppins">{index + 1}.</p>
                    <h3 className="text-lg font-bold font-Poppins">
                      {role.title}
                    </h3>
                  </div>
                  <div
                    className={`border-2 px-4 py-2  w-20 h-10 rounded-lg flex justify-center items-center cursor-pointer ${
                      role.status === "Active"
                        ? "border-green-400"
                        : "border-red-400"
                    }`}
                    onClick={() => handleRoleStatus(role.id)}
                  >
                    <p
                      className={`text-sm font-Poppins font-bold ${
                        role.status === "Active"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {role.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
