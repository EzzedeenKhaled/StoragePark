import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import RequestsList from './Requests/RequestList';
import Partners from './Partner/partners';

function AdminDashboard() {
    return (
      <Router>
        <div className="app">
          <Sidebar />
          <Routes>
            <Route path="/" element={<div>Welcome to the Dashboard!</div>} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path='/partners' element={<Partners/>} />
          </Routes>
        </div>
      </Router>
    );
  }
  
  export default AdminDashboard;