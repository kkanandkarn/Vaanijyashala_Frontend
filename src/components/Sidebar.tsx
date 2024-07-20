import React, { useState, useEffect } from "react";
import logo from "../../public/images/logo.png";
import { FaUsers, FaUserCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";

interface MenuItem {
  id: number;
  label: string;
  submenu?: MenuItem[];
  link?: string;
  icon?: any;
}

const menu: MenuItem[] = [
  {
    id: 0,
    label: "Dashboard",
    icon: <FaHome />,
    link: "/admin-dashboard",
  },
  {
    id: 1,
    label: "Users",
    icon: <FaUsers />,
    link: "/users",
  },
  {
    id: 2,
    label: "Roles",
    icon: <FaUserCog />,
    submenu: [
      {
        id: 4,
        label: "Add Role",
        link: "/add-role",
      },
      {
        id: 5,
        label: "View Roles",
        link: "/roles",
      },
    ],
  },
  {
    id: 3,
    label: "Permissions",
    icon: <FaClipboardUser />,
    link: "/permissions",
  },
];

interface SidebarMenuProps {
  items: MenuItem[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Open the parent menu if a submenu item is active
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

  return (
    <ul className="list-none p-0 mt-8">
      {items.map((item) => (
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

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen p-4 w-1/5 bg-slate-900 shadow-lg shadow-gray-500/50 fixed flex flex-col justify-between">
      <div>
        <div className="w-full h-32 flex flex-col justify-evenly items-center border-b-2 border-b-white pb-4">
          <img src={logo} className="h-16 w-16 mb-4" />
          <h1 className="text-white font-serif text-2xl font-bold">
            Super Admin
          </h1>
        </div>
        <SidebarMenu items={menu} />
      </div>
      <NavLink to="/" className="block mb-2 rounded-lg mt-4 p-2 text-white">
        <div className="font-bold cursor-pointer flex justify-start items-center h-8">
          <div className="text-xl py-2 px-2">
            <FaSignOutAlt />
          </div>
          <div className="text-base font-Poppins">Logout</div>
        </div>
      </NavLink>
    </div>
  );
};

export default Sidebar;
