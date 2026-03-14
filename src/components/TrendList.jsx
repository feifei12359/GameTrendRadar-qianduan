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
  obby: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  survival: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  defense: 'border-orange-200 bg-orange-50 text-orange-700',
  battlegrounds: 'border-red-200 bg-red-50 text-red-700',
  rng: 'border-cyan-200 bg-cyan-50 text-cyan-700',
};

const TYPE_LABELS = {
  tycoon: '经营类 (Tycoon)',
  simulator: '模拟类 (Simulator)',
  obby: '跑酷类 (Obby)',
  survival: '生存类 (Survival)',
  defense: '防御类 (Defense)',
  battlegrounds: '战场对战 (Battlegrounds)',
  rng: '随机抽取 (RNG)',
};

const SOURCE_LABELS = {
  youtube: 'YouTube',
  roblox: 'Roblox',
  google_trends: 'Google Trends',
};

const REGION_LABELS = {
  global: '全球',
  us: '美国',
};

function formatScore(score) {
  return (typeof score === 'number' ? score : 0).toFixed(1);
}

function formatPercent(value) {
  return `${Math.round((typeof value === 'number' ? value : 0) * 100)}%`;
}

function formatAcceleration(value) {
  return (typeof value === 'number' ? value : 0).toFixed(2);
}

function formatRobloxStatus(value) {
  return value ? '已存在' : '未找到';
}

function formatDiscoverStatus(value) {
  return value ? '已命中' : '未命中';
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
      {STAGE_LABELS[stage] || '普通'}
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
      <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-4 bg-slate-50 px-6 py-4 text-xs font-semibold tracking-[0.12em] text-slate-500">
        <span>关键词</span>
        <span>趋势评分</span>
        <span>趋势阶段</span>
        <span>数据来源</span>
        <span>地区</span>
        <span>趋势分析</span>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {sortedTrends.map((trend) => (
          <div
            key={trend.id}
            className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-4 px-6 py-5 text-sm text-slate-700"
          >
            <div className="font-semibold text-slate-900">{trend.keyword}</div>
            <div className="font-semibold text-slate-900">{formatScore(getPrimaryScore(trend))}</div>
            <div>{renderStage(trend.stage)}</div>
            <div className="text-slate-600">
              {SOURCE_LABELS[trend.source] || trend.source || '-'}
            </div>
            <div className="text-slate-600">
              {REGION_LABELS[trend.region] || trend.region || '-'}
            </div>
            <div className="leading-6 text-slate-600">{trend.aiInsight || '-'}</div>
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
                  {renderStage(trend.stage)}
                  {renderType(trend.type)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  趋势评分
                </div>
                <div className="text-2xl font-semibold text-slate-950">
                  {formatScore(getPrimaryScore(trend))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">24小时提及</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.current24hCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">前24小时提及</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.previous24hCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">总提及次数</div>
                <div className="mt-1 font-semibold text-slate-900">{trend.totalCount ?? 0}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">增长率</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatPercent(trend.growth_rate ?? trend.growthRate)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">增长加速度</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatAcceleration(trend.acceleration)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">游戏类型</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {TYPE_LABELS[trend.type] || trend.type || '-'}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Roblox游戏</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatRobloxStatus(trend.robloxExists)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Discover推荐</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatDiscoverStatus(trend.discoverMatch)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 lg:block">
        <div className="grid grid-cols-[1.4fr_0.9fr_0.95fr_0.85fr_0.85fr_0.95fr_0.95fr_1fr_1fr] gap-4 bg-slate-50 px-6 py-4 text-[11px] font-semibold tracking-[0.12em] text-slate-500">
          <span>关键词</span>
          <span>趋势评分</span>
          <span>趋势阶段</span>
          <span>游戏类型</span>
          <span>24小时提及</span>
          <span>增长率</span>
          <span>增长加速度</span>
          <span>Roblox游戏</span>
          <span>Discover推荐</span>
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="grid grid-cols-[1.4fr_0.9fr_0.95fr_0.85fr_0.85fr_0.95fr_0.95fr_1fr_1fr] gap-4 px-6 py-5 text-sm text-slate-700"
            >
              <div>
                <div className="font-semibold text-slate-950">{trend.keyword}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {SOURCE_LABELS[trend.source] || trend.source || '-'} · {REGION_LABELS[trend.region] || trend.region || '-'}
                </div>
              </div>
              <div className="font-semibold text-slate-950">{formatScore(getPrimaryScore(trend))}</div>
              <div>{renderStage(trend.stage)}</div>
              <div>{renderType(trend.type)}</div>
              <div className="font-semibold text-slate-900">{trend.current24hCount ?? 0}</div>
              <div className="font-semibold text-emerald-700">
                {formatPercent(trend.growth_rate ?? trend.growthRate)}
              </div>
              <div className="font-semibold text-slate-900">{formatAcceleration(trend.acceleration)}</div>
              <div className={trend.robloxExists ? 'font-semibold text-emerald-700' : 'text-slate-500'}>
                {formatRobloxStatus(trend.robloxExists)}
              </div>
              <div className={trend.discoverMatch ? 'font-semibold text-emerald-700' : 'text-slate-500'}>
                {formatDiscoverStatus(trend.discoverMatch)}
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
  emptyMessage = '当前没有符合条件的趋势',
  detailed = false,
}) {
  if (detailed) {
    return <DetailedTrendList trends={trends} emptyMessage={emptyMessage} />;
  }

  return <CompactTrendList trends={trends} emptyMessage={emptyMessage} />;
}
