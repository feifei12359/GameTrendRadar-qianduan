function StatCard({ label, value, accent, description }) {
  return (
    <div className="flex min-h-[168px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-[0.08em] text-slate-500">{label}</p>
        <p className={`text-5xl font-semibold tracking-tight ${accent}`}>{value}</p>
      </div>
      <p className="text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function StatsCards({ exploding, early, total, newWordCount }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="爆发趋势"
        value={exploding}
        accent="text-red-600"
        description="当前检测到的爆发趋势"
      />
      <StatCard
        label="早期趋势"
        value={early}
        accent="text-orange-500"
        description="当前检测到的早期趋势"
      />
      <StatCard
        label="全部趋势"
        value={total}
        accent="text-sky-700"
        description="当前趋势总数"
      />
      <StatCard
        label="新词"
        value={newWordCount}
        accent="text-emerald-600"
        description="当前新词总数"
      />
    </section>
  );
}
