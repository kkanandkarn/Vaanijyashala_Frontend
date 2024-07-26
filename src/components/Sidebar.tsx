import React, { useState, useEffect } from "react";
import logo from "../../public/images/logo.png";
import { FaUsers, FaUserCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { RiGovernmentLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/authSlice";
import { IoMdArrowDropright } from "react-icons/io";

interface MenuItem {
  id: number;
  label: string;
  submenu?: MenuItem[];
  link?: string;
  icon?: any;
  permission?: string;
}

const menu: MenuItem[] = [
  {
    id: 0,
    label: "Dashboard",
    icon: <FaHome />,
    link: "/dashboard",
  },
  {
    id: 1,
    label: "Users",
    icon: <FaUsers />,
    permission: "VIEW-USER",
    submenu: [
      {
        id: 4,
        label: "Add User",
        link: "/add-user",
        icon: <IoMdArrowDropright />,
        permission: "ADD-USER", // Add permissions
      },
      {
        id: 5,
        label: "View Users",
        link: "/users",
        icon: <IoMdArrowDropright />,
        permission: "VIEW-USER", // Add permissions
      },
    ],
  },
  {
    id: 2,
    label: "Roles",
    icon: <FaUserCog />,
    submenu: [
      {
        id: 6,
        label: "Add Role",
        link: "/add-role",
        icon: <IoMdArrowDropright />,
        permission: "ADD-ROLE", // Add permissions
      },
      {
        id: 7,
        label: "View Roles",
        link: "/roles",
        icon: <IoMdArrowDropright />,
        permission: "VIEW-ROLE", // Add permissions
      },
    ],
  },
  {
    id: 3,
    label: "Permissions",
    icon: <FaClipboardUser />,
    link: "/permissions",
    permission: "VIEW-PERMISSIONS", // Add permissions
  },
  {
    id: 4,
    label: "State",
    icon: <RiGovernmentLine />,
    submenu: [
      {
        id: 6,
        label: "Add State",
        link: "/add-state",
        icon: <IoMdArrowDropright />,
        permission: "ADD-STATE", // Add permissions
      },
      {
        id: 7,
        label: "View States",
        link: "/states",
        icon: <IoMdArrowDropright />,
        permission: "VIEW-STATE",
      },
    ],
  },
];

interface SidebarMenuProps {
  items: MenuItem[];
  permissions: string[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, permissions }) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    items.forEach((item) => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some((subitem) =>
          location.pathname.startsWith(subitem.link || "")
        );

        if (isSubmenuActive) {
          setOpenMenu(item.id);
        }
      }
    });
  }, [location.pathname, items]);

  const toggleMenu = (id: number) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const isMenuItemActive = (link?: string, submenu?: MenuItem[]) => {
    if (link && location.pathname.startsWith(link)) {
      return true;
    }

    if (submenu) {
      return submenu.some((subitem) =>
        location.pathname.startsWith(subitem.link || "")
      );
    }
    return false;
  };

  const isSubmenuActive = (subitem: MenuItem) => {
    return location.pathname.startsWith(subitem.link || "");
  };

  const hasPermission = (permission?: string) => {
    return permission ? permissions.includes(permission) : true;
  };

  const filterMenu = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => hasPermission(item.permission))
      .map((item) => ({
        ...item,
        submenu: item.submenu ? filterMenu(item.submenu) : undefined,
      }));
  };

  return (
    <ul className="list-none p-0 mt-8">
      {filterMenu(items).map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.link || "#"}
            className={() =>
              `block mb-2 rounded-lg mt-4 p-2 hover:bg-white hover:opacity-100 hover:text-slate-900 ${
                isMenuItemActive(item.link, item.submenu)
                  ? "bg-white opacity-100 text-slate-900"
                  : " text-white"
              }`
            }
            end
          >
            <div
              className="font-bold cursor-pointer flex justify-start items-center h-8 "
              onClick={() => item.submenu && toggleMenu(item.id)}
            >
              <div className={`text-xl py-2 px-2`}>{item.icon}</div>
              <div className={`text-base font-Poppins `}>{item.label}</div>
            </div>
          </NavLink>
          <div
            className={`transition-all duration-3000 overflow-hidden ${
              openMenu === item.id ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            {item.submenu && openMenu === item.id && (
              <ul className="ml-6 list-none border-l-2 duration-3000 transition">
                {item.submenu.map((subitem) => (
                  <NavLink
                    key={subitem.id}
                    to={subitem.link || "#"}
                    className={() =>
                      `block mb-2 mt-1 p-2 ${
                        isSubmenuActive(subitem)
                          ? "text-white opacity-100"
                          : "opacity-50"
                      }`
                    }
                    end
                  >
                    <div
                      className={` cursor-pointer flex justify-start items-center h-8 text-white`}
                    >
                      <div className={`text-xl py-2 px-2 text-white`}>
                        {subitem.icon}
                      </div>
                      <div className={`text-sm font-Poppins text-white `}>
                        {subitem.label}
                      </div>
                    </div>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => state.auth);
  const permissions = authData.permissions.map((p) => p.permissionName);
  const handleLogout = () => {
    localStorage.removeItem("vs-token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="h-screen p-4 w-1/5 bg-slate-900 shadow-lg shadow-gray-500/50 fixed flex flex-col justify-between">
      <div>
        <div className="w-full min-h-10 flex justify-start gap-5 items-center">
          <img src={logo} className="h-14 w-14" />
          <h1 className="text-white font-Poppins text-base font-bold">
            {authData.userName}
          </h1>
        </div>
        <SidebarMenu items={menu} permissions={permissions} />
      </div>
      <div className="block mb-2 rounded-lg mt-4 p-2 text-white">
        <div
          className="font-bold cursor-pointer flex justify-start items-center h-8"
          onClick={handleLogout}
        >
          <div className="text-xl py-2 px-2">
            <FaSignOutAlt />
          </div>
          <div className="text-base font-Poppins">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
