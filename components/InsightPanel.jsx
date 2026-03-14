export default function InsightPanel({ exploding, early }) {
  let summary =
    '本页面基于 YouTube 视频标题趋势、Roblox 搜索结果以及 Discover 推荐信号，自动识别正在增长的 Roblox 游戏趋势。';

  if (exploding > 0) {
    summary = `当前检测到 ${exploding} 个爆发趋势，建议优先关注近期提及快速上升且趋势评分较高的关键词。`;
  } else if (early > 0) {
    summary = `当前有 ${early} 个早期趋势，建议持续观察后续提及变化与 Roblox 信号确认情况。`;
  }

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          游戏趋势雷达
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">趋势信号说明</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="text-sm font-semibold text-red-700">爆发趋势</div>
          <p className="mt-2 text-sm leading-6 text-red-900">近期提及量快速上升。</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
          <div className="text-sm font-semibold text-orange-700">早期趋势</div>
          <p className="mt-2 text-sm leading-6 text-orange-900">
            出现增长信号但尚未爆发。
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="text-sm font-semibold text-slate-700">普通趋势</div>
          <p className="mt-2 text-sm leading-6 text-slate-900">基础观察信号。</p>
        </div>
      </div>
    </section>
  );
}
