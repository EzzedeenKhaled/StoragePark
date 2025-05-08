import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IncomingOrders.css";

const mockOrders = [
  {
    id: 1,
    company: "Tech Solutions Inc.",
    phone: "01123123",
    price: 70,
    status: "Pending",
    date: "2024-03-15",
  },
  {
    id: 3,
    company: "Gaming Gear Pro",
    phone: "01123123",
    price: 700,
    status: "Pending",
    date: "2024-03-13",
  },
  {
    id: 5,
    company: "Sports Equipment Co.",
    phone: "01123123",
    price: 320,
    status: "Delivered",
    date: "2024-03-11",
  },
];

const IncomingOrders = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredOrders = mockOrders.filter((order) =>
    order.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = mockOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="incoming-orders-content">
      {/* Header Section */}
      <div className="incoming-orders-header">
        <div>
          <h2>Incoming Orders</h2>
          <p>Manage and track your incoming orders</p>
        </div>
        <div className="relative">
          <input
            type="text"
            className="incoming-orders-search"
            placeholder="Search by company name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="incoming-orders-stats">
        <div className="stat-card box">
          <div className="stat-icon">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{mockOrders.length}</div>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <div className="stat-label">Delivered</div>
            <div className="stat-value">
              {mockOrders.filter((order) => order.status === "Delivered").length}
            </div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">
              {mockOrders.filter((order) => order.status === "Pending").length}
            </div>
          </div>
        </div>

        <div className="stat-card amount">
          <div className="stat-icon">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${totalAmount}</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="incoming-orders-table-wrapper">
        <table className="incoming-orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>COMPANY NAME</th>
              <th>PARTNER PHONE</th>
              <th>TOTAL PRICE</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">
                  <button
                    className="text-orange-500 hover:underline"
                    onClick={() => navigate(`/admin/incoming-orders/${order.id}`)}
                  >
                    #{order.id}
                  </button>
                </td>
                <td className="company-name">{order.company}</td>
                <td className="partner-phone">
                  <svg
                    className="w-4 h-4 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {order.phone}
                </td>
                <td className="total-price">${order.price}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td className="date">{order.date}</td>
                <td className="actions">
                  <button
                    className="view-icon"
                    title={`View order #${order.id}`}
                    aria-label={`View order #${order.id}`}
                    onClick={() => navigate(`/admin/incoming-orders/${order.id}`)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingOrders;