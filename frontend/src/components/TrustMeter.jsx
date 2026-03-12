export default function TrustMeter({ score }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>Overall Trust Score</span>
        <span>{safeScore}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-brand-500 to-pink-500 transition-all"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}
