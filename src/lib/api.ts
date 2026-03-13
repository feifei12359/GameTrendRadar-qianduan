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
