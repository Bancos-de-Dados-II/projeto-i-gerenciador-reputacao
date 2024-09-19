import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/api';
import 'leaflet/dist/leaflet.css';
import '../styles/MapStyles.css';

const customIcon = L.divIcon({
    html: '<img src="' + require('../static/imperial-icon.png') + '" style="width: 8000px; height: 4000px;" />',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'custom-icon'
  });
  
const MapComponent = () => {
  const [position, setPosition] = useState([0, 0]);
  const [pontos, setPontos] = useState([]);
  const [newPonto, setNewPonto] = useState({ descricao: '', geometria: '' });

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const response = await api.get('/pontos');
        setPontos(response.data);
        console.log('Data fetched successfully:', response.data);
      } catch (error) {
        console.error('Erro ao buscar pontos de interesse:', error);
        console.error('Error details:', error.response ? error.response.data : error.message);
      }
    };

    fetchPontos();
  }, []);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPonto({ ...newPonto, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/pontos', newPonto);
      setPontos([...pontos, response.data]);
      setNewPonto({ descricao: '', geometria: '' });
    } catch (error) {
      console.error('Erro ao criar ponto de interesse:', error);
    }
  };

  const handleUpdatePonto = async (id, updatedPonto) => {
    try {
      const response = await api.put(`/pontos/${id}`, updatedPonto);
      setPontos(pontos.map(ponto => (ponto.id === id ? response.data : ponto)));
    } catch (error) {
      console.error('Erro ao atualizar ponto de interesse:', error);
    }
  };
  
  const handleDeletePonto = async (id) => {
    try {
      await api.delete(`/pontos/${id}`);
      setPontos(pontos.filter(ponto => ponto.id !== id));
    } catch (error) {
      console.error('Erro ao deletar ponto de interesse:', error);
    }
  };  

  return (
    <div>
      <button onClick={handleGetLocation}>Get My Location</button>

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="descricao"
          value={newPonto.descricao}
          onChange={handleInputChange}
          placeholder="Descrição"
          required
        />
        <input
          type="text"
          name="geometria"
          value={newPonto.geometria}
          onChange={handleInputChange}
          placeholder='Geometria (e.g., {"type":"Point","coordinates":[longitude,latitude]})'
          required
        />
        <button type="submit">Add Ponto</button>
      </form>

      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pontos.map((ponto) => {
          const { id, descricao, geometria } = ponto;
          const coords = JSON.parse(geometria).coordinates;
          return (
            <Marker key={id} position={[coords[1], coords[0]]} icon={customIcon}>
              <Popup>{descricao}
                <button onClick={() => handleUpdatePonto(id, { descricao: 'New Description', geometria })}>Update</button>
                <button onClick={() => handleDeletePonto(id)}>Delete</button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;