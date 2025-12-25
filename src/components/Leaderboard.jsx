import React from 'react';

export default function Leaderboard({ players, round, onNextRound }) {
    const showScores = round >= 10;

    // Sort: 
    // If scores hidden: Highest Phase first (Descending), then Name
    // If scores shown: Lowest Score first (Ascending)
    const sortedPlayers = [...players].sort((a, b) => {
        if (!showScores) {
            if (b.phase !== a.phase) return b.phase - a.phase;
            return a.name.localeCompare(b.name);
        }
        return a.score - b.score;
    });

    return (
        <div className="glass-panel animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                Leaderboard {showScores ? '(Final)' : '(Hidden)'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {sortedPlayers.map((player, index) => (
                    <div key={player.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                        border: index === 0 ? '1px solid var(--accent-color)' : 'none',
                        borderRadius: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                fontWeight: 700,
                                color: index === 0 ? 'var(--accent-color)' : 'var(--text-secondary)',
                                width: '20px'
                            }}>
                                #{index + 1}
                            </span>
                            <div>
                                <div style={{ fontWeight: 600 }}>{player.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Phase {player.phase}
                                </div>
                            </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                            {showScores ? player.score : '???'}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onNextRound} className="btn-primary">
                Next Round
            </button>
        </div>
    );
}
