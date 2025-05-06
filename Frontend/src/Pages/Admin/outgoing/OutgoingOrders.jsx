import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OutgoingOrders.css';

const mockOutgoingOrders = [
  {
    id: 101,
    company: 'Office Supplies Ltd.',
    phone: '022334455',
    price: 150,
    status: 'Pending',
    date: '2024-03-10',
  },
  {
    id: 102,
    company: 'Warehouse Central',
    phone: '033445566',
    price: 420,
    status: 'Delivered',
    date: '2024-03-12',
  },
  {
    id: 103,
    company: 'Retail Partners',
    phone: '044556677',
    price: 300,
    status: 'Pending',
    date: '2024-03-14',
  },
];

const OutgoingOrders = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filteredOrders = mockOutgoingOrders.filter(order =>
    order.company.toLowerCase().includes(search.toLowerCase())
  );
  const totalAmount = mockOutgoingOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="outgoing-orders-content">
      <div className="outgoing-orders-header">
        <div>
          <h2>Outgoing Orders</h2>
          <p>Manage and track your outgoing orders</p>
        </div>
        <input
          type="text"
          className="outgoing-orders-search"
          placeholder="Search by company name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="outgoing-orders-stats">
        <div className="stat-card">
          <div className="stat-icon box" />
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{mockOutgoingOrders.length}</div>
          </div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-icon delivered-check" />
          <div>
            <div className="stat-label">Delivered</div>
            <div className="stat-value">{mockOutgoingOrders.filter(o => o.status === 'Delivered').length}</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon pending-hourglass" />
          <div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{mockOutgoingOrders.filter(o => o.status === 'Pending').length}</div>
          </div>
        </div>
        <div className="stat-card amount">
          <div className="stat-icon amount-bag" />
          <div>
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${totalAmount}</div>
          </div>
        </div>
      </div>
      <div className="outgoing-orders-table-wrapper">
        <table className="outgoing-orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>COMPANY NAME</th>
              <th>CUSTOMER PHONE</th>
              <th>TOTAL PRICE</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td className="company-name">{order.company}</td>
                <td className="partner-phone">
                  <span className="phone-icon" /> {order.phone}
                </td>
                <td className="total-price">{order.price} $</td>
                <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
                <td className="date">{order.date}</td>
                <td className="actions">
                  <span
                    className="view-icon"
                    title={`View order #${order.id}`}
                    aria-label={`View order #${order.id}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/outgoing-orders/${order.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutgoingOrders; 