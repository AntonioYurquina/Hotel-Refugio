import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function OperatorStatistics({ reservations }) {
  const { theme } = useTheme();

  const themeColors = {
    pie: {
      // Paleta profesional con naranja como acento
      light: ['#27AE60', '#E95420', '#E74C3C', '#95A5A6'],
      dark: ['#27AE60', '#E95420', '#E74C3C', '#95A5A6'],
    },
    text: theme === 'light' ? '#495057' : '#dee2e6',
  };

  const reservationStatusData = useMemo(() => {
    const statusCounts = reservations.reduce((acc, res) => {
      acc[res.estado] = (acc[res.estado] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: ['Confirmadas', 'Pendientes', 'Canceladas', 'Finalizadas'],
      datasets: [{
        data: [
          statusCounts['confirmada'] || 0, 
          statusCounts['pendiente'] || 0,
          statusCounts['cancelada'] || 0,
          statusCounts['finalizada'] || 0
        ],
        backgroundColor: themeColors.pie[theme],
        borderColor: theme === 'light' ? '#fff' : '#300A24',
        borderWidth: 2,
      }],
    };
  }, [reservations, theme]);

  return (
    <div className="w-100">
      <div className="row">
        <div className="col-12">
          <Pie data={reservationStatusData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top', labels: { color: themeColors.text } },
              title: { display: true, text: 'Distribución de Estados', color: themeColors.text, font: { size: 16 } },
            }
          }} />
        </div>
      </div>
    </div>
  );
}
