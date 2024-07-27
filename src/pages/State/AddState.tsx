import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import Layout from "../../Layout";
import { Button, CircularProgress } from "@mui/material";
import { FaSave } from "react-icons/fa";
import { showLoader, hideLoader } from "../../components/Loader";
import toast from "react-hot-toast";
import { ADD_STATE, ADD_STATE_METHOD } from "../../ApiEndpoints";
import { fetchFromApi } from "../../store/apiSlice";
import "./styles.css";
import useReload from "../../hooks/useReload";

const AddState = () => {
  const navigate = useNavigate();
  const [stateName, setStateName] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stateError, setStateError] = useState<boolean>(false);
  const [addDistPerm, setAddDistPerm] = useState<boolean>(true);
  const authData = useSelector((state: RootState) => state.auth);
  const { isDataFetched } = useReload();

  useEffect(() => {
    if (!isDataFetched) {
      return;
    }
    const requiredPermission = "ADD-STATE";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      hideLoader();
      return;
    } else {
      hideLoader();
    }

    const addDistPermName = "ADD-DISTRICT";
    const checkaddDistPermName = authData.permissions.some(
      (perm) => perm.permissionName === addDistPermName
    );
    if (!checkaddDistPermName) {
      setAddDistPerm(false);
    }
  }, [isDataFetched]);

  if (!isDataFetched) {
    showLoader();
  }

  const handleAddDistrict = () => {
    setDistricts([...districts, ""]);
  };

  const handleRemoveDistrict = (index: number) => {
    const newDistricts = districts.filter((_, i) => i !== index);
    setDistricts(newDistricts);
  };

  const handleDistrictChange = (index: number, value: string) => {
    const newDistricts = districts.map((district, i) =>
      i === index ? value : district
    );
    setDistricts(newDistricts);
  };

  const handleAddState = async () => {
    if (stateName.trim() === "") {
      setStateError(true);
      return;
    }

    // showLoader();
    try {
      setStateError(false);
      setLoading(true);
      const data: { stateName: string; districts?: string[] } = {
        stateName: stateName,
      };

      const filteredDistricts = districts.filter(
        (district) => district.trim() !== ""
      );
      if (filteredDistricts.length > 0) {
        data.districts = filteredDistricts;
      }
      const response = await fetchFromApi<{ status: string; message: string }>(
        ADD_STATE,
        ADD_STATE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("State added Successfully.");
        setLoading(false);
        setStateName("");
        setDistricts([""]);
        // hideLoader();
      } else {
        toast.error(response.message);
        setLoading(false);

        // hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Layout title={"Add State - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"} Add State
        </h1>
      </div>
      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <div className="w-full">
          <h1 className="font-Poppins font-bold mt-4 text-2xl text-center mb-4 text-white">
            State
          </h1>
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-1/2 flex flex-col items-center h-full">
              <input
                type="text"
                placeholder="Enter state name..."
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="rounded-lg p-4 mb-4 w-full outline-none bg-slate-700 text-white"
              />
              {stateError && (
                <p className="text-base font-Poppins text-red-500 mb-2">
                  State name is required
                </p>
              )}
            </div>
            {addDistPerm && (
              <div className="w-full flex flex-col items-center">
                <div className="w-1/2">
                  {districts.map((district, index) => (
                    <div
                      key={index}
                      className="w-full px-2 flex items-center mb-2"
                    >
                      <div className="text-white mr-2">
                        <IoMdArrowDropright />
                      </div>
                      <input
                        type="text"
                        placeholder={`Enter district ${index + 1} name...`}
                        value={district}
                        onChange={(e) =>
                          handleDistrictChange(index, e.target.value)
                        }
                        className="rounded-lg p-4 w-full outline-none bg-slate-700 text-white mr-2"
                      />
                      <div className="flex gap-2">
                        {districts.length > 1 && (
                          <button
                            onClick={() => handleRemoveDistrict(index)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-base cursor-pointer border flex justify-center items-center"
                          >
                            <IoIosRemoveCircle />
                          </button>
                        )}
                        {index === districts.length - 1 && (
                          <button
                            onClick={handleAddDistrict}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 text-xl flex justify-center items-center cursor-pointer border"
                          >
                            <IoIosAddCircle />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                onClick={handleAddState}
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddState;
