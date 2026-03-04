const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

if (!API_BASE) {
  throw new Error("VITE_API_URL is not defined");
}

export async function getGames() {
  const res = await fetch(`${API_BASE}/games`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  return res.json();
}
