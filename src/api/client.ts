const API_BASE = 'https://gametrenradar-backend-production.up.railway.app/api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed: ${res.status}`);
  }

  return json?.data;
}

export async function getNewWords() {
  return request('/new-words');
}

export async function getAllTrends() {
  return request('/trend/all');
}

export async function getExplodingTrends() {
  return request('/trend/exploding');
}

export async function getEarlyTrends() {
  return request('/trend/early');
}

export async function analyzeNewWords() {
  return request('/new-words/analyze', { method: 'POST' });
}

export async function runDailyJob() {
  return request('/daily-job', { method: 'POST' });
}
