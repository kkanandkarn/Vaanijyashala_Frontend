import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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

const useReload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const onReload = async () => {
      const token = localStorage.getItem("vs-token");

      if (token) {
        try {
          const response = await fetchFromApi<ApiResponse>(
            GET_USER,
            GET_USER_METHOD
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
            setIsDataFetched(true);
          } else {
            console.log("Error restoring redux");
            setIsDataFetched(true);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setIsDataFetched(true);
        }
      } else {
        navigate("/");
      }
    };

    onReload();
  }, [dispatch, navigate, location.pathname]);
  return { isDataFetched };
};

export default useReload;
