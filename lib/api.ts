const API = "https://gametrenradar-backend-production.up.railway.app";

export async function getHealth() {
  const res = await fetch(`${API}/api/health`);
  if (!res.ok) throw new Error("Failed to check health");
  return res.json();
}

export async function getGames() {
  const res = await fetch(`${API}/api/games`);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
}

export async function getExplodingTrends() {
  const res = await fetch(`${API}/api/trend/exploding`);
  if (!res.ok) throw new Error("Failed to fetch exploding trends");
  return res.json();
}

export async function getEarlyTrends() {
  const res = await fetch(`${API}/api/trend/early`);
  if (!res.ok) throw new Error("Failed to fetch early trends");
  return res.json();
}

export async function getAllTrends() {
  const res = await fetch(`${API}/api/trend/all`);
  if (!res.ok) throw new Error("Failed to fetch all trends");
  return res.json();
}

export async function runDailyJob() {
  const res = await fetch(`${API}/api/daily-job`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to run daily job");
  return res.json();
}
