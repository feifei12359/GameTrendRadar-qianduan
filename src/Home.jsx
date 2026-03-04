import { useEffect, useState } from "react";
import { getGames } from "../lib/api";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGames()
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Game List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {games.map(game => (
            <div key={game.id} style={{ 
              background: '#1f2937', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{game.name}</h3>
              <p style={{ margin: 0, color: '#9ca3af' }}>ID: {game.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
