import { useEffect, useState } from "react";
import { getGames, getExplodingTrends } from "../lib/api";

export default function App() {
  const [games, setGames] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    getGames().then(setGames).catch(console.error);
    getExplodingTrends().then(setTrends).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Games</h1>
      <ul className="mb-4">
        {games.map(game => (
          <li key={game.id}>{game.name} - {game.platform}</li>
        ))}
      </ul>

      <h1 className="text-xl font-bold mb-2">Exploding Trends</h1>
      <ul>
        {trends.map((t, i) => (
          <li key={i}>{t.keyword} - {t.score}</li>
        ))}
      </ul>
    </div>
  );
}
