import { useEffect, useRef, useState } from 'react';
import { Camera, Upload, Download, RefreshCw } from 'lucide-react';
import { detectFrame, reportUrl, uploadVideo } from '../lib/api';
import TrustMeter from '../components/TrustMeter';
import PredictionChart from '../components/PredictionChart';

function formatPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function Dashboard({ webcamMode }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const data = await uploadVideo(file, setUploadProgress);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startWebcam = async () => {
      if (!webcamMode) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        timerRef.current = setInterval(async () => {
          if (!videoRef.current || !canvasRef.current) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = canvas.toDataURL('image/jpeg');
          try {
            const data = await detectFrame(frame);
            setResult((prev) => {
              const timeline = [...(prev?.timeline || []), data.frame_prediction].slice(-50);
              return {
                ...data,
                timeline,
              };
            });
          } catch {
            // silent in interval
          }
        }, 1500);
      } catch {
        setError('Unable to access webcam.');
      }
    };

    startWebcam();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [webcamMode]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Detection Dashboard</h2>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm"
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <Upload className="text-brand-500" />
              <h3 className="font-semibold">Video Upload</h3>
            </div>
            <label className="flex min-h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-900/50 p-6 text-center text-slate-300">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              Drag & drop or click to upload a video for deepfake analysis
            </label>
            {loading && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-slate-300">Processing video... {uploadProgress}%</p>
                <div className="h-2 rounded bg-slate-800">
                  <div className="h-2 rounded bg-cyan-400" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <Camera className="text-cyan-400" />
              <h3 className="font-semibold">Webcam Live Detection</h3>
            </div>
            <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-xl border border-slate-700" />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {result?.timeline?.length ? <PredictionChart timeline={result.timeline} /> : null}
        </div>

        <aside className="space-y-6">
          <TrustMeter score={(result?.trust_score || 0) * 100} />

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Prediction Output</h3>
            <p className="text-sm text-slate-300">Label</p>
            <p className={`text-3xl font-bold ${result?.label === 'FAKE' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {result?.label || 'N/A'}
            </p>
            <p className="mt-4 text-sm text-slate-300">Confidence</p>
            <p className="text-xl font-semibold">{result ? formatPct(result.confidence) : '--'}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Explainability</h3>
            <button
              onClick={() => setShowHeatmap((prev) => !prev)}
              className="mb-3 rounded-lg border border-slate-700 px-3 py-2 text-sm"
            >
              Toggle {showHeatmap ? 'Original' : 'Heatmap'}
            </button>
            {result?.heatmap_image ? (
              <img
                src={`data:image/jpeg;base64,${showHeatmap ? result.heatmap_image : result.original_frame}`}
                alt="Grad-CAM"
                className="rounded-xl border border-slate-700"
              />
            ) : (
              <p className="text-sm text-slate-400">No heatmap yet. Run detection.</p>
            )}
          </div>

          {result?.report_id ? (
            <a
              href={reportUrl(result.report_id)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950"
            >
              <Download size={16} /> Download Report
            </a>
          ) : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </aside>
      </div>
    </section>
  );
}
