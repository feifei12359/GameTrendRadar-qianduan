import { Link } from 'react-router-dom';
import {
  formatAcceleration,
  formatDiscoverStatus,
  formatPercent,
  formatRobloxStatus,
  formatScore,
  getPrimaryScore,
  getStageLabel,
  getTypeLabel,
  STAGE_STYLES,
  TYPE_STYLES,
} from '../lib/trend-formatters';

function renderStage(stage) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STAGE_STYLES[stage] || STAGE_STYLES.normal
      }`}
    >
      {getStageLabel(stage, true)}
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
      {getTypeLabel(type)}
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

function TrendCard({ trend, detailed = false }) {
  const cardContent = (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className={`flex flex-col gap-5 ${detailed ? 'xl:flex-row xl:items-start xl:justify-between' : ''}`}>
        <div className={`min-w-0 ${detailed ? 'xl:max-w-[38%]' : ''}`}>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className={`${detailed ? 'text-3xl' : 'text-2xl'} font-bold tracking-tight text-slate-950`}>
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
  );

  return (
    <Link
      to={`/trends/${encodeURIComponent(trend.keyword ?? '')}`}
      className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
    >
      {cardContent}
    </Link>
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
        <TrendCard key={trend.id ?? trend.keyword} trend={trend} />
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
        <TrendCard key={trend.id ?? trend.keyword} trend={trend} detailed />
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
