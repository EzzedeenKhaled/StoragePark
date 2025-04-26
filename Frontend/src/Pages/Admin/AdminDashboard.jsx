import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import RequestsList from './Requests/RequestList';
import Partners from './Partner/partners';
import Store from './Store/Store';
function AdminDashboard() {
    return (
      <div className="app">
        <Sidebar />
        <Routes>
          <Route path="/" element={<div>Welcome to the Dashboard!</div>} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </div>
    );
}

export default AdminDashboard;