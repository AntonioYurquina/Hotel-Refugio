import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { differenceInDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenueChart({ reservations, rooms }) {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { years, chartData, chartOptions } = useMemo(() => {
    const yearSet = new Set();
    const monthlyRevenue = Array(12).fill(0);

    reservations.forEach(res => {
      const creationDate = new Date(res.fecha_creacion);
      const year = creationDate.getFullYear();
      yearSet.add(year);

      if (year === selectedYear && res.estado === 'finalizada') {
        const room = rooms.find(r => r.id_habitacion === res.id_habitacion);
        if (!room) return;

        const nights = differenceInDays(new Date(res.fecha_fin), new Date(res.fecha_inicio));
        const revenue = nights > 0 ? nights * parseFloat(room.precio_noche) : 0;
        
        const month = creationDate.getMonth();
        monthlyRevenue[month] += revenue;
      }
    });

    const themeColors = {
      bar: theme === 'light' ? 'rgba(233, 84, 32, 0.7)' : 'rgba(233, 84, 32, 0.9)', // Naranja principal
      text: theme === 'light' ? '#495057' : '#dee2e6',
    };

    const data = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: `Ingresos en ${selectedYear}`,
        data: monthlyRevenue,
        backgroundColor: themeColors.bar,
      }],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false, // Clave para controlar el tamaño
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: themeColors.text }, grid: { color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' } },
        x: { ticks: { color: themeColors.text }, grid: { color: 'transparent' } }
      }
    };

    return {
      years: Array.from(yearSet).sort((a, b) => b - a),
      chartData: data,
      chartOptions: options,
    };
  }, [reservations, rooms, selectedYear, theme]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="card-title mb-0">Ingresos Mensuales (Finalizadas)</h5>
        <select 
          className="form-select form-select-sm w-auto" 
          value={selectedYear} 
          onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
        >
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <div style={{ height: '300px' }}> {/* Contenedor con altura fija */}
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
}
