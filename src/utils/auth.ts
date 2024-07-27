import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFromApi } from "../store/apiSlice";
import { login as loginAction } from "../store/authSlice";
import { GET_USER, GET_USER_METHOD } from "../ApiEndpoints";

interface Permission {
  id: string;
  permissionName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  permissions: Permission[];
}

interface ApiResponse {
  status: string;
  statusCode: number;
  data: {
    message: string;
    user: User;
    token: string;
  };
}

interface AuthData {
  userId: string;
  userName: string;
  email: string;
  role: string;
  token: string;
  permissions: Permission[];
}

const onReload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchData = async () => {
    const token = localStorage.getItem("vs-token");
    console.log("token", token);

    if (token) {
      try {
        const response = await fetchFromApi<ApiResponse>(
          GET_USER,
          GET_USER_METHOD,
         
        );

        if (response.status === "success") {
          const userData: AuthData = {
            userId: response.data.user.userId,
            userName: response.data.user.userName,
            email: response.data.user.userEmail,
            role: response.data.user.role,
            token: response.data.token,
            permissions: response.data.user.permissions,
          };
          dispatch(loginAction(userData));
        } else {
          console.log("Error restoring redux");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error: maybe redirect to login if the token is invalid
      }
    } else {
      // Redirect to login page
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData()
  }, []);
};

export default onReload;
