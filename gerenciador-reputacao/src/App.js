import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MapComponent from './map/MapComponent';
import Login from './auth/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './auth/Register';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

const App = () => {
  return (
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={
            <ProtectedRoute>
              <MapComponent />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        </AuthProvider>
      </Router>
   );
};

export default App;
