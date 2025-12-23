import React, { useState } from 'react';

export default function PlayerSetup({ onStartGame }) {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');

  const addPlayer = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setPlayers([...players, { id: Date.now(), name: name.trim(), score: 0, phase: 1 }]);
      setName('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Phase 10 Scorer</h1>
      
      <form onSubmit={addPlayer} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          className="input-field"
        />
        <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
          Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {players.map(player => (
          <div key={player.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }}>
            <span style={{ fontWeight: 500 }}>{player.name}</span>
            <button 
              onClick={() => removePlayer(player.id)}
              style={{ color: 'var(--danger-color)', background: 'none', padding: '4px' }}
            >
              ✕
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No players added yet.</p>
        )}
      </div>

      {players.length >= 2 && (
        <button onClick={() => onStartGame(players)} className="btn-primary">
          Start Game
        </button>
      )}
    </div>
  );
}
