'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TrendList from '../components/TrendList';
import { DISCOVERY_CONFIG } from '../config/discovery.config';
import { getTrends } from '../lib/api';

const PAGE_SIZE = DISCOVERY_CONFIG.filtering.trendsPageSize;

const TYPE_FILTER_OPTIONS = [
  'all',
  'tycoon',
  'simulator',
  'survival',
  'defense',
  'battlegrounds',
  'rng',
];

const SORT_OPTIONS = {
  score: {
    label: '分数',
    getValue: (trend) =>
      typeof trend.prediction_score === 'number' ? trend.prediction_score : trend.score ?? 0,
  },
  growth_rate: {
    label: '增长率',
    getValue: (trend) =>
      typeof trend.growth_rate === 'number' ? trend.growth_rate : trend.growthRate ?? 0,
  },
  acceleration: {
    label: '加速度',
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

      if (import.meta.env.DEV) {
        console.log('all trends:', trendsData);
      }

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
              Game Trend Radar
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              趋势详情
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              查看真实趋势指标，并按阶段、类型、存在性和关键词进行筛选。
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
                placeholder="例如：simulator"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              阶段筛选
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">全部</option>
                <option value="exploding">爆发</option>
                <option value="early">早期</option>
                <option value="normal">普通</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              类型筛选
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {TYPE_FILTER_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? '全部' : type}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Roblox 存在性
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
              Discover 命中
              <select
                value={discoverFilter}
                onChange={(event) => setDiscoverFilter(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">全部</option>
                <option value="only_discover">仅命中 Discover</option>
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
              <h2 className="text-2xl font-semibold text-slate-950">全部趋势</h2>
              <p className="mt-2 text-sm text-slate-600">
                共 {sortedTrends.length} 条记录，每页展示 {PAGE_SIZE} 条
              </p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-500">
              第 {currentPage} / {totalPages} 页
            </div>
          </div>

          <TrendList
            detailed
            trends={paginatedTrends}
            emptyMessage="暂无符合筛选条件的趋势数据。"
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
