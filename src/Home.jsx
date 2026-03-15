'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DISCOVERY_CONFIG } from './config/discovery.config';
import {
  analyzeNewWords,
  getStatsSummary,
  getTopTrends,
  getTrends,
  runDailyJob,
} from './lib/api';
import InsightPanel from './components/InsightPanel';
import StatsCards from './components/StatsCards';
import TrendList from './components/TrendList';

const SORT_OPTIONS = {
  score: {
    label: '趋势评分',
    getValue: (trend) =>
      typeof trend.prediction_score === 'number' ? trend.prediction_score : trend.score ?? 0,
  },
  growth_rate: {
    label: '增长率',
    getValue: (trend) =>
      typeof trend.growth_rate === 'number' ? trend.growth_rate : trend.growthRate ?? 0,
  },
  acceleration: {
    label: '增长加速度',
    getValue: (trend) => trend.acceleration ?? 0,
  },
  current24hCount: {
    label: '24小时提及',
    getValue: (trend) => trend.current24hCount ?? 0,
  },
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[168px] animate-pulse rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
          />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]" />
      <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]" />
      <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]" />
      <div className="h-[520px] animate-pulse rounded-[28px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]" />
    </div>
  );
}

export default function Home() {
  const [topTrends, setTopTrends] = useState([]);
  const [allTrends, setAllTrends] = useState([]);
  const [summary, setSummary] = useState({
    explodingCount: 0,
    earlyCount: 0,
    totalTrends: 0,
    totalNewWords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('score');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [summaryData, topTrendsData, allTrendsData] = await Promise.all([
        getStatsSummary(),
        getTopTrends(DISCOVERY_CONFIG.filtering.dashboardTopLimit),
        getTrends(),
      ]);

      setSummary({
        explodingCount: summaryData.explodingCount ?? 0,
        earlyCount: summaryData.earlyCount ?? 0,
        totalTrends: summaryData.totalTrends ?? 0,
        totalNewWords: summaryData.totalNewWords ?? 0,
      });
      setTopTrends(Array.isArray(topTrendsData) ? topTrendsData : []);
      setAllTrends(Array.isArray(allTrendsData) ? allTrendsData : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('加载仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    try {
      setActionLoading('analyze');
      setError('');
      await analyzeNewWords();
      await loadData();
    } catch (err) {
      console.error(err);
      setError('运行分析失败');
    } finally {
      setActionLoading('');
    }
  }

  async function handleDailyJob() {
    try {
      setActionLoading('daily-job');
      setError('');
      await runDailyJob();
      await loadData();
    } catch (err) {
      console.error(err);
      setError('运行日常任务失败');
    } finally {
      setActionLoading('');
    }
  }

  const sortedTopTrends = useMemo(() => {
    const sorter = SORT_OPTIONS[sortKey] || SORT_OPTIONS.score;

    return [...topTrends].sort((a, b) => {
      const diff = sorter.getValue(b) - sorter.getValue(a);
      if (diff !== 0) {
        return diff;
      }

      const fallbackScore =
        (typeof b.prediction_score === 'number' ? b.prediction_score : b.score ?? 0) -
        (typeof a.prediction_score === 'number' ? a.prediction_score : a.score ?? 0);

      if (fallbackScore !== 0) {
        return fallbackScore;
      }

      return String(a.keyword ?? '').localeCompare(String(b.keyword ?? ''));
    });
  }, [topTrends, sortKey]);

  const topOpportunityTrends = useMemo(() => {
    return [...allTrends]
      .sort((a, b) => {
        const opportunityDiff = (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0);
        if (opportunityDiff !== 0) {
          return opportunityDiff;
        }

        const scoreDiff =
          (typeof b.prediction_score === 'number' ? b.prediction_score : b.score ?? 0) -
          (typeof a.prediction_score === 'number' ? a.prediction_score : a.score ?? 0);

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return String(a.keyword ?? '').localeCompare(String(b.keyword ?? ''));
      })
      .slice(0, 5);
  }, [allTrends]);

  const topExplosionTrends = useMemo(() => {
    return [...allTrends]
      .sort((a, b) => {
        const explosionDiff = (b.explosionProbability ?? 0) - (a.explosionProbability ?? 0);
        if (explosionDiff !== 0) {
          return explosionDiff;
        }

        const scoreDiff =
          (typeof b.prediction_score === 'number' ? b.prediction_score : b.score ?? 0) -
          (typeof a.prediction_score === 'number' ? a.prediction_score : a.score ?? 0);

        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return String(a.keyword ?? '').localeCompare(String(b.keyword ?? ''));
      })
      .slice(0, 5);
  }, [allTrends]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              游戏趋势雷达
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              趋势雷达仪表盘
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              聚合 YouTube 视频标题趋势、Roblox 搜索结果与 Discover 推荐信号，帮助你快速识别正在增长的 Roblox 游戏趋势。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || actionLoading !== ''}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === 'analyze' ? '分析中...' : '运行分析'}
            </button>
            <button
              type="button"
              onClick={handleDailyJob}
              disabled={loading || actionLoading !== ''}
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === 'daily-job' ? '执行中...' : '运行日常任务'}
            </button>
          </div>
        </header>

        <StatsCards
          trendingNow={summary.explodingCount}
          exploding={summary.explodingCount}
          early={summary.earlyCount}
          total={summary.totalTrends}
        />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <InsightPanel exploding={summary.explodingCount} early={summary.earlyCount} />

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">
                  最值得关注
                </p>
                <h2 className="text-2xl font-semibold text-slate-950">最值得关注</h2>
                <p className="text-sm text-slate-600">
                  按机会评分排序，优先展示当前最值得投入关注的前 5 个趋势。
                </p>
              </div>

              <TrendList trends={topOpportunityTrends} emptyMessage="当前没有可关注的趋势" />
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
                  最可能爆发
                </p>
                <h2 className="text-2xl font-semibold text-slate-950">最可能爆发</h2>
                <p className="text-sm text-slate-600">
                  按爆发概率排序，优先展示短期内最可能进入爆发阶段的前 5 个趋势。
                </p>
              </div>

              <TrendList trends={topExplosionTrends} emptyMessage="当前没有高爆发概率趋势" />
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                    今日趋势
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">今日趋势</h2>
                  <p className="mt-2 text-sm text-slate-600">共 {sortedTopTrends.length} 个趋势</p>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-[220px]">
                  <label className="text-sm font-medium text-slate-700">排序方式</label>
                  <select
                    value={sortKey}
                    onChange={(event) => setSortKey(event.target.value)}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  >
                    {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                      <option key={key} value={key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <TrendList detailed trends={sortedTopTrends} emptyMessage="当前没有符合条件的趋势" />

              <div className="mt-6 flex justify-center">
                <Link
                  to="/trends"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  查看更多趋势
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
