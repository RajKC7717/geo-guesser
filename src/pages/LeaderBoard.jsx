import React from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  // Dummy data for leaderboard
  const players = [
    { rank: 1, name: 'ShadowX', matchesPlayed: 150, matchesWon: 120, score: 1200, bagt: '5s' },
    { rank: 2, name: 'PhoenixX', matchesPlayed: 140, matchesWon: 115, score: 1100, bagt: '6s' },
    { rank: 3, name: 'AceKiller', matchesPlayed: 130, matchesWon: 110, score: 1000, bagt: '7s' },
    { rank: 4, name: 'KingSlayer', matchesPlayed: 125, matchesWon: 100, score: 950, bagt: '8s' },
    { rank: 5, name: 'GhostRecon', matchesPlayed: 115, matchesWon: 95, score: 900, bagt: '9s' },
    { rank: 6, name: 'DarkKnight', matchesPlayed: 110, matchesWon: 85, score: 850, bagt: '10s' },
    { rank: 7, name: 'QuickSilver', matchesPlayed: 100, matchesWon: 80, score: 800, bagt: '11s' },
    { rank: 8, name: 'FireStorm', matchesPlayed: 90, matchesWon: 75, score: 750, bagt: '12s' },
    { rank: 9, name: 'NightFury', matchesPlayed: 80, matchesWon: 60, score: 650, bagt: '13s' },
    { rank: 10, name: 'RogueWarrior', matchesPlayed: 70, matchesWon: 55, score: 600, bagt: '14s' },
  ];

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <h1>Leaderboard</h1>
        <p>Top players in Where In India?</p>
      </header>

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="table-cell">Rank</div>
          <div className="table-cell">Player Name</div>
          <div className="table-cell">Matches Played</div>
          <div className="table-cell">Matches Won</div>
          <div className="table-cell">Score</div>
          <div className="table-cell">BAGT</div>
        </div>

        <div className="table-body">
          {players.map((player) => (
            <div className="table-row" key={player.rank}>
              <div className="table-cell">{player.rank}</div>
              <div className="table-cell">{player.name}</div>
              <div className="table-cell">{player.matchesPlayed}</div>
              <div className="table-cell">{player.matchesWon}</div>
              <div className="table-cell">{player.score}</div>
              <div className="table-cell">{player.bagt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
