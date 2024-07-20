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
import {
  VIEW_PERMISSIONS_METHOD,
  VIEW_PERMISSIONS,
  VIEW_ROLE,
  VIEW_ROLE_METHOD,
} from "../../ApiEndpoints";
import toast, { Toaster } from "react-hot-toast";

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

const Roles: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionId, setPermissionId] = useState<string | null>(null);
  const [globalPermissions, setGlobalPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");

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
    setIsModalOpen(true);
  };

  const handleAddClick = (permissionId: string) => {
    setMethod("add");
    setPermissionId(permissionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
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
          if (method === "add") {
            setPermissions((prevPermissions) => [
              ...prevPermissions,
              { id: permissionId } as Permission,
            ]);
          } else {
            setPermissions((prevPermissions) =>
              prevPermissions.filter((perm) => perm.id !== permissionId)
            );
          }
        } else {
          toast.error(
            `Failed to ${method === "add" ? "add" : "remove"} permission`
          );
        }
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    } else {
      console.log("Action canceled.");
    }
    setIsModalOpen(false);
  };

  const isPermissionMatched = (permissionId: string) => {
    return permissions.some((perm) => perm.id === permissionId);
  };

  return (
    <div className="h-screen flex bg-slate-600">
      <Toaster position="top-center" reverseOrder={false} />
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="border-t-2 px-4 border-b-2 h-10 flex items-center justify-start mt-2">
          <h1 className="font-Poppins text-xl text-white font-bold">
            Super Admin {">"} Roles
          </h1>
        </div>

        <div className="flex-1 mt-4 px-12 overflow-y-auto custom-scrollbar">
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
                      setActiveRoleId(
                        activeRoleId === role.id ? null : role.id
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
                                        handleAddClick(permission.id)
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
      </div>
      <ConfirmationModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        method={method}
        handleConfirmation={handleConfirmation}
      />
    </div>
  );
};

export default Roles;
