import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import { showLoader, hideLoader } from "../../components/Loader";
import { fetchFromApi } from "../../store/apiSlice";
import {
  CREATE_USER,
  CREATE_USER_METHOD,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
} from "../../ApiEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout";
import useReload from "../../hooks/useReload";

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

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const AddUser: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDataFetched } = useReload();

  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => state.auth);

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
    const requiredPermission = "ADD-USER";
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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetchFromApi<{
          status: string;
          message: string;
        }>(CREATE_USER, CREATE_USER_METHOD, values);
        if (response.status === "success") {
          toast.success("User added Successfully.");
          setLoading(false);
          fetchRoles();
          formik.resetForm();
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        setLoading(false);
      }
    },
  });

  return (
    <Layout title={"Add User - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"} Add User
        </h1>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-4 p-4 bg-slate-600 rounded-md mt-10"
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
    </Layout>
  );
};

export default AddUser;
