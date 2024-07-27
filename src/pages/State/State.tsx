import React, { useState, useEffect } from "react";

import { fetchFromApi } from "../../store/apiSlice";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./styles.css";
import { hideLoader, showLoader } from "../../components/Loader";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import {
  GET_STATES,
  GET_STATES_METHOD,
  EDIT_STATE,
  EDIT_STATE_METHOD,
  DELETE_STATE,
  DELETE_STATE_METHOD,
  EDIT_DISTRICT,
  EDIT_DISTRICT_METHOD,
  DELETE_DISTRICT,
  DELETE_DISTRICT_METHOD,
} from "../../ApiEndpoints";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import Layout from "../../Layout";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

import Modal from "../../components/Modal";
import useReload from "../../hooks/useReload";

interface State {
  id: string;
  title: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  districts: District[];
}

interface District {
  id: string;
  name: string;
}

const State = () => {
  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => state.auth);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stateSearchTerm, setStateSearchTerm] = useState<string>("");
  const [activeStateId, setActiveStateId] = useState<string | null>(null);
  const [editStatePerm, setEditStatePerm] = useState<Boolean>(true);
  const [deleteStatePerm, setDeleteStatePerm] = useState<Boolean>(true);
  const [addDistPerm, setAddDistPerm] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<boolean>(false);
  const [modalErrorMsg, setModalErrorMsg] = useState<string>("");
  const [editStateId, setEditStateId] = useState<string>("");
  const [editStateName, setEditStateName] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteStateId, setDeleteStateId] = useState<string>("");
  const [editDistPerm, setEditDistPerm] = useState<boolean>(true);
  const [deleteDistPerm, setDeleteDistPerm] = useState<boolean>(true);
  const [editDistModal, setEditDistModal] = useState<boolean>(false);
  const [deleteDistModal, setDeleteDistModal] = useState<boolean>(false);
  const [editDistId, setEditDistId] = useState<string>("");
  const [editDistName, setEditDistName] = useState<string>("");
  const [deleteDistId, setDeleteDistId] = useState<string>("");
  const { isDataFetched } = useReload();

  const fetchStates = async () => {
    showLoader();
    try {
      const response = await fetchFromApi<{
        status: string;
        data: { states: State[] };
      }>(GET_STATES, GET_STATES_METHOD);
      if (response.status === "success") {
        setStates(response.data.states);
        hideLoader();

        // setIsLoading(false);
      } else {
        throw new Error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);

      // setIsLoading(false);
      hideLoader();
    }
  };

  useEffect(() => {
    if (!isDataFetched) {
      return;
    }
    const requiredPermission = "VIEW-STATE";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      hideLoader();
      return;
    } else {
      fetchStates();
      hideLoader();
    }
    const editStatePermName = "EDIT-STATE";
    const checkEditStatePerm = authData.permissions.some(
      (perm) => perm.permissionName === editStatePermName
    );
    if (!checkEditStatePerm) {
      setEditStatePerm(false);
    }
    const deleteStatePermName = "DELETE-STATE";
    const checkDeleteStatePerm = authData.permissions.some(
      (perm) => perm.permissionName === deleteStatePermName
    );
    if (!checkDeleteStatePerm) {
      setDeleteStatePerm(false);
    }
    const addDistPermName = "ADD-DISTRICT";
    const checkaddDistPermName = authData.permissions.some(
      (perm) => perm.permissionName === addDistPermName
    );
    if (!checkaddDistPermName) {
      setAddDistPerm(false);
    }
    const editDistPermName = "EDIT-DISTRICT";
    const checkEditDistPermName = authData.permissions.some(
      (perm) => perm.permissionName === editDistPermName
    );
    if (!checkEditDistPermName) {
      setEditDistPerm(false);
    }
    const deleteDistPermName = "DELETE-DISTRICT";
    const checkDeleteDistPermName = authData.permissions.some(
      (perm) => perm.permissionName === deleteDistPermName
    );
    if (!checkDeleteDistPermName) {
      setDeleteDistPerm(false);
    }
  }, [isDataFetched]);
  if (!isDataFetched) {
    showLoader();
  }

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredStates = states.filter((state) =>
    state.title.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleStateEdit = (e: any, stateId: string, stateName: string) => {
    e.stopPropagation();
    setEditStateId(stateId);
    setEditStateName(stateName);
    setModal(true);
  };
  const handleDistEdit = (districtId: string, districtname: string) => {
    setEditDistId(districtId);
    setEditDistName(districtname);
    setEditDistModal(true);
  };

  const handleStateDelete = (e: any, stateId: string) => {
    e.stopPropagation();
    setDeleteStateId(stateId);
    setDeleteModal(true);
  };
  const handleDistDelete = (districtId: string) => {
    setDeleteDistId(districtId);
    setDeleteDistModal(true);
  };
  const editState = async () => {
    if (editStateName.trim() == "") {
      setModalError(true);
      setModalErrorMsg("State name is required");
      setEditStateName("");
      return;
    }

    setModalError(false);
    showLoader();
    try {
      const data = {
        id: editStateId,
        stateName: editStateName,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        EDIT_STATE,
        EDIT_STATE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("State updated Successfully.");
        setModalError(false);
        fetchStates();
        setEditStateId("");
        setEditStateName("");
        hideLoader();
        setModal(false);
      } else {
        toast.error(response.message);
        // setModalError(false);
        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setModalError(false);
      hideLoader();
    }
  };
  const editDistrict = async () => {
    if (editDistName.trim() === "") {
      setModalError(true);
      setModalErrorMsg("District name is required");
      setEditDistName("");
      return;
    }

    setModalError(false);
    showLoader();
    try {
      const data = {
        stateId: activeStateId,
        districtId: editDistId,
        districtName: editDistName,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        EDIT_DISTRICT,
        EDIT_DISTRICT_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("District updated Successfully.");

        // Update the states directly
        setStates((prevStates) =>
          prevStates.map((state) =>
            state.id === activeStateId
              ? {
                  ...state,
                  districts: state.districts.map((district) =>
                    district.id === editDistId
                      ? { ...district, name: editDistName }
                      : district
                  ),
                }
              : state
          )
        );

        // Update the districts state directly
        setDistricts((prevDistricts) =>
          prevDistricts.map((district) =>
            district.id === editDistId
              ? { ...district, name: editDistName }
              : district
          )
        );

        setEditDistModal(false);
        setEditDistId("");
        setEditDistName("");
        hideLoader();
        setModal(false);
      } else {
        toast.error(response.message);
        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setModalError(false);
      hideLoader();
    }
  };

  const deleteState = async () => {
    setDeleteModal(false);
    showLoader();
    try {
      const data = {
        id: deleteStateId,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        DELETE_STATE,
        DELETE_STATE_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("State Deleted Successfully.");
        fetchStates();
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
  const deleteDistrict = async () => {
    showLoader();
    try {
      const data = {
        stateId: activeStateId,
        districtId: deleteDistId,
      };

      const response = await fetchFromApi<{ status: string; message: string }>(
        DELETE_DISTRICT,
        DELETE_DISTRICT_METHOD,
        data
      );

      if (response.status === "success") {
        toast.success("District deleted Successfully.");

        // Update the states directly
        setStates((prevStates) =>
          prevStates.map((state) =>
            state.id === activeStateId
              ? {
                  ...state,
                  districts: state.districts.filter(
                    (district) => district.id !== deleteDistId
                  ),
                }
              : state
          )
        );

        // Update the districts state directly
        setDistricts((prevDistricts) =>
          prevDistricts.filter((district) => district.id !== deleteDistId)
        );

        setDeleteDistModal(false);
        setDeleteDistId("");
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
    <Layout title={"States - VaanijyaShala"}>
      <div className="border-t-2 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold px-4">
          {authData.role} {">"} States
        </h1>
      </div>
      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <h1 className="text-center mt-4 text-white font-Poppins font-bold text-2xl">
          States
        </h1>
        <input
          type="text"
          placeholder="Search states..."
          value={stateSearchTerm}
          onChange={(e) => setStateSearchTerm(e.target.value)}
          className=" rounded-lg p-4 mb-4 w-full outline-none bg-slate-700  text-white"
        />
        {filteredStates.length ? (
          <div className="overflow-x-auto ">
            {filteredStates.map((state, index) => (
              <Accordion
                key={state.id}
                expanded={activeStateId === state.id}
                onChange={() => {
                  setDistricts(state.districts);
                  setActiveStateId(
                    activeStateId === state.id ? null : state.id
                  );
                }}
                classes={{ root: "accordion-root" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                  classes={{ root: "accordion-summary" }}
                >
                  <div className="flex justify-between items-center w-full">
                    <Typography
                      className={`cursor-pointer px-6 ${
                        activeStateId === state.id
                          ? "font-bold"
                          : "accordion-summary-text"
                      }`}
                    >
                      {index + 1}. {state.title}
                    </Typography>
                    <div className="flex items-center gap-2">
                      {editStatePerm && (
                        <button
                          className="text-sky-500 text-xl"
                          onClick={(e) =>
                            handleStateEdit(e, state.id, state.title)
                          }
                        >
                          <CiEdit color="skyblue" />
                        </button>
                      )}

                      {deleteStatePerm && (
                        <button
                          className="text-red-500 text-xl"
                          onClick={(e) => handleStateDelete(e, state.id)}
                        >
                          <MdDeleteOutline color="#ef4444" />
                        </button>
                      )}

                      {addDistPerm && (
                        <button
                          className="text-green-500 flex gap-1 items-center border-2 border-green-500 h-full rounded-lg py-1  px-2 text-sm mr-2"
                          onClick={() =>
                            navigate(`/states/add-district?state=${state.id}`)
                          }
                        >
                          + District
                        </button>
                      )}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails classes={{ root: "accordion-details" }}>
                  {activeStateId === state.id && (
                    <div className="custom-scrollbar mx-h-[450px] px-6">
                      <input
                        type="text"
                        placeholder="Search districts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-lg p-2 mb-4 w-full outline-none bg-slate-600 text-white"
                      />
                      {filteredDistricts.length ? (
                        <div>
                          {filteredDistricts.map((district, index) => (
                            <div
                              key={district.id}
                              className="flex justify-between items-center border-b-2 border-gray-300 py-4"
                            >
                              <span className="accordion-details-text">
                                {index + 1}. {district.name}
                              </span>
                              <div className="flex items-center gap-2 text-xl justify-center">
                                {editDistPerm && (
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDistEdit(district.id, district.name)
                                    }
                                  >
                                    <CiEdit color="skyblue" />
                                  </div>
                                )}
                                {deleteDistPerm && (
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDistDelete(district.id)
                                    }
                                  >
                                    <MdDeleteOutline color="#ef4444" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white text-center text-base font-bold">
                          No districts found
                        </div>
                      )}
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        ) : (
          <div className="text-white text-center text-2xl font-bold">
            No states found
          </div>
        )}
      </div>
      {modal && (
        <Modal customStyle="h-30 w-96 rounded-lg p-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex-1 text-center text-xl font-Poppins text-white">
              Edit State
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
              placeholder="Edit State"
              value={editStateName}
              onChange={(e) => setEditStateName(e.target.value)}
              className="rounded-lg p-2 w-full outline-none  bg-slate-800 text-white"
            />
            <div
              className="font-Poppins text-3xl rounded-full cursor-pointer flex items-center justify-center "
              onClick={editState}
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

      {editDistModal && (
        <Modal customStyle="h-30 w-96 rounded-lg p-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex-1 text-center text-xl font-Poppins text-white">
              Edit District
            </div>
            <div className="w-6 h-6 flex justify-center items-center">
              <div
                className="border-2 border-red-400 rounded-full w-6 h-6 flex justify-center items-center font-bold text-red-400 cursor-pointer"
                onClick={() => {
                  setEditDistModal(false);
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
              placeholder="Edit District"
              value={editDistName}
              onChange={(e) => setEditDistName(e.target.value)}
              className="rounded-lg p-2 w-full outline-none  bg-slate-800 text-white"
            />
            <div
              className="font-Poppins text-3xl rounded-full cursor-pointer flex items-center justify-center "
              onClick={editDistrict}
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
            Are you sure want to delete this state ?
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
              onClick={deleteState}
            >
              Confirm
            </div>
          </div>
        </Modal>
      )}
      {deleteDistModal && (
        <Modal customStyle="h-52 w-72 rounded-lg p-4">
          <div className="text-center text-sky-600 font-Poppins font-bold py-2 text-xl border-b-2 border-b-sky-500">
            Delete Confirmation
          </div>
          <div className="text-white font-Poppins font-bold text-center mt-4">
            Are you sure want to delete this District ?
          </div>
          <div className="flex justify-between p-4 mt-2">
            <div
              className="text-red-500 border-red-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={() => setDeleteDistModal(false)}
            >
              Cancel
            </div>
            <div
              className="text-green-500 border-green-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={deleteDistrict}
            >
              Confirm
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default State;
