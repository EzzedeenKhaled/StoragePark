import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useUserStore } from '../stores/useUserStore';
import { OrderList } from '../../components/OrderList';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
function OrderHistory() {
  const { user } = useUserStore();
  const [checkingRole, setCheckingRole] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    setCheckingRole(true);
    if (user?.role === "admin" || user?.role === "partner" || !user) {
      navigate('/');
      setCheckingRole(false);
    }
    setCheckingRole(false);
  }, [user, navigate]);
  if (checkingRole) return <LoadingSpinner />;
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userName={user?.name || 'Guest'} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <OrderList />
      </main>
    </div>
  );
}

export default OrderHistory;