import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderDetails.css';
  
const mockOrders = [
  {
    id: 1,
    company: 'Tech Solutions Inc.',
    phone: '01123123',
    partner: {
      name: 'John Smith',
      email: 'john@techsolutions.com',
    },
    assignedTo: 'Sarah Wilson',
    status: 'Pending',
    date: '2024-03-15',
    price: 70,
    deliveryLocation: '456 Tech Avenue, Innovation City, 54321',
    items: [
      {
        name: 'Smart Watch',
        description: 'Latest model with health tracking features',
        category: 'Electronics',
        price: 35,
        quantity: 2,
        total: 70,
      },
    ],
  },
  {
    id: 3,
    company: 'Gaming Gear Pro',
    phone: '01123123',
    partner: {
      name: 'Alex Turner',
      email: 'alex@gaminggearpro.com',
    },
    assignedTo: 'Mike Brown',
    status: 'Pending',
    date: '2024-03-13',
    price: 700,
    deliveryLocation: '123 Game St, Playtown, 12345',
    items: [
      {
        name: 'Gaming Mouse',
        description: 'High precision wireless mouse',
        category: 'Accessories',
        price: 100,
        quantity: 7,
        total: 700,
      },
    ],
  },
  {
    id: 5,
    company: 'Sports Equipment Co.',
    phone: '01123123',
    partner: {
      name: 'Linda Green',
      email: 'linda@sportsequipment.com',
    },
    assignedTo: 'Chris Evans',
    status: 'Delivered',
    date: '2024-03-11',
    price: 320,
    deliveryLocation: '789 Sport Ave, Fitcity, 67890',
    items: [
      {
        name: 'Tennis Racket',
        description: 'Lightweight and durable',
        category: 'Sports',
        price: 160,
        quantity: 2,
        total: 320,
      },
    ],
  },
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === Number(orderId));

  if (!order) {
    return (
      <div className="order-details-content">
        <button className="order-back-btn" onClick={() => navigate(-1)}>
          &larr; Back to Orders
        </button>
        <div>Order not found.</div>
      </div>
    );
  }

  return (
    <div className="order-details-content">
      <button className="order-back-btn" onClick={() => navigate(-1)}>
        &larr; Back to Orders
      </button>
      <div className="order-details-header-row">
        <div className="order-details-header-cards">
          <div className="order-details-card">
            <div className="order-details-card-icon building" />
            <div>
              <div className="order-details-card-label">COMPANY DETAILS</div>
              <div className="order-details-card-main">{order.company}</div>
              <div className="order-details-card-sub">Contact: {order.phone}</div>
            </div>
          </div>
          <div className="order-details-card">
            <div className="order-details-card-icon handshake" />
            <div>
              <div className="order-details-card-label">PARTNER INFORMATION</div>
              <div className="order-details-card-main">{order.partner.name}</div>
              <div className="order-details-card-sub">Email: {order.partner.email}</div>
            </div>
          </div>
          <div className="order-details-card">
            <div className="order-details-card-icon box" />
            <div>
              <div className="order-details-card-label">ORDER STATUS</div>
              <div className="order-details-card-main"><span className={`order-status-badge ${order.status.toLowerCase()}`}>{order.status}</span></div>
              <div className="order-details-card-sub">Placed: {order.date}</div>
            </div>
          </div>
          <div className="order-details-card">
            <div className="order-details-card-icon money" />
            <div>
              <div className="order-details-card-label">PRICE DETAILS</div>
              <div className="order-details-card-main">{order.price} $</div>
              <div className="order-details-card-sub">Assigned to: {order.assignedTo}</div>
            </div>
          </div>
        </div>
        <div className="order-details-location-card">
          <div className="order-details-location-label">Delivery Location</div>
          <div className="order-details-location-main">{order.deliveryLocation}</div>
          <div className="order-details-location-map">Map will be displayed here</div>
        </div>
      </div>
      <div className="order-details-items-card">
        <div className="order-details-items-header">
          <span>Order Items</span>
          <span>{order.items.length} items</span>
        </div>
        <table className="order-details-items-table">
          <thead>
            <tr>
              <th>PRODUCT NAME</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>{item.price} $</td>
                <td>{item.quantity}</td>
                <td>{item.total.toFixed(2)} $</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="order-details-id-btn">Order #{order.id}</button>
    </div>
  );
};

export default OrderDetails; 