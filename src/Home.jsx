'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeNewWords, getNewWords, getTrends, runDailyJob } from './lib/api';
import InsightPanel from './components/InsightPanel';
import StatsCards from './components/StatsCards';
import TrendList from './components/TrendList';

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

      if (import.meta.env.DEV) {
        console.log('trends:', trendsData);
        console.log('newWords:', newWordsData);
      }

      setTrends(Array.isArray(trendsData) ? trendsData : []);
      setNewWords(Array.isArray(newWordsData) ? newWordsData : []);
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

  const exploding = trends.filter((trend) => trend.stage === 'exploding').length;
  const early = trends.filter((trend) => trend.stage === 'early').length;
  const total = trends.length;
  const newWordCount = newWords.length;
  const topTrends = [...trends].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Game Trend Radar
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">趋势仪表盘</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              发现 Roblox 新游戏趋势与爆发信号
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
          exploding={exploding}
          early={early}
          total={total}
          newWordCount={newWordCount}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            正在加载趋势数据...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">趋势排行榜</h2>
                <p className="mt-2 text-sm text-slate-600">
                  首页展示当前分数最高的前 10 条趋势
                </p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-500">
                {`${topTrends.length} 条记录`}
              </div>
            </div>

            <TrendList trends={topTrends} />

            <div className="mt-6 flex justify-center">
              <Link
                to="/trends"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                查看更多趋势
              </Link>
            </div>
          </section>

          <InsightPanel exploding={exploding} early={early} />
        </div>
      </div>
    </div>
  );
}
