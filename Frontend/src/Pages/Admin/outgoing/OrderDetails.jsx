import { useParams, useNavigate } from 'react-router-dom';
import './OrderDetails.css';

const mockOutgoingOrders = [
  {
    id: 101,
    company: 'Office Supplies Ltd.',
    phone: '022334455',
    partner: {
      name: 'Emily Clark',
      email: 'emily@officesupplies.com',
    },
    assignedTo: 'Tom Hardy',
    status: 'Pending',
    date: '2024-03-10',
    price: 150,
    deliveryLocation: '12 Supply Road, Officetown, 11111',
    items: [
      {
        name: 'Printer Paper',
        description: 'A4, 500 sheets',
        category: 'Stationery',
        price: 15,
        quantity: 10,
        total: 150,
      },
    ],
  },
  {
    id: 102,
    company: 'Warehouse Central',
    phone: '033445566',
    partner: {
      name: 'Brian Lee',
      email: 'brian@warehousecentral.com',
    },
    assignedTo: 'Anna White',
    status: 'Delivered',
    date: '2024-03-12',
    price: 420,
    deliveryLocation: '34 Central Ave, Storagetown, 22222',
    items: [
      {
        name: 'Storage Boxes',
        description: 'Large, pack of 6',
        category: 'Packaging',
        price: 70,
        quantity: 6,
        total: 420,
      },
    ],
  },
  {
    id: 103,
    company: 'Retail Partners',
    phone: '044556677',
    partner: {
      name: 'Sophie Turner',
      email: 'sophie@retailpartners.com',
    },
    assignedTo: 'David Kim',
    status: 'Pending',
    date: '2024-03-14',
    price: 300,
    deliveryLocation: '56 Retail St, Shopcity, 33333',
    items: [
      {
        name: 'Display Shelves',
        description: 'Metal, 5-tier',
        category: 'Furniture',
        price: 150,
        quantity: 2,
        total: 300,
      },
    ],
  },
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = mockOutgoingOrders.find(o => o.id === Number(orderId));

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