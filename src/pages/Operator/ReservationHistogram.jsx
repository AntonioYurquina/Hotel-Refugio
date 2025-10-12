import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReservationHistogram({ reservations }) {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('todas');

  const { years, chartData, chartOptions } = useMemo(() => {
    const yearSet = new Set();
    const statuses = ['confirmada', 'pendiente', 'cancelada', 'finalizada'];
    
    const themeColors = {
      bar: {
        todas: theme === 'light' ? 'rgba(233, 84, 32, 0.7)' : 'rgba(233, 84, 32, 0.9)',
        confirmada: '#27AE60',
        pendiente: '#F1C40F',
        cancelada: '#E74C3C',
        finalizada: '#95A5A6',
      },
      text: theme === 'light' ? '#495057' : '#dee2e6',
    };

    const barColor = themeColors.bar[statusFilter];

    const monthlyCounts = {};
    statuses.forEach(s => { monthlyCounts[s] = Array(12).fill(0); });

    reservations.forEach(res => {
      const creationDate = new Date(res.fecha_creacion);
      const year = creationDate.getFullYear();
      yearSet.add(year);

      if (year === selectedYear && statuses.includes(res.estado)) {
        const month = creationDate.getMonth();
        monthlyCounts[res.estado][month]++;
      }
    });

    let datasets = [];
    if (statusFilter === 'todas') {
      datasets = statuses.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        data: monthlyCounts[status],
        backgroundColor: themeColors.bar[status],
      }));
    } else {
      datasets = [{
        label: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1),
        data: monthlyCounts[statusFilter],
        backgroundColor: barColor,
      }];
    }

    const data = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: datasets,
    };

    const chartTitle = `Reservas en ${selectedYear}`;

    const options = {
      responsive: true,
      plugins: {
        legend: { display: statusFilter === 'todas', position: 'top', labels: { color: themeColors.text } },
        title: { display: true, text: chartTitle, color: themeColors.text },
      },
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
  }, [reservations, selectedYear, statusFilter, theme]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group btn-group-sm" role="group">
          {['todas', 'confirmada', 'pendiente', 'cancelada', 'finalizada'].map(status => (
            <button
              key={status}
              type="button"
              className={`btn text-capitalize ${statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <select 
          className="form-select form-select-sm w-auto" 
          value={selectedYear} 
          onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
        >
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <Bar data={chartData} options={chartOptions} />
    </>
  );
}
