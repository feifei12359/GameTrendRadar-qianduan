'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TrendList from '../components/TrendList';
import { DISCOVERY_CONFIG } from '../config/discovery.config';
import { getTrends } from '../lib/api';

const PAGE_SIZE = DISCOVERY_CONFIG.filtering.trendsPageSize;

export default function TrendsPage() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

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

  const sortedTrends = useMemo(() => {
    return [...trends].sort((a, b) => b.score - a.score);
  }, [trends]);

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
              查看全部趋势数据，并按前端分页浏览
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">全部趋势</h2>
              <p className="mt-2 text-sm text-slate-600">
                共 {sortedTrends.length} 条记录，每页展示 {PAGE_SIZE} 条
              </p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-500">
              {`第 ${currentPage} / ${totalPages} 页`}
            </div>
          </div>

          <TrendList trends={paginatedTrends} emptyMessage="暂无趋势数据，请先运行分析或日常任务。" />

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              上一页
            </button>

            <div className="text-sm text-slate-600">{`当前第 ${currentPage} 页，共 ${totalPages} 页`}</div>

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
