import { useEffect, useState } from 'react';
import {
  analyzeNewWords,
  getAllTrends,
  getNewWords,
  runDailyJob,
} from './api/client';
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
  const [newWords, setNewWords] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [newWordsData, trendsData] = await Promise.all([
        getNewWords(),
        getAllTrends(),
      ]);

      console.log('newWordsData:', newWordsData);
      console.log('trendsData:', trendsData);
      console.log('trends:', trendsData);

      setNewWords(Array.isArray(newWordsData) ? newWordsData : []);
      setTrends(Array.isArray(trendsData) ? trendsData : []);
      setError('');
    } catch (loadError) {
      console.error(loadError);
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
    } catch (actionError) {
      setError(actionError.message || 'Failed to run analysis.');
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
    } catch (actionError) {
      setError(actionError.message || 'Failed to run daily job.');
    } finally {
      setActionLoading('');
    }
  }

  const explodingCount = trends.filter((trend) => trend.stage === 'exploding').length;
  const earlyCount = trends.filter((trend) => trend.stage === 'early').length;
  const totalTrends = trends.length;
  const totalNewWords = newWords.length;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              Game Trend Radar
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Trend dashboard connected to live backend data
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              The dashboard loads trend and new-word records from the Railway API and lets you
              trigger analysis or the daily job without leaving the page.
            </p>
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
            <button
              type="button"
              onClick={loadData}
              disabled={loading || actionLoading !== ''}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Exploding Trends" value={explodingCount} accent="text-red-600" />
          <StatCard label="Early Trends" value={earlyCount} accent="text-orange-500" />
          <StatCard label="Total Trends" value={totalTrends} accent="text-sky-700" />
          <StatCard label="New Words" value={totalNewWords} accent="text-emerald-600" />
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

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Trend Leaderboard</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Sorted by score descending, with stage, source, region, and AI insight.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {loading ? 'Loading...' : `${trends.length} records`}
              </div>
            </div>

            <div className="mt-6">
              {trends.length === 0 && !loading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center text-sm text-slate-500">
                  No trends yet. Run analysis or daily job.
                </div>
              ) : (
                <TrendList trends={trends} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Latest New Words</h2>
              <p className="mt-2 text-sm text-slate-600">
                Newly analyzed keywords fetched from the backend.
              </p>

              <div className="mt-5 space-y-3">
                {newWords.slice(0, 6).map((word) => (
                  <div
                    key={word.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="font-semibold text-slate-900">{word.keyword || word.token}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Score {typeof word.score === 'number' ? word.score.toFixed(1) : '0.0'} ·{' '}
                      {(word.source || word.platforms || 'unknown').toString()}
                    </div>
                  </div>
                ))}

                {!newWords.length && !loading ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                    No new words found yet.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <h2 className="text-xl font-semibold">Dashboard Status</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Exploding trends: {explodingCount} items</p>
                <p>Early trends: {earlyCount} items</p>
                <p>All trends endpoint: {trends.length} items</p>
                <p>New words endpoint: {newWords.length} items</p>
                <p>Action state: {actionLoading || 'idle'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
