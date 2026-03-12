import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PredictionChart({ timeline = [] }) {
  const labels = timeline.map((_, i) => `F${i + 1}`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Fake probability',
        data: timeline.map((item) => Number((item.fake_probability * 100).toFixed(2))),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244,63,94,0.2)',
      },
    ],
  };

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Prediction Timeline</h3>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: '#cbd5e1' },
            },
          },
          scales: {
            x: { ticks: { color: '#94a3b8' } },
            y: { ticks: { color: '#94a3b8' }, min: 0, max: 100 },
          },
        }}
      />
    </div>
  );
}
