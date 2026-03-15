export const STAGE_STYLES = {
  exploding: 'border-red-200 bg-red-50 text-red-700',
  early: 'border-orange-200 bg-orange-50 text-orange-700',
  normal: 'border-slate-200 bg-slate-100 text-slate-600',
};

export const STAGE_LABELS = {
  exploding: '爆发趋势',
  early: '早期趋势',
  normal: '普通趋势',
};

export const STAGE_SHORT_LABELS = {
  exploding: '爆发',
  early: '早期',
  normal: '普通',
};

export const TYPE_STYLES = {
  tycoon: 'border-sky-200 bg-sky-50 text-sky-700',
  simulator: 'border-violet-200 bg-violet-50 text-violet-700',
  survival: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  defense: 'border-orange-200 bg-orange-50 text-orange-700',
  battlegrounds: 'border-red-200 bg-red-50 text-red-700',
  rng: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  obby: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
};

export const TYPE_LABELS = {
  tycoon: '经营类 (Tycoon)',
  simulator: '模拟类 (Simulator)',
  survival: '生存类 (Survival)',
  defense: '防御类 (Defense)',
  battlegrounds: '战场对战 (Battlegrounds)',
  rng: '随机抽取 (RNG)',
  obby: '跑酷类 (Obby)',
};

export function formatScore(score) {
  return Math.round(typeof score === 'number' ? score : 0);
}

export function formatPercent(value) {
  return `${Math.round((typeof value === 'number' ? value : 0) * 100)}%`;
}

export function formatAcceleration(value) {
  const numericValue = typeof value === 'number' ? value : 0;
  return numericValue.toFixed(1);
}

export function formatRobloxStatus(value) {
  return value ? '已存在' : '未找到';
}

export function formatDiscoverStatus(value) {
  return value ? '已推荐' : '未命中';
}

export function formatOpportunityScore(value) {
  return Math.round(typeof value === 'number' ? value : 0);
}

export function formatExplosionProbability(value) {
  return Math.round(typeof value === 'number' ? value : 0);
}

export function getScoreBadgeClass(score) {
  if (score >= 80) {
    return 'bg-red-50 text-red-700 border border-red-200';
  }

  if (score >= 60) {
    return 'bg-orange-50 text-orange-700 border border-orange-200';
  }

  if (score >= 40) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  return 'bg-slate-100 text-slate-600 border border-slate-200';
}

export function getExplosionProbabilityHint(score) {
  if (score >= 80) {
    return '高概率爆发';
  }

  if (score >= 60) {
    return '较高爆发概率';
  }

  if (score >= 40) {
    return '中等爆发概率';
  }

  return '低爆发概率';
}

export function getPrimaryScore(trend) {
  return typeof trend.prediction_score === 'number' ? trend.prediction_score : trend.score ?? 0;
}

export function getOpportunityScore(trend) {
  return typeof trend.opportunityScore === 'number' ? trend.opportunityScore : 0;
}

export function getExplosionProbability(trend) {
  return typeof trend.explosionProbability === 'number' ? trend.explosionProbability : 0;
}

export function getStageLabel(stage, short = false) {
  if (short) {
    return STAGE_SHORT_LABELS[stage] || STAGE_SHORT_LABELS.normal;
  }

  return STAGE_LABELS[stage] || STAGE_LABELS.normal;
}

export function getTypeLabel(type) {
  if (!type) {
    return '-';
  }

  return TYPE_LABELS[type] || type;
}

export function normalizeKeywordForMatch(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}
