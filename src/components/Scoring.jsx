import React, { useState } from 'react';

export default function Scoring({ players, round, onSubmitRound }) {
    // State to hold temporary scores for this round
    const [roundData, setRoundData] = useState(
        players.reduce((acc, player) => ({
            ...acc,
            [player.id]: { score: '', phaseCompleted: false }
        }), {})
    );

    const handleChange = (playerId, field, value) => {
        setRoundData(prev => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [field]: value
            }
        }));
    };

    const handleSubmit = () => {
        // Validate inputs
        const updates = {};
        for (const player of players) {
            const data = roundData[player.id];
            if (data.score === '') return alert(`Please enter a score for ${player.name}`);
            const score = parseInt(data.score);
            if (score % 5 !== 0) return alert(`Score for ${player.name} must be a multiple of 5`);

            updates[player.id] = {
                score: score
            };
        }
        onSubmitRound(updates);
    };

    return (
        <div className="glass-panel animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Round {round} / 10</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {players.map(player => (
                    <div key={player.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1rem',
                        borderRadius: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{player.name}</span>
                            <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>Phase {player.phase}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="number"
                                placeholder="Score (multiple of 5)"
                                value={roundData[player.id].score}
                                onChange={(e) => handleChange(player.id, 'score', e.target.value)}
                                className="input-field"
                                style={{ flex: 1 }}
                                step="5"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit} className="btn-primary">
                Finish Round
            </button>
        </div>
    );
}
