'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTrendTimeline, getTrends } from '../lib/api';
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

const TIMELINE_OPTIONS = [7, 30];

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

function TimelineChart({ points }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const chart = useMemo(() => {
    const width = 720;
    const height = 260;
    const padding = { top: 24, right: 24, bottom: 40, left: 36 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxCount = Math.max(...points.map((point) => point.count), 1);
    const denominator = Math.max(points.length - 1, 1);

    const normalizedPoints = points.map((point, index) => {
      const x = padding.left + (innerWidth * index) / denominator;
      const y = padding.top + innerHeight - (point.count / maxCount) * innerHeight;
      return {
        ...point,
        x,
        y,
      };
    });

    const path = normalizedPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const yTicks = Array.from({ length: 4 }, (_, index) => {
      const value = Math.round((maxCount * (3 - index)) / 3);
      const y = padding.top + (innerHeight * index) / 3;
      return { value, y };
    });

    return {
      width,
      height,
      padding,
      normalizedPoints,
      path,
      yTicks,
    };
  }, [points]);

  const activePoint =
    activeIndex !== null && activeIndex >= 0 && activeIndex < chart.normalizedPoints.length
      ? chart.normalizedPoints[activeIndex]
      : chart.normalizedPoints[chart.normalizedPoints.length - 1];

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-950">最近提及变化</h4>
          <p className="mt-1 text-sm text-slate-500">Hover 查看每日提及次数</p>
        </div>
        {activePoint ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
            <div className="text-xs font-medium text-slate-500">{activePoint.date}</div>
            <div className="mt-1 text-xl font-semibold text-slate-950">
              {activePoint.count} 次提及
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-[260px] min-w-[680px] w-full"
          role="img"
          aria-label="趋势变化折线图"
        >
          {chart.yTicks.map((tick) => (
            <g key={`${tick.value}-${tick.y}`}>
              <line
                x1={chart.padding.left}
                y1={tick.y}
                x2={chart.width - chart.padding.right}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeDasharray="4 6"
              />
              <text x={8} y={tick.y + 4} fontSize="12" fill="#94a3b8">
                {tick.value}
              </text>
            </g>
          ))}

          <path d={chart.path} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />

          {chart.normalizedPoints.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r={activePoint?.date === point.date ? 6 : 4}
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <rect
                x={point.x - 16}
                y={chart.padding.top}
                width="32"
                height={chart.height - chart.padding.top - chart.padding.bottom}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              />
              <text
                x={point.x}
                y={chart.height - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
              >
                {point.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function formatSourceLabel(source) {
  const normalizedSource = String(source ?? '').trim().toLowerCase();
  if (normalizedSource === 'youtube') {
    return 'YouTube';
  }

  return source || 'YouTube';
}

function formatAiInsight(aiInsight, keyword) {
  const rawInsight = String(aiInsight ?? '').trim();
  if (!rawInsight) {
    return '该趋势当前暂无更多分析说明。';
  }

  if (/[\u4e00-\u9fff]/.test(rawInsight)) {
    return rawInsight;
  }

  let translated = rawInsight;
  const safeKeyword = keyword || '该关键词';

  translated = translated.replace(
    /Roblox search confirms it exists\./gi,
    'Roblox 搜索已确认该游戏存在。',
  );
  translated = translated.replace(
    /Roblox search has no strong match yet\./gi,
    'Roblox 搜索暂未确认该游戏。',
  );
  translated = translated.replace(
    /It is visible in Roblox Discover\./gi,
    '该关键词已命中 Roblox Discover。',
  );
  translated = translated.replace(
    /It is not matched in Roblox Discover\./gi,
    '该关键词暂未命中 Roblox Discover。',
  );
  translated = translated.replace(
    /is showing strong breakout momentum with (\d+)% growth concentration\./gi,
    '当前呈现明显爆发趋势，近 24 小时增长占比约 $1%。',
  );
  translated = translated.replace(
    /is emerging with (\d+)% growth concentration\./gi,
    '当前处于早期增长阶段，近 24 小时增长占比约 $1%。',
  );
  translated = translated.replace(
    /is currently a baseline signal with (\d+)% growth concentration\./gi,
    '当前仍属于基础观察信号，近 24 小时增长占比约 $1%。',
  );

  translated = translated.replace(new RegExp(`^${safeKeyword}\\s+`, 'i'), '');
  translated = translated.replace(/\s+/g, ' ').trim();

  return /[\u4e00-\u9fff]/.test(translated) ? translated : '该趋势当前暂无更多分析说明。';
}

function getTimelineJudgement(points) {
  if (!points.length) {
    return '该关键词目前波动较小，建议继续观察。';
  }

  const recentPoints = points.slice(-3);
  if (
    recentPoints.length === 3 &&
    recentPoints[0].count < recentPoints[1].count &&
    recentPoints[1].count < recentPoints[2].count
  ) {
    return '该关键词最近几天提及量持续上升，趋势明显升温。';
  }

  const latestPoint = points[points.length - 1];
  const previousPoints = points.slice(0, -1);
  const previousAverage =
    previousPoints.length > 0
      ? previousPoints.reduce((sum, point) => sum + point.count, 0) / previousPoints.length
      : 0;

  if (latestPoint && latestPoint.count > Math.max(previousAverage * 1.8, previousAverage + 3)) {
    return '该关键词近期出现明显抬升，存在进入爆发阶段的可能。';
  }

  return '该关键词目前波动较小，建议继续观察。';
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
      <div className="h-80 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
      <div className="h-48 animate-pulse rounded-[28px] border border-slate-200/80 bg-white" />
    </div>
  );
}

export default function TrendDetailPage() {
  const { keyword: keywordParam = '' } = useParams();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timelineDays, setTimelineDays] = useState(7);
  const [timelineData, setTimelineData] = useState({ keyword: '', days: 7, points: [] });
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState('');

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

  useEffect(() => {
    if (!trend?.keyword) {
      return;
    }

    let cancelled = false;

    async function loadTimeline() {
      setTimelineLoading(true);
      try {
        const data = await getTrendTimeline(trend.keyword, timelineDays);
        if (!cancelled) {
          setTimelineData({
            keyword: data.keyword ?? trend.keyword,
            days: data.days ?? timelineDays,
            points: Array.isArray(data.points) ? data.points : [],
          });
          setTimelineError('');
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setTimelineError('加载趋势变化失败');
        }
      } finally {
        if (!cancelled) {
          setTimelineLoading(false);
        }
      }
    }

    loadTimeline();

    return () => {
      cancelled = true;
    };
  }, [trend?.keyword, timelineDays]);

  const timelineJudgement = useMemo(
    () => getTimelineJudgement(timelineData.points),
    [timelineData.points],
  );

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
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        trend.keyword ?? '',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                      YouTube 视频
                    </a>
                    <a
                      href={`https://trends.google.com/trends/explore?date=today%2012-m&q=${encodeURIComponent(
                        trend.keyword ?? '',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                    >
                      Google Trends
                    </a>
                  </div>
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
                <MetricCard label="数据来源" value={formatSourceLabel(trend.source)} />
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">趋势变化</h3>
                  <p className="mt-1 text-sm text-slate-500">最近 {timelineDays} 天提及次数折线图</p>
                </div>
                <div className="inline-flex rounded-full bg-slate-100 p-1">
                  {TIMELINE_OPTIONS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setTimelineDays(days)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        timelineDays === days
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {days}天
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                {timelineLoading ? (
                  <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-200 bg-slate-50" />
                ) : timelineError ? (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {timelineError}
                  </div>
                ) : (
                  <TimelineChart points={timelineData.points} />
                )}
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
                <h4 className="text-lg font-semibold text-slate-950">趋势判断</h4>
                <p className="mt-3 text-base leading-7 text-slate-700">{timelineJudgement}</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-semibold text-slate-950">趋势分析</h3>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {formatAiInsight(trend.aiInsight, trend.keyword)}
              </p>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
