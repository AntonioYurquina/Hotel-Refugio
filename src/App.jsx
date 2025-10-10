import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import { initialRooms } from './data/rooms';
import { initialOperators } from './data/operators';

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [gpt5Enabled, setGpt5Enabled] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem('hr_rooms');
    setRooms(r ? JSON.parse(r) : initialRooms);

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
