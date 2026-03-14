function StatCard({ label, value, accent, description }) {
  return (
    <div className="flex min-h-[172px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="space-y-4">
        <p className="text-sm font-semibold tracking-[0.08em] text-slate-700">{label}</p>
        <p className={`text-6xl font-semibold tracking-tight leading-none ${accent}`}>{value}</p>
      </div>
      <p className="max-w-[18rem] text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function StatsCards({ trendingNow, exploding, early, total }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="正在爆发"
        value={trendingNow}
        accent="text-rose-600"
        description="当前最值得优先关注的趋势信号"
      />
      <StatCard
        label="爆发趋势"
        value={exploding}
        accent="text-red-600"
        description="近期增长最快的趋势数量"
      />
      <StatCard
        label="早期趋势"
        value={early}
        accent="text-orange-500"
        description="已出现增长信号的趋势数量"
      />
      <StatCard
        label="趋势总数"
        value={total}
        accent="text-sky-700"
        description="当前已纳入监测的全部趋势"
      />
    </section>
  );
}
