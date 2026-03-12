import { motion } from 'framer-motion';
import FeatureCards from '../components/FeatureCards';

export default function LandingPage({ onStartUpload, onStartWebcam }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-600/20 p-10 shadow-glow"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-300">DeepGuard AI</p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Real-Time Deepfake Detection Web Suite
        </h1>
        <p className="mt-5 max-w-2xl text-slate-300">
          Upload videos or launch webcam analysis to detect manipulated media with explainable AI insights,
          trust scoring, and frame-level timelines.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={onStartUpload}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-cyan-400 px-6 py-3 font-semibold text-slate-950"
          >
            Upload Video
          </button>
          <button
            onClick={onStartWebcam}
            className="rounded-xl border border-slate-500 px-6 py-3 font-semibold text-slate-100"
          >
            Start Webcam Detection
          </button>
        </div>
      </motion.div>
      <FeatureCards />
    </section>
  );
}
