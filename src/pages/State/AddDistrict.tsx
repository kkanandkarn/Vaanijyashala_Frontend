import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { hideLoader, showLoader } from "../../components/Loader";
import { fetchFromApi } from "../../store/apiSlice";
import {
  ADD_DISTRICT,
  ADD_DISTRICT_METHOD,
  VIEW_DISTRICTS,
  VIEW_DISTRICTS_METHOD,
} from "../../ApiEndpoints";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { Button, CircularProgress } from "@mui/material";
import { FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import useReload from "../../hooks/useReload";
interface State {
  id: string;
  title: string;
  districts: District[];
}

interface District {
  id: string;
  name: string;
}

const AddDistrict = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stateId = queryParams.get("state");

  const [loading, setLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<string[]>([""]);
  const authData = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [state, setState] = useState<State | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sendStateId, setSendStateId] = useState<string>("");
  const { isDataFetched } = useReload();

  const fetchDistricts = async () => {
    showLoader();
    try {
      const data = {
        stateId: stateId,
      };
      const response = await fetchFromApi<{
        status: string;
        data: { districts: State };
      }>(VIEW_DISTRICTS, VIEW_DISTRICTS_METHOD, data);
      if (response.status === "success") {
        if (response.data.districts) {
          setState(response.data.districts);
        }

        hideLoader();
      } else {
        throw new Error("Failed to fetch districts");
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
    const requiredPermission = "ADD-DISTRICT";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      hideLoader();
      return;
    } else {
      fetchDistricts();
      hideLoader();
    }
    if (stateId) {
      setSendStateId(stateId);
    }
  }, [isDataFetched]);
  if (!isDataFetched) {
    showLoader();
  }

  const filteredDistricts = state?.districts.filter((district) =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const addDistrict = async () => {
    try {
      setLoading(true);
      const data: { stateId: string; districts?: string[] } = {
        stateId: sendStateId,
      };

      const filteredDistricts = districts.filter(
        (district) => district.trim() !== ""
      );
      if (filteredDistricts.length > 0) {
        data.districts = filteredDistricts;
      }
      const response = await fetchFromApi<{ status: string; message: string }>(
        ADD_DISTRICT,
        ADD_DISTRICT_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("Districts added Successfully.");
        setLoading(false);
        setDistricts([""]);
        fetchDistricts();
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
    <Layout title={"Add District - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"}
          <Link to="/states" className="underline mx-2">
            States
          </Link>
          {">"} <span className="text-custom-orange">Add District</span>
        </h1>
      </div>
      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between mt-10">
          <div className="w-1/3">
            <div className="text-white font-Poppins text-2xl my-4 ">
              State: {state?.title}
            </div>

            <input
              type="text"
              placeholder="Search districts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-slate-700 h-14 w-full p-4 rounded-lg text-white outline-none"
            />
            <ul className="mt-5 w-full">
              {filteredDistricts?.map((district) => (
                <li
                  key={district.id}
                  className="flex border-2 px-4 mt-4 rounded-lg py-4"
                >
                  <p className="text-xl text-white font-Poppins max-w-full cursor-default">
                    {district.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/4">
            <h1 className="text-center mt-4 text-white font-Poppins font-bold text-2xl mb-4">
              Add District
            </h1>
            {districts.map((district, index) => (
              <div key={index} className="w-full px-2 flex items-center mb-4">
                <div className="text-white mr-2">
                  <IoMdArrowDropright />
                </div>
                <input
                  type="text"
                  placeholder={`Enter district ${index + 1} name...`}
                  value={district}
                  onChange={(e) => handleDistrictChange(index, e.target.value)}
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
            <div className="flex justify-center mt-5">
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
                onClick={addDistrict}
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

export default AddDistrict;
