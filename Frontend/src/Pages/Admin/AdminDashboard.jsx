import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import DashboardPage from './Dashboard/DashboardPage';
import RequestsList from './Requests/RequestList';
import Partners from './Partner/partners';
import Store from './Store/Store';
import Customers from './Customers';
import Employees from './Employees';
import Rows from './Store/Rows';
function AdminDashboard() {
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
            <Route path="/" element={<DashboardPage />} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/store" element={<Store />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/rows" element={<Rows />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;