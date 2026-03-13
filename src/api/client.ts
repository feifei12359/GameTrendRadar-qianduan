const API_BASE = 'https://gametrenradar-backend-production.up.railway.app/api';

export async function getNewWords() {
  const res = await fetch(`${API_BASE}/new-words`);
  const json = await res.json();
  return json.data;
}

export async function getAllTrends() {
  const res = await fetch(`${API_BASE}/trend/all`);
  const json = await res.json();
  return json.data;
}

export async function getExplodingTrends() {
  const res = await fetch(`${API_BASE}/trend/exploding`);
  const json = await res.json();
  return json.data;
}

export async function getEarlyTrends() {
  const res = await fetch(`${API_BASE}/trend/early`);
  const json = await res.json();
  return json.data;
}

export async function analyzeNewWords() {
  const res = await fetch(`${API_BASE}/new-words/analyze`, { method: 'POST' });
  const json = await res.json();
  return json.data;
}

export async function runDailyJob() {
  const res = await fetch(`${API_BASE}/daily-job`, { method: 'POST' });
  const json = await res.json();
  return json.data;
}
