import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

import { hideLoader, showLoader } from "../../components/Loader";
import {
  VIEW_USERS,
  VIEW_USERS_METHOD,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
  CREATE_USER,
  CREATE_USER_METHOD,
  EDIT_USER,
  EDIT_USER_METHOD,
  DELETE_USER,
  DELETE_USER_METHOD,
  USER_STATUS,
  USER_STATUS_METHOD,
} from "../../ApiEndpoints";
import { fetchFromApi } from "../../store/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "../../components/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaSave } from "react-icons/fa";
import Layout from "../../Layout";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import useReload from "../../hooks/useReload";
interface Users {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  role: Role;
  isLogin: Boolean;
  referralCode?: string;
  referredUsers?: number;
  status: string;
}
interface Role {
  id: string;
  title: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  role: Yup.string().required("Role is required"),
});

const Users = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [editPerm, setEditPerm] = useState<Boolean>(true);
  const [deletePerm, setDeletePerm] = useState<Boolean>(true);
  const [modal, setModal] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<Boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const authData = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { isDataFetched } = useReload();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchUsers = async () => {
    showLoader();
    try {
      const response = await fetchFromApi<{
        status: string;
        data: { users: Users[] };
      }>(VIEW_USERS, VIEW_USERS_METHOD);
      if (response.status === "success") {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (!isDataFetched) {
      return;
    }
    const requiredPermission = "VIEW-USER";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      hideLoader();
      return;
    } else {
      fetchUsers();
      hideLoader();
    }
    const editPermName = "EDIT-USER";
    const deletePermName = "DELETE-USER";
    const hasEditPerm = authData.permissions.some(
      (perm) => perm.permissionName === editPermName
    );
    const hasDeletePerm = authData.permissions.some(
      (perm) => perm.permissionName === deletePermName
    );
    setEditPerm(hasEditPerm);
    setDeletePerm(hasDeletePerm);
    fetchUsers();
  }, [isDataFetched]);
  if (!isDataFetched) {
    showLoader();
  }

  const handleEditValue = (
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setId(id);
    setName(name);
    setEmail(email);
    setPassword(password);
    setRole(role);

    setModal(true);
  };
  const handleDeleteValue = (id: string) => {
    setDeleteModal(true);
    setDeleteId(id);
  };
  useEffect(() => {
    formik.setValues({
      id: id,
      name: name,
      email: email,
      password: password,
      role: role,
    });
  }, [name, email, password, role]);

  const formik = useFormik({
    initialValues: {
      id: id,
      name: name,
      email: email,
      password: password,
      role: role,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetchFromApi<{
          status: string;
          message: string;
        }>(EDIT_USER, EDIT_USER_METHOD, values);
        if (response.status === "success") {
          toast.success("User updated Successfully.");
          setLoading(false);
          await fetchUsers();
          setModal(false);
          formik.resetForm();
        } else {
          toast.error(response.message);
          setLoading(false);
          setModal(false);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Error:", error.message);
        setLoading(false);
        setModal(false);
      }
    },
  });

  const handleDeleteUser = async () => {
    setDeleteModal(false);
    showLoader();
    try {
      const data = {
        id: deleteId,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        DELETE_USER,
        DELETE_USER_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("User Deleted Successfully.");
        await fetchUsers();
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

  const handleStatusChange = async (id: string, status: string) => {
    showLoader();
    try {
      const data = {
        id: id,
        status: status,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        USER_STATUS,
        USER_STATUS_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Status Updated");
        await fetchUsers();
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

  return (
    <Layout title={"Users - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"} Users
        </h1>
      </div>
      <div className="overflow-x-auto mt-4 px-4">
        <table className="min-w-full bg-slate-700 rounded-lg shadow-md">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="py-2 px-4 text-center">Sr No</th>
              <th className="py-2 px-4 text-center">UniqueId</th>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Email</th>
              <th className="py-2 px-4 text-center">Role</th>

              <th className="py-2 px-4 text-center">Status</th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                className="border-b bg-slate-600 hover:bg-slate-500 text-white"
                key={index}
              >
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4 text-center">{user.uniqueId}</td>
                <td className="py-2 px-4 text-center">{user.name}</td>
                <td className="py-2 px-4 text-center">{user.email}</td>
                <td className="py-2 px-4 text-center">{user.role.title}</td>

                <td className="py-2 px-4 text-center">
                  <select
                    className={`border-2 p-1 rounded-full cursor-pointer font-Poppins bg-slate-600 text-center outline-none ${
                      user.status === "Active"
                        ? "text-green-500 border-green-500"
                        : user.status === "Hold"
                        ? "text-yellow-500 border-yellow-500"
                        : "text-red-500 border-red-500"
                    }`}
                    defaultValue={user.status}
                    onChange={(e) =>
                      handleStatusChange(user.id, e.target.value)
                    }
                  >
                    <option value="Active" className="text-green-500">
                      Active
                    </option>
                    <option value="Hold" className="text-yellow-500">
                      Hold
                    </option>
                    <option value="Suspended" className="text-red-500">
                      Suspended
                    </option>
                  </select>
                </td>

                <td className="py-2 px-4 text-center">
                  <div className="flex items-center gap-2 text-xl justify-center">
                    <div
                      onClick={() =>
                        editPerm &&
                        handleEditValue(
                          user.id,
                          user.name,
                          user.email,
                          "",
                          user.role.id
                        )
                      }
                      className={`${
                        editPerm ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <CiEdit color="skyblue" />
                    </div>
                    <div
                      onClick={() => deletePerm && handleDeleteValue(user.id)}
                      className={`${
                        deletePerm ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <MdDeleteOutline color="#ef4444" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal customStyle="h-1/2 w-1/2 rounded-lg px-4 py-2">
          <div className=" flex items-center justify-end">
            <div
              className="border-2 w-7 h-7 flex items-center justify-center border-red-500 rounded-full text-red-500 mt-2 cursor-pointer"
              onClick={() => setModal(false)}
            >
              X
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-2 gap-4  bg-slate-700 rounded-md mt-10"
          >
            <TextField
              label="Name"
              variant="outlined"
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
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Email"
              variant="outlined"
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
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              InputLabelProps={{
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
              InputProps={{
                style: { color: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff style={{ color: "white" }} />
                      ) : (
                        <Visibility style={{ color: "white" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControl
              fullWidth
              variant="outlined"
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
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <InputLabel id="role-label" style={{ color: "white" }}>
                Role
              </InputLabel>
              <Select
                labelId="role-label"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
                name="role"
                style={{ color: "white" }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.title}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p style={{ color: "red", marginTop: "0.25rem" }}>
                  {formik.errors.role}
                </p>
              )}
            </FormControl>
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
                type="submit"
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
        </Modal>
      )}
      {deleteModal && (
        <Modal customStyle="h-52 w-72 rounded-lg p-4">
          <div className="text-center text-sky-600 font-Poppins font-bold py-2 text-xl border-b-2 border-b-sky-500">
            Delete Confirmation
          </div>
          <div className="text-white font-Poppins font-bold text-center mt-4">
            Are you sure want to delete this user ?
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
              onClick={handleDeleteUser}
            >
              Confirm
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Users;
