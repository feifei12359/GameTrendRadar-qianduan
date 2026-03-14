const STAGE_STYLES = {
  exploding: 'border-rose-200 bg-rose-50 text-rose-700',
  early: 'border-amber-200 bg-amber-50 text-amber-700',
  normal: 'border-slate-200 bg-slate-100 text-slate-600',
};

const STAGE_LABELS = {
  exploding: 'Exploding',
  early: 'Early',
  normal: 'Normal',
};

const TYPE_STYLES = {
  tycoon: 'bg-sky-50 text-sky-700 border-sky-200',
  simulator: 'bg-violet-50 text-violet-700 border-violet-200',
  obby: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  survival: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  defense: 'bg-orange-50 text-orange-700 border-orange-200',
  rng: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  battlegrounds: 'bg-red-50 text-red-700 border-red-200',
};

const SOURCE_LABELS = {
  youtube: 'YouTube',
  roblox: 'Roblox',
  google_trends: 'Google Trends',
};

const REGION_LABELS = {
  global: 'Global',
  us: 'US',
};

function formatScore(score) {
  const numericScore = typeof score === 'number' ? score : 0;
  return numericScore.toFixed(1);
}

function formatPercent(value) {
  const numericValue = typeof value === 'number' ? value : 0;
  return `${Math.round(numericValue * 100)}%`;
}

function formatAcceleration(value) {
  const numericValue = typeof value === 'number' ? value : 0;
  return numericValue.toFixed(2);
}

function formatBoolean(value) {
  return value ? '✓' : '✗';
}

function getPrimaryScore(trend) {
  return typeof trend.prediction_score === 'number' ? trend.prediction_score : trend.score;
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
      {type}
    </span>
  );
}

function translateInsight(stage) {
  if (stage === 'exploding') {
    return '该关键词正在快速放量，值得优先关注。';
  }

  if (stage === 'early') {
    return '该关键词正处于早期增长阶段，建议持续观察。';
  }

  return '该关键词当前仍处于基础观察阶段。';
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
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="grid grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_0.7fr_1.5fr] gap-4 bg-slate-50 px-6 py-4 text-xs font-semibold tracking-[0.12em] text-slate-500">
        <span>关键词</span>
        <span>分数</span>
        <span>阶段</span>
        <span>来源</span>
        <span>地区</span>
        <span>洞察</span>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {sortedTrends.map((trend) => (
          <div
            key={trend.id}
            className="grid grid-cols-[1.2fr_0.5fr_0.6fr_0.7fr_0.7fr_1.5fr] gap-4 px-6 py-5 text-sm text-slate-700"
          >
            <div className="font-semibold text-slate-900">{trend.keyword}</div>
            <div className="font-semibold text-slate-900">{formatScore(getPrimaryScore(trend))}</div>
            <div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  STAGE_STYLES[trend.stage] || STAGE_STYLES.normal
                }`}
              >
                {STAGE_LABELS[trend.stage] || 'Normal'}
              </span>
            </div>
            <div className="text-slate-600">
              {SOURCE_LABELS[trend.source] || trend.source || '-'}
            </div>
            <div className="text-slate-600">
              {REGION_LABELS[trend.region] || trend.region || '-'}
            </div>
            <div className="leading-6 text-slate-600">{translateInsight(trend.stage)}</div>
          </div>
        ))}
      </div>
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
    <>
      <div className="space-y-4 lg:hidden">
        {trends.map((trend) => (
          <article
            key={trend.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{trend.keyword}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      STAGE_STYLES[trend.stage] || STAGE_STYLES.normal
                    }`}
                  >
                    {STAGE_LABELS[trend.stage] || 'Normal'}
                  </span>
                  {renderType(trend.type)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Score
                </div>
                <div className="text-2xl font-semibold text-slate-950">
                  {formatScore(getPrimaryScore(trend))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">24h Mentions</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.current24hCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Prev 24h</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.previous24hCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Total</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.totalCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Growth</div>
                <div className="mt-1 font-semibold text-slate-900">{formatPercent(trend.growth_rate ?? trend.growthRate)}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Acceleration</div>
                <div className="mt-1 font-semibold text-slate-900">{formatAcceleration(trend.acceleration)}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Signals</div>
                <div className="mt-1 font-semibold text-slate-900">
                  Roblox {formatBoolean(trend.robloxExists)} / Discover {formatBoolean(trend.discoverMatch)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 lg:block">
        <div className="grid grid-cols-[1.45fr_0.8fr_0.8fr_0.7fr_0.8fr_0.9fr_0.85fr_0.9fr_0.9fr_0.75fr_0.85fr] gap-4 bg-slate-50 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          <span>Keyword</span>
          <span>Stage</span>
          <span>Type</span>
          <span>Score</span>
          <span>24h Mentions</span>
          <span>Prev 24h</span>
          <span>Total</span>
          <span>Growth</span>
          <span>Acceleration</span>
          <span>Roblox</span>
          <span>Discover</span>
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="grid grid-cols-[1.45fr_0.8fr_0.8fr_0.7fr_0.8fr_0.9fr_0.85fr_0.9fr_0.9fr_0.75fr_0.85fr] gap-4 px-6 py-5 text-sm text-slate-700"
            >
              <div>
                <div className="font-semibold text-slate-950">{trend.keyword}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {SOURCE_LABELS[trend.source] || trend.source || '-'} · {REGION_LABELS[trend.region] || trend.region || '-'}
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    STAGE_STYLES[trend.stage] || STAGE_STYLES.normal
                  }`}
                >
                  {STAGE_LABELS[trend.stage] || 'Normal'}
                </span>
              </div>
              <div>{renderType(trend.type)}</div>
              <div className="font-semibold text-slate-950">{formatScore(getPrimaryScore(trend))}</div>
              <div className="font-semibold text-slate-900">{trend.current24hCount ?? 0}</div>
              <div className="text-slate-700">{trend.previous24hCount ?? 0}</div>
              <div className="text-slate-700">{trend.totalCount ?? 0}</div>
              <div className="font-semibold text-emerald-700">{formatPercent(trend.growth_rate ?? trend.growthRate)}</div>
              <div className="font-semibold text-slate-900">{formatAcceleration(trend.acceleration)}</div>
              <div className={trend.robloxExists ? 'font-semibold text-emerald-700' : 'text-slate-400'}>
                {formatBoolean(trend.robloxExists)}
              </div>
              <div className={trend.discoverMatch ? 'font-semibold text-emerald-700' : 'text-slate-400'}>
                {formatBoolean(trend.discoverMatch)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function TrendList({
  trends,
  emptyMessage = '暂无趋势数据，请先运行分析或日常任务。',
  detailed = false,
}) {
  if (detailed) {
    return <DetailedTrendList trends={trends} emptyMessage={emptyMessage} />;
  }

  return <CompactTrendList trends={trends} emptyMessage={emptyMessage} />;
}
