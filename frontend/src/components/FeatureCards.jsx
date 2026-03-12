import { motion } from 'framer-motion';
import { ShieldCheck, Gauge, Flame } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Real-time Detection',
    desc: 'Analyze uploaded videos and live webcam streams with low-latency deepfake detection.',
  },
  {
    icon: Gauge,
    title: 'Trust Score',
    desc: 'Get a robust confidence score aggregated across frames and facial consistency signals.',
  },
  {
    icon: Flame,
    title: 'Heatmap Explainability',
    desc: 'Grad-CAM overlays highlight manipulated facial regions for transparent AI decisions.',
  },
];

export default function FeatureCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <feature.icon className="mb-4 h-8 w-8 text-brand-500" />
          <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
          <p className="text-sm text-slate-300">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
