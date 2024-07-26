import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchFromApi } from "../../store/apiSlice";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConfirmationModal from "../../components/ConfirmationModal";
import "./styles.css";
import { hideLoader, showLoader } from "../../components/Loader";
import { updatePermissions } from "../../store/authSlice";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import {
  VIEW_PERMISSIONS_METHOD,
  VIEW_PERMISSIONS,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
} from "../../ApiEndpoints";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout";

interface Role {
  id: string;
  title: string;
  status: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  permissionName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const Roles: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionId, setPermissionId] = useState<string | null>(null);
  const [permissionName, setPermissionName] = useState<string | null>(null);
  const [globalPermissions, setGlobalPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");
  const [modal, setModal] = useState<Boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const requiredPermission = "VIEW-ROLE";
    const hasPermission = authData.permissions.some(
      (perm) => perm.permissionName === requiredPermission
    );

    if (!hasPermission) {
      navigate("/dashboard");
      return;
    }
  }, []);

  const filteredPermissions = globalPermissions.filter((permission) =>
    permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRoles = roles.filter((role) =>
    role.title.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  useEffect(() => {
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
          // setIsLoading(false);
        } else {
          throw new Error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Error fetching roles.");
        // setIsLoading(false);
        hideLoader();
      }
    };

    const fetchPermissions = async () => {
      showLoader();
      try {
        const response = await fetchFromApi<{
          status: string;
          data: { permissions: Permission[] };
        }>(VIEW_PERMISSIONS, VIEW_PERMISSIONS_METHOD);
        if (response.status === "success") {
          setGlobalPermissions(response.data.permissions);
          // setIsLoading(false);
          hideLoader();
        } else {
          throw new Error("Failed to fetch permissions");
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Error fetching permissions.");
        // setIsLoading(false);
        hideLoader();
      }
    };

    fetchRoles();
    fetchPermissions();
  }, []);

  const handleDeleteIconClick = (permissionId: string) => {
    setMethod("remove");
    setPermissionId(permissionId);
    // setIsModalOpen(true);
    setModal(true);
  };

  const handleAddClick = (permissionId: string, permissionName: string) => {
    setMethod("add");
    setPermissionId(permissionId);
    setPermissionName(permissionName);
    // setIsModalOpen(true);
    setModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmation = async () => {
    showLoader();
    setModal(false);

    try {
      const endpoint =
        method === "add" ? "/role/add-perm" : "/role/remove-perm";
      const data = {
        roleId: activeRoleId,
        permissionsArray: [permissionId],
      };

      const response = await fetchFromApi<{ status: string }>(
        endpoint,
        "POST",
        data
      );

      if (response.status === "success") {
        let updatedPermissions;
        if (method === "add") {
          updatedPermissions = [
            ...permissions,
            {
              id: permissionId,
              permissionName: permissionName,
            } as Permission,
          ];
          setPermissions(updatedPermissions);
        } else {
          updatedPermissions = permissions.filter(
            (perm) => perm.id !== permissionId
          );
          setPermissions(updatedPermissions);
        }

        dispatch(updatePermissions(updatedPermissions));
        hideLoader();
        toast.success("Permission updated successfully.");
        setModal(false);
      } else {
        toast.error(
          `Failed to ${method === "add" ? "add" : "remove"} permission`
        );

        hideLoader();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      hideLoader();
    }

    setModal(false);
  };

  const isPermissionMatched = (permissionId: string) => {
    return permissions.some((perm) => perm.id === permissionId);
  };

  return (
    <Layout title={"Roles - VaanijyaShala"}>
      <div className="border-t-2 px-4 border-b-2 h-12 flex items-center justify-start mt-5">
        <h1 className="font-Poppins text-xl text-white font-bold">
          {authData.role} {">"} Roles
        </h1>
      </div>

      <div className="flex-1 px-12 overflow-y-auto custom-scrollbar">
        <div className="w-full">
          <h1 className="font-Poppins font-bold mt-4 text-2xl text-center mb-4 text-white">
            Roles
          </h1>
          <input
            type="text"
            placeholder="Search roles..."
            value={roleSearchTerm}
            onChange={(e) => setRoleSearchTerm(e.target.value)}
            className=" rounded-lg p-4 mb-4 w-full outline-none bg-slate-700  text-white"
          />
          {filteredRoles.length ? (
            <div className="overflow-x-auto ">
              {filteredRoles.map((role, index) => (
                <Accordion
                  key={role.id}
                  expanded={activeRoleId === role.id}
                  onChange={() => {
                    setPermissions(role.permissions);
                    setActiveRoleId(activeRoleId === role.id ? null : role.id);
                  }}
                  classes={{ root: "accordion-root" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                    classes={{ root: "accordion-summary" }}
                  >
                    <Typography
                      className={`cursor-pointer px-6 ${
                        activeRoleId === role.id
                          ? "font-bold"
                          : "accordion-summary-text"
                      }`}
                    >
                      {index + 1}. {role.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails classes={{ root: "accordion-details" }}>
                    {activeRoleId === role.id && (
                      <div className="custom-scrollbar mx-h-[450px] px-6">
                        <input
                          type="text"
                          placeholder="Search permissions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="rounded-lg p-2 mb-4 w-full outline-none bg-slate-600 text-white"
                        />
                        {filteredPermissions.length ? (
                          <div>
                            {filteredPermissions.map((permission, index) => (
                              <div
                                key={permission.id}
                                className="flex justify-between items-center border-b border-gray-300 py-2 "
                              >
                                <span className="accordion-details-text">
                                  {index + 1}. {permission.permissionName}
                                </span>

                                {isPermissionMatched(permission.id) ? (
                                  <div
                                    className="text-base text-red-600 cursor-pointer border-red-600 border-2 w-20 h-10 rounded-lg flex items-center justify-center"
                                    onClick={() =>
                                      handleDeleteIconClick(permission.id)
                                    }
                                  >
                                    Inactive
                                  </div>
                                ) : (
                                  <div
                                    className="text-base text-green-600 cursor-pointer border-green-600 border-2 w-20 h-10 rounded-lg flex items-center justify-center"
                                    onClick={() =>
                                      handleAddClick(
                                        permission.id,
                                        permission.permissionName
                                      )
                                    }
                                  >
                                    Active
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-white text-center text-base font-bold">
                            No permissions found
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
              No roles found
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal customStyle="h-52 w-72 rounded-lg p-4">
          <div className="text-center text-sky-600 font-Poppins font-bold py-2 text-xl border-b-2 border-b-sky-500">
            Permission Confirmation
          </div>
          <div className="text-white font-Poppins font-bold text-center mt-4">
            Are you sure want to {method} this permission ?
          </div>
          <div className="flex justify-between p-4 mt-2">
            <div
              className="text-red-500 border-red-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={() => setModal(false)}
            >
              Cancel
            </div>
            <div
              className="text-green-500 border-green-500 border-2 py-1 px-2 rounded-full cursor-pointer"
              onClick={() => handleConfirmation()}
            >
              Confirm
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Roles;
