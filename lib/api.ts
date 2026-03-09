// api.ts - 可直接替换你的前端文件

const API = " `https://gametrenradar-backend-production.up.railway.app` ";

async function fetchJSON(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
    }
    return res.json();
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

export async function getHealth() {
  return fetchJSON(`${API}/api/health`);
}

export async function getGames() {
  return fetchJSON(`${API}/api/games`);
}

export async function getExplodingTrends() {
  return fetchJSON(`${API}/api/trend/exploding`);
}

export async function getEarlyTrends() {
  return fetchJSON(`${API}/api/trend/early`);
}

export async function getAllTrends() {
  return fetchJSON(`${API}/api/trend/all`);
}

export async function getNewWords() {
  return fetchJSON(`${API}/api/new-words`);
}

export async function runDailyJob() {
  return fetchJSON(`${API}/api/daily-job`, { method: "POST" });
}
