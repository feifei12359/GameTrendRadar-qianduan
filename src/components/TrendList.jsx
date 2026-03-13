const STAGE_STYLES = {
  exploding: 'border-red-200 bg-red-50 text-red-700',
  early: 'border-orange-200 bg-orange-50 text-orange-700',
  normal: 'border-slate-200 bg-slate-100 text-slate-600',
};

function formatScore(score) {
  if (typeof score !== 'number') {
    return '0.0';
  }

  return score.toFixed(1);
}

export default function TrendList({ trends }) {
  const sortedTrends = [...trends].sort((a, b) => b.score - a.score);

  if (!sortedTrends.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center text-sm text-slate-500">
        暂无趋势数据，请先运行分析或日常任务。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="grid grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_0.7fr_1.5fr] gap-4 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>Keyword</span>
        <span>Score</span>
        <span>Stage</span>
        <span>Source</span>
        <span>Region</span>
        <span>AI Insight</span>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {sortedTrends.map((trend) => (
          <div
            key={trend.id}
            className="grid grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_0.7fr_1.5fr] gap-4 px-6 py-5 text-sm text-slate-700"
          >
            <div className="font-semibold text-slate-900">{trend.keyword}</div>
            <div className="font-semibold text-slate-900">{formatScore(trend.score)}</div>
            <div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                  STAGE_STYLES[trend.stage] || STAGE_STYLES.normal
                }`}
              >
                {trend.stage}
              </span>
            </div>
            <div className="capitalize text-slate-600">{trend.source || '-'}</div>
            <div className="text-slate-600">{trend.region || '-'}</div>
            <div className="leading-6 text-slate-600">{trend.aiInsight || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
