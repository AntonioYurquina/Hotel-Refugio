import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import { initialOperators } from './data/operators';

// Función para adaptar los datos de la API
const adaptRoomData = (apiRoom) => ({
  id: apiRoom.id_habitacion,
  name: `Habitación ${apiRoom.numero} (${apiRoom.tipo})`,
  price: parseFloat(apiRoom.precio_noche),
  capacity: parseInt(apiRoom.capacidad, 10),
  description: apiRoom.descripcion,
  open: apiRoom.estado !== 'ocupada' && apiRoom.estado !== 'cerrada',
  amenities: ['WiFi', 'TV', 'Servicio a la habitación'], // Datos de ejemplo
  imgQuery: `${apiRoom.tipo},hotel-room`,
});

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [gpt5Enabled, setGpt5Enabled] = useState(false);

  useEffect(() => {
    // Cargar habitaciones desde la API
    fetch('https://robledo.website/habitaciones')
      .then(response => response.json())
      .then(data => {
        if (data.ok && Array.isArray(data.datos)) {
          const adaptedRooms = data.datos.map(adaptRoomData);
          setRooms(adaptedRooms);
        }
      })
      .catch(error => console.error("Error fetching rooms:", error));

    // Cargar otras cosas desde localStorage
    const res = localStorage.getItem('hr_reservations');
    setReservations(res ? JSON.parse(res) : []);

    const ops = localStorage.getItem('hr_operators');
    setOperators(ops ? JSON.parse(ops) : initialOperators);

    const gpt = localStorage.getItem('hr_gpt5_enabled');
    setGpt5Enabled(gpt ? JSON.parse(gpt) : false);
  }, []);

  const addReservation = (reservation) => {
    const updated = [reservation, ...reservations];
    setReservations(updated);
    localStorage.setItem('hr_reservations', JSON.stringify(updated));
  };

  return (
    <Layout gpt5Enabled={gpt5Enabled}>
      <Routes>
        <Route path="/" element={
          <Home rooms={rooms} addReservation={addReservation} />
        } />
        <Route path="/operator" element={
          <Operator 
            rooms={rooms} setRooms={setRooms} 
            reservations={reservations} setReservations={setReservations} 
            gpt5Enabled={gpt5Enabled} setGpt5Enabled={setGpt5Enabled} 
          />
        } />
        <Route path="/admin" element={
          <Admin 
            rooms={rooms} setRooms={setRooms}
            operators={operators} setOperators={setOperators}
          />
        } />
      </Routes>
    </Layout>
  );
}
