'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TrendList from '../components/TrendList';
import { DISCOVERY_CONFIG } from '../config/discovery.config';
import { getTrends } from '../lib/api';

const PAGE_SIZE = DISCOVERY_CONFIG.filtering.trendsPageSize;

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'tycoon', label: '经营类 (Tycoon)' },
  { value: 'simulator', label: '模拟类 (Simulator)' },
  { value: 'survival', label: '生存类 (Survival)' },
  { value: 'defense', label: '防御类 (Defense)' },
  { value: 'battlegrounds', label: '战场对战 (Battlegrounds)' },
  { value: 'rng', label: '随机抽取 (RNG)' },
];

const STAGE_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'exploding', label: '爆发趋势' },
  { value: 'early', label: '早期趋势' },
  { value: 'normal', label: '普通趋势' },
];

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

export default function TrendsPage() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [robloxFilter, setRobloxFilter] = useState('all');
  const [discoverFilter, setDiscoverFilter] = useState('all');
  const [sortKey, setSortKey] = useState('score');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, typeFilter, robloxFilter, discoverFilter, sortKey]);

  async function loadData() {
    setLoading(true);

    try {
      const trendsData = await getTrends();
      setTrends(Array.isArray(trendsData) ? trendsData : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('加载趋势详情失败');
    } finally {
      setLoading(false);
    }
  }

  const filteredTrends = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return trends.filter((trend) => {
      const keyword = String(trend.keyword ?? '').toLowerCase();

      if (normalizedSearch && !keyword.includes(normalizedSearch)) {
        return false;
      }

      if (stageFilter !== 'all' && trend.stage !== stageFilter) {
        return false;
      }

      if (typeFilter !== 'all' && trend.type !== typeFilter) {
        return false;
      }

      if (robloxFilter === 'only_existing' && !trend.robloxExists) {
        return false;
      }

      if (discoverFilter === 'only_discover' && !trend.discoverMatch) {
        return false;
      }

      return true;
    });
  }, [trends, search, stageFilter, typeFilter, robloxFilter, discoverFilter]);

  const sortedTrends = useMemo(() => {
    const sorter = SORT_OPTIONS[sortKey] || SORT_OPTIONS.score;

    return [...filteredTrends].sort((a, b) => {
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
  }, [filteredTrends, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedTrends.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTrends = sortedTrends.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function goPrev() {
    setPage((value) => Math.max(1, value - 1));
  }

  function goNext() {
    setPage((value) => Math.min(totalPages, value + 1));
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              游戏趋势雷达
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              今日趋势
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              查看真实趋势指标，并按关键词、趋势阶段、游戏类型与 Roblox 信号进行筛选。
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            返回首页
          </Link>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            正在加载趋势详情...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        ) : null}

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="grid gap-4 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              搜索关键词
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="输入关键词，例如：ninja simulator"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              趋势阶段
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {STAGE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              游戏类型
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {TYPE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Roblox游戏
              <select
                value={robloxFilter}
                onChange={(event) => setRobloxFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">全部</option>
                <option value="only_existing">仅已存在</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Discover推荐
              <select
                value={discoverFilter}
                onChange={(event) => setDiscoverFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">全部</option>
                <option value="only_discover">仅已命中</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              排序方式
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
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">今日趋势</h2>
              <p className="mt-2 text-sm text-slate-600">共 {sortedTrends.length} 个趋势</p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-500">
              第 {currentPage} / {totalPages} 页
            </div>
          </div>

          <TrendList
            detailed
            trends={paginatedTrends}
            emptyMessage="当前没有符合条件的趋势"
          />

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              上一页
            </button>

            <div className="text-sm text-slate-600">
              当前第 {currentPage} 页，共 {totalPages} 页
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              下一页
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
