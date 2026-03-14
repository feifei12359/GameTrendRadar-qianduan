const STAGE_STYLES = {
  exploding: 'border-red-200 bg-red-50 text-red-700',
  early: 'border-orange-200 bg-orange-50 text-orange-700',
  normal: 'border-slate-200 bg-slate-100 text-slate-600',
};

const STAGE_LABELS = {
  exploding: '爆发',
  early: '早期',
  normal: '普通',
};

const TYPE_STYLES = {
  tycoon: 'border-sky-200 bg-sky-50 text-sky-700',
  simulator: 'border-violet-200 bg-violet-50 text-violet-700',
  survival: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  defense: 'border-orange-200 bg-orange-50 text-orange-700',
  battlegrounds: 'border-red-200 bg-red-50 text-red-700',
  rng: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  obby: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
};

const TYPE_LABELS = {
  tycoon: '经营类',
  simulator: '模拟类',
  survival: '生存类',
  defense: '防御类',
  battlegrounds: '战场对战',
  rng: '随机抽取',
  obby: '跑酷类',
};

function formatScore(score) {
  return Math.round(typeof score === 'number' ? score : 0);
}

function formatPercent(value) {
  return `${Math.round((typeof value === 'number' ? value : 0) * 100)}%`;
}

function formatAcceleration(value) {
  const numericValue = typeof value === 'number' ? value : 0;
  return numericValue.toFixed(1);
}

function formatRobloxStatus(value) {
  return value ? '已存在' : '未找到';
}

function formatDiscoverStatus(value) {
  return value ? '已推荐' : '未命中';
}

function getPrimaryScore(trend) {
  return typeof trend.prediction_score === 'number' ? trend.prediction_score : trend.score ?? 0;
}

function renderStage(stage) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STAGE_STYLES[stage] || STAGE_STYLES.normal
      }`}
    >
      {STAGE_LABELS[stage] || '普通趋势'}
    </span>
  );
}

function renderType(type) {
  if (!type) {
    return <span className="text-slate-400">-</span>;
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        TYPE_STYLES[type] || 'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {TYPE_LABELS[type] || type}
    </span>
  );
}

function SignalMetric({ label, value, valueClassName = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4">
      <div className="text-xs font-semibold tracking-[0.08em] text-slate-400">{label}</div>
      <div className={`mt-2 text-base font-semibold ${valueClassName}`}>{value}</div>
    </div>
  );
}

function CompactTrendList({ trends, emptyMessage }) {
  const sortedTrends = [...trends].sort((a, b) => getPrimaryScore(b) - getPrimaryScore(a));

  if (!sortedTrends.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTrends.map((trend) => (
        <article
          key={trend.id}
          className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight text-slate-950">{trend.keyword}</h3>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800">
                  评分 {formatScore(getPrimaryScore(trend))}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {renderStage(trend.stage)}
                {renderType(trend.type)}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <SignalMetric label="提及量" value={trend.current24hCount ?? 0} />
            <SignalMetric
              label="增长率"
              value={formatPercent(trend.growth_rate ?? trend.growthRate)}
              valueClassName="text-emerald-700"
            />
            <SignalMetric label="加速度" value={formatAcceleration(trend.acceleration)} />
            <SignalMetric
              label="Roblox"
              value={formatRobloxStatus(trend.robloxExists)}
              valueClassName={trend.robloxExists ? 'text-emerald-700' : 'text-slate-500'}
            />
            <SignalMetric
              label="Discover"
              value={formatDiscoverStatus(trend.discoverMatch)}
              valueClassName={trend.discoverMatch ? 'text-sky-700' : 'text-slate-500'}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

function DetailedTrendList({ trends, emptyMessage }) {
  if (!trends.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trends.map((trend) => (
        <article
          key={trend.id}
          className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 xl:max-w-[38%]">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-3xl font-bold tracking-tight text-slate-950">
                  {trend.keyword}
                </h3>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800">
                  评分 {formatScore(getPrimaryScore(trend))}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">趋势阶段：</span>
                  {renderStage(trend.stage)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">游戏类型：</span>
                  {renderType(trend.type)}
                </div>
              </div>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <SignalMetric label="提及量" value={trend.current24hCount ?? 0} />
              <SignalMetric
                label="增长率"
                value={formatPercent(trend.growth_rate ?? trend.growthRate)}
                valueClassName="text-emerald-700"
              />
              <SignalMetric label="加速度" value={formatAcceleration(trend.acceleration)} />
              <SignalMetric
                label="Roblox"
                value={formatRobloxStatus(trend.robloxExists)}
                valueClassName={trend.robloxExists ? 'text-emerald-700' : 'text-slate-500'}
              />
              <SignalMetric
                label="Discover"
                value={formatDiscoverStatus(trend.discoverMatch)}
                valueClassName={trend.discoverMatch ? 'text-sky-700' : 'text-slate-500'}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function TrendList({
  trends,
  emptyMessage = '当前没有符合条件的趋势',
  detailed = false,
}) {
  if (detailed) {
    return <DetailedTrendList trends={trends} emptyMessage={emptyMessage} />;
  }

  return <CompactTrendList trends={trends} emptyMessage={emptyMessage} />;
}
