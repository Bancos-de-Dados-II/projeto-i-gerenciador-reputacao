import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [erro, setErro] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('login', credentials);
      
      const token = response.data.token;
      localStorage.setItem('token', token);

      setUser({token});
      
      setErro(null);
      navigate('/map');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErro(error.response.data.error);
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
      console.error('Erro ao fazer login:', erro);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
