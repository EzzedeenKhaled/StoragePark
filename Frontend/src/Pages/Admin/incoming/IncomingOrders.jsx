import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IncomingOrders.css';

const mockOrders = [
  {
    id: 1,
    company: 'Tech Solutions Inc.',
    phone: '01123123',
    price: 70,
    status: 'Pending',
    date: '2024-03-15',
  },
  {
    id: 3,
    company: 'Gaming Gear Pro',
    phone: '01123123',
    price: 700,
    status: 'Pending',
    date: '2024-03-13',
  },
  {
    id: 5,
    company: 'Sports Equipment Co.',
    phone: '01123123',
    price: 320,
    status: 'Delivered',
    date: '2024-03-11',
  },
];

const IncomingOrders = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filteredOrders = mockOrders.filter(order =>
    order.company.toLowerCase().includes(search.toLowerCase())
  );
  const totalAmount = mockOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="incoming-orders-content">
      <div className="incoming-orders-header">
        <div>
          <h2>Incoming Orders</h2>
          <p>Manage and track your incoming orders</p>
        </div>
        <input
          type="text"
          className="incoming-orders-search"
          placeholder="Search by company name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="incoming-orders-stats">
        <div className="stat-card">
          <div className="stat-icon box" />
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{mockOrders.length}</div>
          </div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-icon delivered-check" />
          <div>
            <div className="stat-label">Delivered</div>
            <div className="stat-value">0</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon pending-hourglass" />
          <div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{mockOrders.length}</div>
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
                    onClick={() => navigate(`/admin/incoming-orders/${order.id}`)}
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

export default IncomingOrders; 