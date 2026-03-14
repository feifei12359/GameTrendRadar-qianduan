import { DISCOVERY_CONFIG } from '../config/discovery.config';

export const API_BASE = 'https://gametrenradar-backend-production.up.railway.app/api';

export async function getNewWords() {
  const res = await fetch(`${API_BASE}/new-words`, { cache: 'no-store' });
  const json = await res.json();
  return json.data ?? [];
}

export async function getTrends() {
  const res = await fetch(`${API_BASE}/trend/all`, { cache: 'no-store' });
  const json = await res.json();
  return json.data ?? [];
}

export async function getTopTrends(limit = DISCOVERY_CONFIG.filtering.dashboardTopLimit) {
  const res = await fetch(`${API_BASE}/trend/top?limit=${limit}`, { cache: 'no-store' });
  const json = await res.json();
  return json.data ?? [];
}

export async function getStatsSummary() {
  const res = await fetch(`${API_BASE}/stats/summary`, { cache: 'no-store' });
  const json = await res.json();
  return (
    json.data ?? {
      explodingCount: 0,
      earlyCount: 0,
      totalTrends: 0,
      totalNewWords: 0,
    }
  );
}

export async function analyzeNewWords() {
  const res = await fetch(`${API_BASE}/new-words/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function runDailyJob() {
  const res = await fetch(`${API_BASE}/daily-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
