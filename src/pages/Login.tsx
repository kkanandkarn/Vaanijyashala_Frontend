import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import useApi from "../hooks/useApi";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { AuthData, login as loginAction } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { AxiosResponse } from "axios";

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
}

interface LoginResponseData {
  user: User;
  token: string;
}

interface ApiResponse {
  data: {
    data: LoginResponseData;
  };
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: login } = useApi("/auth/login", "POST");
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      handleOpen();
      const { email, password } = formData;

      login(
        { email, password },
        {
          onSuccess: (response: AxiosResponse) => {
            handleClose();
            toast.success("Login successful");

            const responseData = response.data as ApiResponse;

            if (responseData.data) {
              const userData: AuthData = {
                userId: response.data.data.user.userId,
                userName: response.data.data.user.userName,
                email: response.data.data.user.userEmail,
                role: response.data.data.user.role,
                token: response.data.data.token,
              };
              localStorage.setItem("token", response.data.data.token);

              dispatch(loginAction(userData));
              if (response.data.data.user.role === "Super Admin") {
                navigate("admin-dashboard");
              }
            }

            toast.error("Internal server error");
          },
          onError: (error: any) => {
            handleClose();

            toast.error(error.response.data.message);
            // Handle login error
          },
        }
      );
    }
  };

  const validateForm = () => {
    let valid = true;
    const { email, password } = formData;
    const errorsCopy = { ...errors };

    // Validate email
    if (!email) {
      errorsCopy.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorsCopy.email = "Email address is invalid";
      valid = false;
    }

    // Validate password
    if (!password) {
      errorsCopy.password = "Password is required";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", width: "100vw" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: 'url("/images/logo1.png")',
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
