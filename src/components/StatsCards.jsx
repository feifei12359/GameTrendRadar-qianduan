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

export default function StatsCards({ trendingNow, exploding, early, total }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="正在爆发"
        value={`${trendingNow} 个`}
        accent="text-rose-600"
        description="当前最值得优先关注的趋势信号。"
      />
      <StatCard
        label="爆发趋势"
        value={`${exploding} 个`}
        accent="text-red-600"
        description="近期提及量快速上升的趋势数量。"
      />
      <StatCard
        label="早期趋势"
        value={`${early} 个`}
        accent="text-orange-500"
        description="已出现增长信号，仍在持续观察中的趋势。"
      />
      <StatCard
        label="趋势总数"
        value={`${total} 个`}
        accent="text-sky-700"
        description="当前纳入趋势雷达的全部信号数量。"
      />
    </section>
  );
}
