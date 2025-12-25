import React, { useState } from 'react';
import PlayerSetup from './components/PlayerSetup';
import Scoring from './components/Scoring';
import Leaderboard from './components/Leaderboard';

function App() {
  const [gameState, setGameState] = useState('setup'); // setup, scoring, leaderboard
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);

  const handleStartGame = (initialPlayers) => {
    setPlayers(initialPlayers);
    setGameState('scoring');
  };

  const handleRoundSubmit = (roundUpdates) => {
    setPlayers(players.map(player => {
      const update = roundUpdates[player.id];
      return {
        ...player,
        score: player.score + update.score,
        phase: Math.min(player.phase + 1, 10) // Always increment phase, max 10
      };
    }));
    setGameState('leaderboard');
  };

  const handleNextRound = () => {
    if (round >= 10) {
      alert("Game Over! Check the final scores.");
      return;
    }
    setRound(r => r + 1);
    setGameState('scoring');
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      {gameState === 'setup' && (
        <PlayerSetup onStartGame={handleStartGame} />
      )}

      {gameState === 'scoring' && (
        <Scoring
          players={players}
          round={round}
          onSubmitRound={handleRoundSubmit}
        />
      )}

      {gameState === 'leaderboard' && (
        <Leaderboard
          players={players}
          round={round}
          onNextRound={handleNextRound}
        />
      )}
    </div>
  );
}

export default App;
