import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Pages/Login";
import Register from "./Pages/CustomerRegister";
import RegisterPartner from "./Pages/PartnerRegister1";
import RegisterPartner2 from "./Pages/PartnerRegister2";
import HomePage from "./Pages/HomePage";
import PartnerHome from "./Pages/PartnerHome";
import { Toaster } from 'react-hot-toast';
import EmailVer from "./Pages/EmailVer"
function App() {
  return (
    <>
    <Toaster />
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-partner-1" element={<RegisterPartner />} />
        <Route path="/register-partner-2" element={<RegisterPartner2 />} />
        <Route path="/register-customer" element={<Register />} />
        <Route path="/partner" element={<PartnerHome />} />
        <Route path="/verify-email" element={<EmailVer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </>
  );
}


export default App;