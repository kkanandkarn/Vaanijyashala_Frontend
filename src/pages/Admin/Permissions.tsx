import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { hideLoader, showLoader } from "../../components/Loader";
import { fetchFromApi } from "../../store/apiSlice";
import { VIEW_PERMISSIONS, VIEW_PERMISSIONS_METHOD } from "../../ApiEndpoints";

interface Permissions {
  id: string;
  permissionName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Permissions = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [permissionList, setPermissionList] = useState<Permissions[]>([]);
  const authData = useSelector((state: RootState) => state.auth);
  const fetchPermissions = async () => {
    showLoader();
    try {
      const response = await fetchFromApi<{
        status: string;
        data: { permissions: Permissions[] };
      }>(VIEW_PERMISSIONS, VIEW_PERMISSIONS_METHOD);
      if (response.status === "success") {
        setPermissionList(response.data.permissions);
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
    const requiredPermission = "VIEW-PERMISSIONS";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      return;
    } else {
      fetchPermissions();
    }
  }, []);
  return (
    <Layout title={"Permissions - VaanijyaShala"}>
      <div className="border-t-2 px-4 border-b-2 h-12 py-2 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold">
          {authData.role} {">"} Permissions
        </h1>
      </div>
      <div className="flex flex-col px-10  mt-5 overflow-y-auto custom-scrollbar">
        <h1 className="text-center text-white font-bold font-Poppins text-2xl pb-4">
          Permissions
        </h1>
        {permissionList.map((permission, index) => (
          <div
            key={permission.id}
            className="bg-slate-700 p-4 rounded-lg shadow-md text-white hover:bg-slate-500 transition-colors flex justify-between items-center px-8 mt-4"
          >
            <div className="flex items-center gap-2">
              <p className="font-bold font-Poppins">{index + 1}.</p>
              <h3 className="text-lg font-bold font-Poppins">
                {permission.permissionName}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`border-2 px-4 py-2  w-20 h-10 rounded-lg flex justify-center items-center cursor-pointer ${
                  permission.status === "Active"
                    ? "border-green-400"
                    : "border-red-400"
                }`}
              >
                <p
                  className={`text-sm font-Poppins font-bold ${
                    permission.status === "Active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {permission.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Permissions;
