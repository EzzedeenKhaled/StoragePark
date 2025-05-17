import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PartnerDashboardPage from './PartnerDashboardPage';
import PartnerAnalytics from './Analytics/PartnerAnalytics';
import Orders from './Orders/orders';
import ProductList from './products/productList';
import ProductForm from './products/ProductForm';
import ProfilePartner from './profile/ProfilePartner';
import Sidebar from '../Partner/components/Sidebar';
import { useUserStore } from '../../stores/useUserStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import axios from '../../../lib/axios';
function PartnerDashboard() {
  const { user } = useUserStore();
  const [checkingRole, setCheckingRole] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!user) {
      return;
    }
    setCheckingRole(true);
     if (user.role === "customer") {
       axios.post('/admins/logs', {
      action: "Unauthorized Access",
      user: user?._id,
      role: user?.role,
      details: "Attempted to access partner dashboard"
    });
      navigate('/unauthorized');
    }
    setCheckingRole(false);
  }, [user, navigate]);
  if (checkingRole) return <LoadingSpinner />;
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 bg-[#1E2640] z-30 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 relative overflow-y-auto">
        <div className="h-full">
          <Routes>
            <Route path="/" element={<PartnerDashboardPage />} />
            <Route path="/analytics" element={<PartnerAnalytics />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/productForm" element={<ProductForm />} />
            <Route path="/profile" element={<ProfilePartner />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default PartnerDashboard;