import React, { useState, useEffect } from "react";
import logo from "../../public/images/logo.png";
import { FaUsers, FaUserCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    submenu: [
      {
        id: 4,
        label: "Add User",
        link: "/add-user",
        icon: <IoIosAddCircleOutline />,
        permission: "ADD-USER",
      },
      {
        id: 5,
        label: "View Users",
        link: "/users",
        icon: <IoEyeOutline />,
        permission: "VIEW-USER",
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
        icon: <IoIosAddCircleOutline />,
        permission: "ADD-ROLE",
      },
      {
        id: 7,
        label: "View Roles",
        link: "/roles",
        icon: <IoEyeOutline />,
        permission: "VIEW-ROLE",
      },
    ],
  },
  {
    id: 3,
    label: "Permissions",
    icon: <FaClipboardUser />,
    link: "/permissions",
    permission: "VIEW-PERMISSIONS",
  },
];

interface SidebarMenuProps {
  items: MenuItem[];
  permissions: string[];
  loading: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  permissions,
  loading,
}) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    items.forEach((item) => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(
          (subitem) => location.pathname === subitem.link
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
    if (link && location.pathname === link) {
      return true;
    }
    if (submenu) {
      return submenu.some((subitem) => location.pathname === subitem.link);
    }
    return false;
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

  if (loading) {
    return (
      <ul className="list-none p-0 mt-8">
        {[1, 2, 3, 4].map((_, index) => (
          <li key={index}>
            <div className="block mb-2 rounded-lg mt-4 p-2">
              <Skeleton height={32} />
            </div>
            <ul className="ml-6 list-none">
              {[1, 2].map((_, subIndex) => (
                <div key={subIndex} className="block mb-2 rounded-lg mt-1 p-2">
                  <Skeleton height={32} />
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="list-none p-0 mt-8">
      {filterMenu(items).map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.link || "#"}
            className={() =>
              `block mb-2 rounded-lg mt-4 p-2 ${
                isMenuItemActive(item.link, item.submenu)
                  ? "border-l-8 border-l-blue-400"
                  : ""
              }`
            }
            end
          >
            <div
              className="font-bold cursor-pointer flex justify-start items-center h-8"
              onClick={() => item.submenu && toggleMenu(item.id)}
            >
              <div className={`text-xl py-2 px-2 text-white`}>{item.icon}</div>
              <div className={`text-base font-Poppins text-white`}>
                {item.label}
              </div>
            </div>
          </NavLink>
          {item.submenu && openMenu === item.id && (
            <ul className="ml-6 list-none">
              {item.submenu.map((subitem) => (
                <NavLink
                  key={subitem.id}
                  to={subitem.link || "#"}
                  className={({ isActive }) =>
                    `block mb-2 rounded-lg mt-1 p-2 ${
                      isActive ? "border-l-8 border-l-blue-400" : ""
                    }`
                  }
                  end
                >
                  <div
                    className={`font-semibold cursor-pointer flex justify-start items-center h-8 text-white`}
                  >
                    <div className={`text-xl py-2 px-2 text-white`}>
                      {subitem.icon}
                    </div>
                    <div className={`text-base font-Poppins text-white`}>
                      {subitem.label}
                    </div>
                  </div>
                </NavLink>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

const SidebarLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const authData = useSelector((state: RootState) => state.auth);
  const permissions = authData.permissions.map((p) => p.permissionName);

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setLoading(false);
    // }, 2000); // simulate loading delay
    // return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen p-4 w-1/5 bg-slate-900 shadow-lg shadow-gray-500/50 fixed flex flex-col justify-between">
      <div>
        <div className="w-full h-32 flex flex-col justify-evenly items-center border-b-2 border-b-white pb-4">
          {loading ? (
            <Skeleton circle height={64} width={64} />
          ) : (
            <img src={logo} className="h-16 w-16 mb-4" />
          )}
          <h1 className="text-white font-serif text-2xl font-bold w-40 h-4 bg-white"></h1>
        </div>
        <SidebarMenu items={menu} permissions={permissions} loading={loading} />
      </div>
      <NavLink to="/" className="block mb-2 rounded-lg mt-4 p-2 text-white">
        <div
          className="font-bold cursor-pointer flex justify-start items-center h-8"
          onClick={() => localStorage.removeItem("token")}
        >
          <div className="text-xl py-2 px-2">
            <FaSignOutAlt />
          </div>
          <div className="text-base font-Poppins">Logout</div>
        </div>
      </NavLink>
    </div>
  );
};

export default SidebarLoader;
