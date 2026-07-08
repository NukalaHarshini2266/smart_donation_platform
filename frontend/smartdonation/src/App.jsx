import React, { useState ,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterDonor from './pages/RegisterDonor';
import RegisterOrganization from './pages/RegisterOrganization';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard';
import DonorDashboard from './pages/donor-dashboard/DonorDashboard';
import OrganizationDetails from './pages/admin-dashboard/OrganizationDetails';
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import UpiPayment from './pages/donor-dashboard/UpiPayment';
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = savedTheme;
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Removed Navbar component from here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register/donor" element={<RegisterDonor />} />
          <Route path="/register/organization" element={<RegisterOrganization />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/donor" element={<DonorDashboard user={user} />} />
          <Route path="/upi-payment" element={<UpiPayment />} />
          <Route path="/organization" element={<OrganizationDashboard user={user} />}/>
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/admin/organizations/:id" element={<OrganizationDetails />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/privacy" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;