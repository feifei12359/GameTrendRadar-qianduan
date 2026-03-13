export default function InsightPanel({ exploding, early }) {
  let summary = '当前暂无足够趋势数据，请先运行分析。';

  if (exploding > 0) {
    summary = `当前检测到 ${exploding} 个爆发趋势，建议优先关注高分关键词。`;
  } else if (early > 0) {
    summary = `当前有 ${early} 个早期趋势，可继续观察增长情况。`;
  }

  return (
    <aside className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-950">AI 趋势洞察</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          基于当前趋势阶段分布生成的简要建议
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950 p-5 text-slate-100">
        <p className="text-sm leading-7">{summary}</p>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          爆发趋势越多，越适合优先筛选高分关键词做重点跟踪。
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          早期趋势可作为观察池，结合后续数据判断是否进入爆发阶段。
        </div>
      </div>
    </aside>
  );
}
