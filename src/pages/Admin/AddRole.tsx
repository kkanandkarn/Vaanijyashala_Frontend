import { useEffect, useState } from "react";

import { fetchFromApi } from "../../store/apiSlice";
import { hideLoader, showLoader } from "../../components/Loader";
import {
  ADD_ROLE,
  ADD_ROLE_METHOD,
  DELETE_ROLE,
  DELETE_ROLE_METHOD,
  EDIT_ROLE,
  EDIT_ROLE_METHOD,
  ROLE_STATUS,
  ROLE_STATUS_METHOD,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
} from "../../ApiEndpoints";
import toast from "react-hot-toast";

import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

import { Button, CircularProgress, TextField } from "@mui/material";
import { FaSave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Layout from "../../Layout";
import useReload from "../../hooks/useReload";

interface Role {
  id: string;
  title: string;
  alias: string;
  status: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  permissionName: string;
}

const AddRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const [inputRole, setInputRole] = useState<string>("");
  const [inputRoleAlias, setInputRoleAlias] = useState<string>("");
  const [roleError, setRoleError] = useState<Boolean>(false);
  const [roleErrorMsg, setRoleErrorMsg] = useState<string>("");
  const [modal, setModal] = useState<Boolean>(false);
  const [editRoleId, setEditRoleId] = useState<string>("");
  const [editRoleName, setEditRoleName] = useState<string>("");
  const [modalError, setModalError] = useState<Boolean>(false);
  const [modalErrorMsg, setModalErrorMsg] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<Boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => state.auth);
  const { isDataFetched } = useReload();
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

      hideLoader();
    }
  };

  useEffect(() => {
    if (!isDataFetched) {
      return;
    }
    const requiredPermission = "ADD-ROLE";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      hideLoader();
      return;
    } else {
      fetchRoles();
      hideLoader();
    }
  }, [isDataFetched]);
  if (!isDataFetched) {
    showLoader();
  }

  const roleExists = (roleTitle: string) => {
    return roles.some(
      (role) => role.title.toLowerCase() === roleTitle.toLowerCase()
    );
  };
  const roleAliasExists = (roleAlias: string) => {
    return roles.some(
      (role) => role.alias.toLowerCase() === roleAlias.toLowerCase()
    );
  };

  const handleEditRole = (id: string, title: string) => {
    setModal(true);
    setEditRoleId(id);
    setEditRoleName(title);
  };

  const handleDeleteRole = (id: string) => {
    setDeleteModal(true);
    setDeleteRoleId(id);
  };

  const addRole = async () => {
    if (inputRole.trim() == "") {
      setRoleError(true);
      setRoleErrorMsg("Role is required");
      setInputRole("");

      return;
    }
    if (inputRoleAlias.trim() == "") {
      setRoleError(true);
      setRoleErrorMsg("Role alias is required");
      setInputRoleAlias("");
      return;
    }
    if (roleExists(inputRole)) {
      setRoleError(true);
      setRoleErrorMsg("Role already exists.");
      return;
    }
    if (roleAliasExists(inputRoleAlias)) {
      setRoleError(true);
      setRoleErrorMsg("Duplicate alias found.");
      return;
    }
    // showLoader();
    try {
      setLoading(true);
      const data = {
        title: inputRole,
        alias: inputRoleAlias,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        ADD_ROLE,
        ADD_ROLE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Role added Successfully.");
        setLoading(false);
        setRoleError(false);
        fetchRoles();
        setInputRole("");
        setInputRoleAlias("");
        // hideLoader();
      } else {
        toast.error(response.message);
        setLoading(false);
        setRoleError(false);
        setInputRoleAlias("");
        // hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setLoading(false);
      setRoleError(false);

      // hideLoader();
    }
  };

  const editRole = async () => {
    if (editRoleName.trim() == "") {
      setModalError(true);
      setModalErrorMsg("Role is required");
      setEditRoleName("");
      return;
    }
    if (roleExists(editRoleName)) {
      setModalError(true);
      setModalErrorMsg("Role already exists.");
      return;
    }
    setModal(false);
    setModalError(false);
    showLoader();
    try {
      const data = {
        id: editRoleId,
        title: editRoleName,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        EDIT_ROLE,
        EDIT_ROLE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Role updated Successfully.");
        setModalError(false);
        fetchRoles();
        setEditRoleName("");
        hideLoader();
      } else {
        toast.error(response.message);
        setModalError(false);
        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setModalError(false);
      hideLoader();
    }
  };
  const deleteRole = async () => {
    setDeleteModal(false);
    showLoader();
    try {
      const data = {
        id: deleteRoleId,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        DELETE_ROLE,
        DELETE_ROLE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Role Deleted Successfully.");
        fetchRoles();
        hideLoader();
      } else {
        toast.error(response.message);

        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);

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
    <Layout title={"Add Role - VaanijyaShala"}>
      <div className="border-t-2 px-4 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold">
          {authData.role} {">"} Add Role
        </h1>
      </div>
      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <h1 className="text-center mt-4 text-white font-Poppins font-bold text-2xl">
          Add Role
        </h1>

        <form className="grid grid-cols-2 gap-4 p-4 bg-slate-600 rounded-md mt-10">
          <TextField
            label="Role"
            variant="outlined"
            value={inputRole}
            onChange={(e) => setInputRole(e.target.value)}
            fullWidth
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <TextField
            label="Alias"
            variant="outlined"
            value={inputRoleAlias}
            onChange={(e) => setInputRoleAlias(e.target.value)}
            fullWidth
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <div className="col-span-2 flex justify-center mt-2">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#11772E",
                "&:hover": { backgroundColor: "#45a049" },
                "&.Mui-disabled": {
                  backgroundColor: "#11772E",
                  color: "white",
                },
              }}
              onClick={addRole}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "white", marginRight: 1 }}
                />
              ) : (
                <div className="mr-2">
                  <FaSave />
                </div>
              )}
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>

        {roleError && (
          <p className="text-center text-red-500 font-Poppins  text-base">
            {roleErrorMsg}
          </p>
        )}

        <div className="mt-4">
          <h2 className="text-center text-white font-Poppins font-bold text-xl">
            Existing Roles
          </h2>
          <div className="overflow-x-auto mt-4 px-4">
            <table className="min-w-full bg-slate-700 rounded-lg shadow-md">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-2 px-4 text-left">S. No.</th>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Alias</th>
                  <th className="py-2 px-4 text-left">Action</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {roles?.map((role, index) => (
                  <tr
                    className="border-b bg-slate-600 hover:bg-slate-500 text-white"
                    key={index}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{role.title}</td>
                    <td className="py-2 px-4">{role.alias}</td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <div
                        className="text-2xl cursor-pointer flex items-center"
                        onClick={() => handleEditRole(role.id, role.title)}
                      >
                        <CiEdit color="skyblue" />
                      </div>
                      <div
                        className="text-2xl cursor-pointer flex items-center"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <MdDeleteOutline color="red" />
                      </div>
                    </td>
                    <td className="py-2 px-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modal && (
        <Modal customStyle="h-30 w-96 rounded-lg p-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex-1 text-center text-xl font-Poppins text-white">
              Edit Role
            </div>
            <div className="w-6 h-6 flex justify-center items-center">
              <div
                className="border-2 border-red-400 rounded-full w-6 h-6 flex justify-center items-center font-bold text-red-400 cursor-pointer"
                onClick={() => {
                  setModal(false);
                  setModalError(false);
                }}
              >
                X
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-5 items-center w-full">
            <input
              type="text"
              placeholder="Edit Role"
              value={editRoleName}
              onChange={(e) => setEditRoleName(e.target.value)}
              className="rounded-lg p-2 w-full outline-none  bg-slate-800 text-white"
            />
            <div
              className="font-Poppins text-3xl rounded-full cursor-pointer flex items-center justify-center "
              onClick={editRole}
            >
              {/* <FaEdit color="#810FE6" size={30} /> */}
              <CiEdit color="skyblue" />
            </div>
          </div>
          {modalError && (
            <div className="text-center mt-1 h- font-Poppins text-red-500">
              {modalErrorMsg}
            </div>
          )}
        </Modal>
      )}

      {deleteModal && (
        <Modal customStyle="h-52 w-72 rounded-lg p-4">
          <div className="text-center text-sky-600 font-Poppins font-bold py-2 text-xl border-b-2 border-b-sky-500">
            Delete Confirmation
          </div>
          <div className="text-white font-Poppins font-bold text-center mt-4">
            Are you sure want to remove this role ?
          </div>
          <div className="flex justify-between p-4 mt-2">
            <div
              className="text-red-500 border-red-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </div>
            <div
              className="text-green-500 border-green-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={deleteRole}
            >
              Confirm
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default AddRole;
