import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const [credentials, setCredentials] = useState({
    codinome: '',
    senha: '',
    afiliacao: 'Império' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', credentials);
      alert('Usuário registrado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div className='container'>
      <div className='hud-login'>
        <h2 className="hud-titulo">Registrar Novo Usuário</h2>
        <form onSubmit={handleRegister}>
          <input
            className="input-starwars"
            type="text"
            placeholder="Codinome"
            value={credentials.codinome}
            onChange={(e) => setCredentials({ ...credentials, codinome: e.target.value })}
          />
          <input
            className="input-starwars"
            type="password"
            placeholder="Senha"
            value={credentials.senha}
            onChange={(e) => setCredentials({ ...credentials, senha: e.target.value })}
          />

          <select
            className="input-starwars"
            value={credentials.afiliacao}
            onChange={(e) => setCredentials({ ...credentials, afiliacao: e.target.value })}
          >
            <option value="Império">Império</option>
            <option value="Cartel Hutt">Cartel Hutt</option>
            <option value="Aurora Escarlate">Aurora Escarlate</option>
            <option value="Sindicato Pyke">Sindicato Pyke</option>
          </select>

          <button className="btn-starwars" type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
