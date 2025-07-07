import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import { AuthProvider } from './context/AuthContext';
 import Layout from './components/Layout';
 import Login from './components/Auth/Login';
 import Register from './components/Auth/Register';
 import ForgotPassword from './components/Auth/ForgotPassword';
import IncidentDetail from './components/Auth/Incidents/IncidentDetail';
import IncidentForm from './components/Auth/Incidents/IncidentForm';
import IncidentList from './components/Auth/Incidents/IncidentList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/incidents" element={<IncidentList />} />
            <Route path="/incidents/new" element={<IncidentForm />} />
            <Route path="/incidents/:incidentId" element={<IncidentDetail />} />
            <Route path="/" element={<IncidentList />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;