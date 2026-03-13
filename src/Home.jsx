'use client';

import { useEffect, useState } from 'react';
import { API_BASE, analyzeNewWords, getNewWords, getTrends, runDailyJob } from './lib/api';
import TrendList from './components/TrendList';

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className={`mt-4 text-4xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

export default function Home() {
  const [trends, setTrends] = useState([]);
  const [newWords, setNewWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const trendsData = await getTrends();
      const newWordsData = await getNewWords();

      console.log('trends:', trendsData);
      console.log('newWords:', newWordsData);

      setTrends(Array.isArray(trendsData) ? trendsData : []);
      setNewWords(Array.isArray(newWordsData) ? newWordsData : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
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
      setError('Failed to load dashboard data');
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
      setError('Failed to load dashboard data');
    } finally {
      setActionLoading('');
    }
  }

  const exploding = trends.filter((trend) => trend.stage === 'exploding').length;
  const early = trends.filter((trend) => trend.stage === 'early').length;
  const total = trends.length;
  const newWordCount = newWords.length;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              Game Trend Radar
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || actionLoading !== ''}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === 'analyze' ? 'Running Analysis...' : 'Run Analysis'}
            </button>
            <button
              type="button"
              onClick={handleDailyJob}
              disabled={loading || actionLoading !== ''}
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoading === 'daily-job' ? 'Running Daily Job...' : 'Run Daily Job'}
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-slate-800">
          <div className="font-semibold">Debug Panel</div>
          <div className="mt-2">API_BASE: {API_BASE}</div>
          <div>trends.length: {trends.length}</div>
          <div>newWords.length: {newWords.length}</div>
          <div>trends[0]?.keyword: {trends[0]?.keyword || '-'}</div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="爆发趋势" value={exploding} accent="text-red-600" />
          <StatCard label="早期趋势" value={early} accent="text-orange-500" />
          <StatCard label="全部趋势" value={total} accent="text-sky-700" />
          <StatCard label="新词" value={newWordCount} accent="text-emerald-600" />
        </div>

        {loading ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
            Loading dashboard...
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">趋势排行榜</h2>
              <p className="mt-2 text-sm text-slate-600">
                keyword / stage / score / source / region / aiInsight
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {`${trends.length} records`}
            </div>
          </div>

          <TrendList trends={trends} />
        </div>
      </div>
    </div>
  );
}
