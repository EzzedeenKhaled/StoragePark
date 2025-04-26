import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import DashboardPage from './Dashboard/DashboardPage';
import RequestsList from './Requests/RequestList';
import Partners from './Partner/partners';
import Store from './Store/Store';

function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 bg-[#1E2640] z-30">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;