'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTrends } from '../lib/api';
import {
  formatAcceleration,
  formatDiscoverStatus,
  formatPercent,
  formatRobloxStatus,
  formatScore,
  getStageLabel,
  getTypeLabel,
  normalizeKeywordForMatch,
  STAGE_STYLES,
  TYPE_STYLES,
} from '../lib/trend-formatters';

function MetricCard({ label, value, valueClassName = 'text-slate-950' }) {
  return (
    <div className="rounded-3xl bg-slate-50 px-5 py-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className={`mt-3 text-2xl font-semibold tracking-tight ${valueClassName}`}>{value}</div>
    </div>
  );
}

function StatusCard({ label, value, tone }) {
  const toneClassName =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : tone === 'blue'
        ? 'border-sky-200 bg-sky-50 text-sky-700'
        : 'border-slate-200 bg-slate-50 text-slate-600';

  return (
    <div className={`rounded-3xl border px-5 py-5 ${toneClassName}`}>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-[28px] border border-slate-200/80 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
        <div className="h-32 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
      </div>
      <div className="h-48 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
    </div>
  );
}

export default function TrendDetailPage() {
  const { keyword: keywordParam = '' } = useParams();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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

  const decodedKeyword = useMemo(() => decodeURIComponent(keywordParam), [keywordParam]);
  const normalizedRouteKeyword = useMemo(
    () => normalizeKeywordForMatch(decodedKeyword),
    [decodedKeyword],
  );

  const trend = useMemo(() => {
    if (!trends.length) {
      return null;
    }

    const exactMatch = trends.find((item) => item.keyword === decodedKeyword);
    if (exactMatch) {
      return exactMatch;
    }

    const normalizedMatch = trends.find((item) => {
      const keyword = normalizeKeywordForMatch(item.keyword);
      const normalizedKeyword = normalizeKeywordForMatch(item.normalizedKeyword);
      return keyword === normalizedRouteKeyword || normalizedKeyword === normalizedRouteKeyword;
    });

    return normalizedMatch ?? null;
  }, [decodedKeyword, normalizedRouteKeyword, trends]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              游戏趋势雷达
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              趋势详情
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">趋势信号分析</p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            返回趋势列表
          </Link>
        </header>

        {loading ? <DetailSkeleton /> : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        ) : null}

        {!loading && !error && !trend ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <h2 className="text-2xl font-semibold text-slate-950">未找到该趋势</h2>
          </div>
        ) : null}

        {!loading && !error && trend ? (
          <>
            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                    {trend.keyword}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-base font-semibold text-slate-800">
                      评分 {formatScore(trend.prediction_score ?? trend.score)}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${
                        STAGE_STYLES[trend.stage] || STAGE_STYLES.normal
                      }`}
                    >
                      {getStageLabel(trend.stage)}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${
                        TYPE_STYLES[trend.type] || 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {getTypeLabel(trend.type)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-semibold text-slate-950">核心信号</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <MetricCard label="24小时提及" value={trend.current24hCount ?? 0} />
                <MetricCard label="前24小时提及" value={trend.previous24hCount ?? 0} />
                <MetricCard label="总提及次数" value={trend.totalCount ?? 0} />
                <MetricCard
                  label="增长率"
                  value={formatPercent(trend.growth_rate ?? trend.growthRate)}
                  valueClassName="text-emerald-700"
                />
                <MetricCard label="增长加速度" value={formatAcceleration(trend.acceleration)} />
                <MetricCard label="数据来源" value={trend.source || 'YouTube'} />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-semibold text-slate-950">Roblox 信号</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <StatusCard
                  label="Roblox游戏"
                  value={formatRobloxStatus(trend.robloxExists)}
                  tone={trend.robloxExists ? 'green' : 'gray'}
                />
                <StatusCard
                  label="Discover推荐"
                  value={formatDiscoverStatus(trend.discoverMatch)}
                  tone={trend.discoverMatch ? 'blue' : 'gray'}
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-semibold text-slate-950">趋势分析</h3>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {trend.aiInsight?.trim() || '该趋势当前暂无更多分析说明。'}
              </p>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
