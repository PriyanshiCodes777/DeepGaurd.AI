import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState('landing');
  const [webcamMode, setWebcamMode] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.2),_transparent_50%)]">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-bold">DeepGuard AI</h1>
          <button
            onClick={() => setPage(page === 'landing' ? 'dashboard' : 'landing')}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm"
          >
            {page === 'landing' ? 'Open Dashboard' : 'Back to Landing'}
          </button>
        </div>
      </header>

      {page === 'landing' ? (
        <LandingPage
          onStartUpload={() => {
            setWebcamMode(false);
            setPage('dashboard');
          }}
          onStartWebcam={() => {
            setWebcamMode(true);
            setPage('dashboard');
          }}
        />
      ) : (
        <Dashboard webcamMode={webcamMode} />
      )}
    </main>
  );
}
