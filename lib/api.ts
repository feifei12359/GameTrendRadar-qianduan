const API_BASE = "https://gametrendradar-backend-production.up.railway.app";

export async function getExplodingTrends() {
  const res = await fetch(`${API_BASE}/trend/exploding`);
  if (!res.ok) throw new Error('Failed to fetch exploding trends');
  return res.json();
}

export async function getEarlyTrends() {
  const res = await fetch(`${API_BASE}/trend/early`);
  if (!res.ok) throw new Error('Failed to fetch early trends');
  return res.json();
}

export async function getAllTrends() {
  const res = await fetch(`${API_BASE}/trend/all`);
  if (!res.ok) throw new Error('Failed to fetch all trends');
  return res.json();
}

export async function getNewWords() {
  const res = await fetch(`${API_BASE}/new-words`);
  if (!res.ok) throw new Error('Failed to fetch new words');
  return res.json();
}

export async function runDailyJob() {
  const res = await fetch(`${API_BASE}/daily-job`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run daily job');
  return res.json();
}
