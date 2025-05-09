import { useState, useEffect } from 'react';
import "./sidebar.css";
import logo from "/logo2.png";
import dashboard from "/dashboard.png";
import users from "/user.png";
import store from "/store.png";
import outgoing from "/outgoing.png";
import reports from "/reports.png";
import logout from "/logout.png";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../src/stores/useUserStore'

const Sidebar = () => {
  const { logout: logOut } = useUserStore();
  const navigate = useNavigate();

  // State for expanded parent and active item
  const [expandedMenu, setExpandedMenu] = useState(null); // Tracks expanded parent menu
  const [activeItem, setActiveItem] = useState(null);     // Tracks active item (parent or child)

  // Save expandedMenu and activeItem to localStorage
  useEffect(() => {
    localStorage.setItem("expandedMenu", expandedMenu);
    localStorage.setItem("activeItem", activeItem);
  }, [expandedMenu, activeItem]);

  // Load expandedMenu and activeItem from localStorage on mount
  useEffect(() => {
    setExpandedMenu(localStorage.getItem("expandedMenu") || null);
    setActiveItem(localStorage.getItem("activeItem") || null);
  }, []);

  // Handle parent item click
  const handleParentClick = (menu) => {
    if (expandedMenu === menu) {
      // Collapse the menu if it's already expanded
      setExpandedMenu(null);
      setActiveItem(null);
    } else {
      // Expand the clicked menu and reset active item
      setExpandedMenu(menu);
      setActiveItem(menu); // Highlight the parent item as active
    }
  };
  const handleLogout = () => {
    logOut();
    navigate('/')
  }
  // Handle child item click
  const handleChildClick = (child, route) => {
    setActiveItem(child); // Set the clicked child as active
    navigate(route);      // Navigate to the corresponding route
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Navigation Items */}
      <nav>
        <ul>
          {/* Dashboard */}
          <li
            onClick={() => {
              setExpandedMenu(null); // Collapse any open menus
              setActiveItem("Dashboard"); // Set Dashboard as active
              navigate("/admin");
            }}
            className={`sidebar-item ${activeItem === "Dashboard" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={dashboard}
                alt="Dashboard"
                className={`icon ${activeItem === "Dashboard" ? "active-icon" : ""}`}
              />
              <span>Dashboard</span>
            </div>
          </li>

          {/* Users */}
          <li
            onClick={() => handleParentClick("Users")}
            className={`sidebar-item ${activeItem === "Users" ? "active-component" : ""}`}
          >
            {/* Parent Menu Item */}
            <div className="menu-item-content">
              <img
                src={users}
                alt="Users"
                className={`icon ${activeItem === "Users" ? "active-icon" : ""}`}
              />
              <span>Users</span>
              <span className="arrow">{expandedMenu === "Users" ? "▲" : "▼"}</span>
            </div>
            {/* Sub-menu for Users */}
            {expandedMenu === "Users" && (
              <ul className="sub-menu">
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Requests", "/admin/requests");
                  }}
                  className={`sub-menu-item ${activeItem === "Requests" ? "active-submenu" : ""}`}
                >
                  Requests
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Partners", "/admin/partners");
                  }}
                  className={`sub-menu-item ${activeItem === "Partners" ? "active-submenu" : ""}`}
                >
                  Partners
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Employees", "/admin/employees");
                  }}
                  className={`sub-menu-item ${activeItem === "Employees" ? "active-submenu" : ""}`}
                >
                  Employees
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Customers", "/admin/customer");
                  }}
                  className={`sub-menu-item ${activeItem === "Customers" ? "active-submenu" : ""}`}
                >
                  Customers
                </li>
              </ul>
            )}
          </li>

          {/* Products */}
          <li
            onClick={() => {
              setExpandedMenu(null); // Collapse any open menus
              setActiveItem("Products"); // Set Products as active
              navigate("/admin/products");
            }}
            className={`sidebar-item ${activeItem === "Products" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 mr-3 ${activeItem === "Products" ? "active-icon" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Products</span>
            </div>
          </li>



          {/* Other Menu Items */}
          <li
            onClick={() => {
              setExpandedMenu(null); // Collapse any open menus
              setActiveItem("Store"); // Set Store as active
              navigate("/admin/store");
            }}
            className={`sidebar-item ${activeItem === "Store" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={store}
                alt="Store"
                className={`icon ${activeItem === "Store" ? "active-icon" : ""}`}
              />
              <span>Store</span>
            </div>
          </li>
          <li
            onClick={() => {
              setExpandedMenu(null); // Collapse any open menus
              setActiveItem("Outgoing Orders"); // Set Outgoing Orders as active
              navigate("/admin/outgoing-orders");
            }}
            className={`sidebar-item ${activeItem === "Outgoing Orders" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={outgoing}
                alt="Outgoing Orders"
                className={`icon ${activeItem === "Outgoing Orders" ? "active-icon" : ""}`}
              />
              <span>Outgoing Orders</span>
            </div>
          </li>
          <li
            onClick={() => {
              setExpandedMenu(null); // Collapse any open menus
              setActiveItem("Reports"); // Set Reports as active
              navigate("/reports");
            }}
            className={`sidebar-item ${activeItem === "Reports" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={reports}
                alt="Reports"
                className={`icon ${activeItem === "Reports" ? "active-icon" : ""}`}
              />
              <span>Reports</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="logout-section" onClick={handleLogout}>
        <img src={logout} alt="Logout" className="icon" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;