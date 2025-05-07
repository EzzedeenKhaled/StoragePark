import { useState } from 'react';
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
        <div className="relative">
          <input
            type="text"
            className="outgoing-orders-search"
            placeholder="Search by company name"
            value={search}
            onChange={e => setSearch(e.target.value)}
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

      <div className="outgoing-orders-stats">
        <div className="stat-card box">
          <div className="stat-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{mockOutgoingOrders.length}</div>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Delivered</div>
            <div className="stat-value">{mockOutgoingOrders.filter(o => o.status === 'Delivered').length}</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{mockOutgoingOrders.filter(o => o.status === 'Pending').length}</div>
          </div>
        </div>

        <div className="stat-card amount">
          <div className="stat-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
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
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {order.phone}
                </td>
                <td className="total-price">${order.price}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status === 'Delivered' ? (
                      <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {order.status}
                  </span>
                </td>
                <td className="date">{order.date}</td>
                <td className="actions">
                  <button
                    className="view-icon"
                    title={`View order #${order.id}`}
                    aria-label={`View order #${order.id}`}
                    onClick={() => navigate(`/admin/outgoing-orders/${order.id}`)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

export default OutgoingOrders; 