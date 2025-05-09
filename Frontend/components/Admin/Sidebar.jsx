import { useState, useEffect } from 'react';
import "./sidebar.css";
import logo from "/logo2.png";
import dashboard from "/dashboard.png";
import users from "/user.png";
import store from "/store.png";
import outgoing from "/outgoing.png";
import reports from "/reports.png";
import logout from "/logout.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../src/stores/useUserStore';

const Sidebar = () => {
  const { logout: logOut } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // State for expanded parent and active item
  const [expandedMenu, setExpandedMenu] = useState(null); // Tracks expanded parent menu
  const [activeItem, setActiveItem] = useState(null);     // Tracks active item (parent or child)

  // Highlight the active menu item based on the current route
  useEffect(() => {
    if (location.pathname === "/admin") {
      setActiveItem("Dashboard");
    } else if (location.pathname === "/admin/products") {
      setActiveItem("Products");
    } else if (location.pathname === "/admin/store") {
      setActiveItem("Store");
    } else if (location.pathname === "/admin/outgoing-orders") {
      setActiveItem("Outgoing Orders");
    } else if (location.pathname === "/reports") {
      setActiveItem("Reports");
    } else if (location.pathname === "/admin/requests") {
      setActiveItem("Requests");
      setExpandedMenu("Users");
    } else if (location.pathname === "/admin/partners") {
      setActiveItem("Partners");
      setExpandedMenu("Users");
    } else if (location.pathname === "/admin/employees") {
      setActiveItem("Employees");
      setExpandedMenu("Users");
    } else if (location.pathname === "/admin/customer") {
      setActiveItem("Customers");
      setExpandedMenu("Users");
    }
  }, [location.pathname]);

  const handleParentClick = (menu) => {
    if (expandedMenu === menu) {
      setExpandedMenu(null);
      setActiveItem(null);
    } else {
      setExpandedMenu(menu);
      setActiveItem(menu);
    }
  };

  const handleChildClick = (child, route) => {
    setActiveItem(child);
    navigate(route);
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
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
              setExpandedMenu(null);
              setActiveItem("Dashboard");
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
            className={`sidebar-item ${expandedMenu === "Users" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={users}
                alt="Users"
                className={`icon ${expandedMenu === "Users" ? "active-icon" : ""}`}
              />
              <span>Users</span>
              <span className="arrow">{expandedMenu === "Users" ? "▲" : "▼"}</span>
            </div>
            {expandedMenu === "Users" && (
              <ul className="sub-menu">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChildClick("Requests", "/admin/requests");
                  }}
                  className={`sub-menu-item ${activeItem === "Requests" ? "active-submenu" : ""}`}
                >
                  Requests
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChildClick("Partners", "/admin/partners");
                  }}
                  className={`sub-menu-item ${activeItem === "Partners" ? "active-submenu" : ""}`}
                >
                  Partners
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChildClick("Employees", "/admin/employees");
                  }}
                  className={`sub-menu-item ${activeItem === "Employees" ? "active-submenu" : ""}`}
                >
                  Employees
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
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
              setExpandedMenu(null);
              setActiveItem("Products");
              navigate("/admin/products");
            }}
            className={`sidebar-item ${activeItem === "Products" ? "active-component" : ""}`}
          >
            <div className="menu-item-content">
              <img
                src={store}
                alt="Products"
                className={`icon ${activeItem === "Products" ? "active-icon" : ""}`}
              />
              <span>Products</span>
            </div>
          </li>

          {/* Store */}
          <li
            onClick={() => {
              setExpandedMenu(null);
              setActiveItem("Store");
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

          {/* Outgoing Orders */}
          <li
            onClick={() => {
              setExpandedMenu(null);
              setActiveItem("Outgoing Orders");
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

          {/* Reports */}
          <li
            onClick={() => {
              setExpandedMenu(null);
              setActiveItem("Reports");
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