import React, { useState } from 'react';
import { useAuth  } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MapStyles.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ codinome: '', senha: '' });
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <div className='container '>
      <div className='hud-login '>
        <h2 className="hud-titulo">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input-starwars"
            type="codinome"
            name="codinome"
            placeholder="Codinome"
            value={credentials.codinome}
            onChange={handleInputChange}
            required
          />
          <input
            className="input-starwars"
            type="password"
            name="senha"
            placeholder="Senha"
            value={credentials.senha}
            onChange={handleInputChange}
            required
          />
          <button className="btn-starwars" type="submit">Entrar</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>

        <button className="btn-starwars" onClick={() => navigate('/register')}>
          Registrar-se
        </button>
      </div>
    </div>
  );
};

export default Login;
