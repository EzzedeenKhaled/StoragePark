import { useState, useEffect } from 'react';
import "./sidebar.css";
import logo from "/logo2.png";
import dashboard from "/dashboard.png";
import users from "/user.png";
import Payments from "/payments.png";
import store from "/store.png";
import incoming from "/incoming.png";
import outgoing from "/outgoing.png";
import reports from "/reports.png";
import logout from "/logout.png";
import { useNavigate } from 'react-router-dom';
import {useUserStore} from '../../src/stores/useUserStore'

const Sidebar = () => {
  const {logout: logOut} = useUserStore();
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

          {/* Payments */}
          <li
            onClick={() => handleParentClick("Payments")}
            className={`sidebar-item ${activeItem === "Payments" ? "active-component" : ""}`}
          >
            {/* Parent Menu Item */}
            <div className="menu-item-content">
              <img
                src={Payments}
                alt="Payments"
                className={`icon ${activeItem === "Payments" ? "active-icon" : ""}`}
              />
              <span>Payments</span>
              <span className="arrow">{expandedMenu === "Payments" ? "▲" : "▼"}</span>
            </div>
            {/* Sub-menu for Payments */}
            {expandedMenu === "Payments" && (
              <ul className="sub-menu">
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Wallets", "/wallets");
                  }}
                  className={`sub-menu-item ${activeItem === "Wallets" ? "active-submenu" : ""}`}
                >
                  Wallets
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the menu
                    handleChildClick("Transactions", "/transactions");
                  }}
                  className={`sub-menu-item ${activeItem === "Transactions" ? "active-submenu" : ""}`}
                >
                  Transactions
                </li>
              </ul>
            )}
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
              setActiveItem("Incoming Orders"); // Set Incoming Orders as active
              navigate("/admin/incoming-orders");
            }}
            className={`sidebar-item ${activeItem === "Incoming Orders" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={incoming}
                alt="Incoming Orders"
                className={`icon ${activeItem === "Incoming Orders" ? "active-icon" : ""}`}
              />
              <span>Incoming Orders</span>
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