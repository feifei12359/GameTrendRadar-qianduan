import { useEffect, useState } from 'react';
import {
  analyzeNewWords,
  getAllTrends,
  getEarlyTrends,
  getExplodingTrends,
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
  const [explodingTrends, setExplodingTrends] = useState([]);
  const [earlyTrends, setEarlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [words, allTrends, exploding, early] = await Promise.all([
        getNewWords(),
        getAllTrends(),
        getExplodingTrends(),
        getEarlyTrends(),
      ]);

      setNewWords(Array.isArray(words) ? words : []);
      setTrends(Array.isArray(allTrends) ? allTrends : []);
      setExplodingTrends(Array.isArray(exploding) ? exploding : []);
      setEarlyTrends(Array.isArray(early) ? early : []);
      setLastUpdated(new Date().toLocaleString());
    } catch (loadError) {
      setError(loadError.message || 'Failed to load dashboard data.');
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

  const explodingCount =
    explodingTrends.length || trends.filter((trend) => trend.stage === 'exploding').length;
  const earlyCount =
    earlyTrends.length || trends.filter((trend) => trend.stage === 'early').length;
  const totalCount = trends.length;
  const newWordsCount = newWords.length;

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
          <StatCard label="Total Trends" value={totalCount} accent="text-sky-700" />
          <StatCard label="New Words" value={newWordsCount} accent="text-emerald-600" />
        </div>

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
              <TrendList trends={trends} />
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
                <p>Exploding endpoint: {explodingTrends.length} items</p>
                <p>Early endpoint: {earlyTrends.length} items</p>
                <p>All trends endpoint: {trends.length} items</p>
                <p>New words endpoint: {newWords.length} items</p>
                <p>Last updated: {lastUpdated || 'Not loaded yet'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
