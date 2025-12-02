import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/GamePlay.css";
import { FaTimes } from "react-icons/fa";
import MiniMap from "../components/MiniMap"; // Import the MiniMap component
import StreetView from "./StreetView";
import getRandomDataSet from './ask.js'

const GamePlay = () => {

  const [buttonPressedData, setButtonPressedData] = useState(false);
  const buttonPressedRef = useRef(false); // ⬅️ Use ref to track button state
  const { gameID } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const buttonPressedLockInRef = useRef(false);

  const [countdown, setCountdown] = useState(3);
  const [roundTimer, setRoundTimer] = useState(null);

  const [scorePanel, setScorePanel] = useState(null);
  const [scores, setScores] = useState([]);
  const [nextRoundCountdown, setNextRoundCountdown] = useState(5);

  const [lockInAvailable, setLockInAvailable] = useState(false);
  const [prevRoundScore, setPrevRoundScore] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);

  const [playerGuess, setPlayerGuess] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);  // newly added 
  const GOOGLE_API_KEY = "AIzaSyCWANOa4d1si6Br0idDtgUN4b72rLrlikc";
  const [dataSet, setDataSet] = useState(null)
  const [i, setI] = useState(0)

  useEffect(() => {
    const fetchGameSession = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gamesessions/${gameID}`);
        setCurrentRound(response.data.currentRound || 1);
        setGameData(response.data);
        
        setDataSet(await getRandomDataSet(response.data.totalRounds))
        setI(0)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load game session");
      } finally {
        setLoading(false);
      }
    };

    fetchGameSession();
  }, [gameID]);

  // 3...2...1...GO! Countdown
  useEffect(() => {
    buttonPressedLockInRef.current = false
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameData?.timePerRound && gameData.timePerRound !== "No Time Limit") {
      setRoundTimer(gameData.timePerRound);
    }
  }, [countdown, gameData]);

  // Round Timer Countdown
  useEffect(() => {
    if (roundTimer && roundTimer >= 0) {

      let x = roundTimer
      const timer = setInterval(() => {
        if (buttonPressedLockInRef.current) {
          console.log(buttonPressedLockInRef.current);
          setRoundTimer((prevTime) => {
            if (prevTime === 1) {
              handleRoundEnd();
            }
            return 0;
          });
        } else {
          setRoundTimer((prevTime) => {
            console.log(prevTime);
            if (prevTime === 1) {
              handleRoundEnd();
            }
            return prevTime - 1;
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [roundTimer]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getScoreFromDistance(distanceKm, maxScore = 5000, decayRate = 0.0015) {
    if (distanceKm <= 0) return maxScore;
  
    const score = maxScore * Math.exp(-decayRate * distanceKm);
    return Math.round(score);
  }
  
  const handleRoundEnd = async () => {
    let distance = 9999;

    if (
      playerGuess &&
      typeof playerGuess.lat === "number" &&
      typeof playerGuess.lng === "number"
    ) {
      const calculated = getDistanceFromLatLonInKm(
        dataSet[i].lat,
        dataSet[i].lng,
        playerGuess.lat,
        playerGuess.lng
      );

      distance = isNaN(calculated) ? 9999 : calculated.toFixed(2);
    }

    const score = getScoreFromDistance(distance)
    const correctLocation = dataSet[i];

   console.log("DATA FOR THIS ROUND:", correctLocation);

    const newScore = {
      round: currentRound,
      score,
      distance,
      city: correctLocation.city,   // <-- ADD THIS
    state: correctLocation.state  // <-- ADD THIS
    };

    setScores((prevScores) => [...prevScores, newScore]);
    setScorePanel(newScore);
    setPrevRoundScore(score);

    if (currentRound === gameData.totalRounds) {
      const finalScores = [...scores, newScore].sort((a, b) => b.round - a.round);
      const totalScore = finalScores.reduce((total, round) => total + round.score, 0);

      setScorePanel({
        round: "Final",
        totalScore,
        allScores: finalScores
      });
    } else {
      let countdown = 5;
      setNextRoundCountdown(countdown);

      const countdownTimer = setInterval(() => {
        countdown--;

        setNextRoundCountdown(countdown);
        if (buttonPressedRef.current) {
          clearInterval(countdownTimer);
          proceedToNextRound();
        }
        if (countdown === 0) {
          clearInterval(countdownTimer);
          proceedToNextRound();
        }
      }, 1000);
    }
  };

  // ✅ Update both state and ref when button is pressed
  const handleClick = () => {
    buttonPressedRef.current = true; // ⬅️ Ensure ref is updated immediately
  };

  const proceedToNextRound = () => {
    let y = i
    y += 1
    setI(y)
    setScorePanel(null);
    setButtonPressedData(false);
    buttonPressedRef.current = false; // ⬅️ Reset ref
    setCountdown(3);
    setPlayerGuess(null);
    setLockInAvailable(false);
    setCurrentRound((prevRound) => prevRound + 1);
    setLockInAvailable(false);

  };

  const handleLockIn = () => {
    buttonPressedLockInRef.current = true
    setLockInAvailable(false);
    handleRoundEnd();
  };

  const handleGuessPlaced = (guess) => {
    setPlayerGuess(guess);
    setLockInAvailable(true);
  };

  const handlePlayAgain = async () => {
    try {
      console.log(scorePanel);

      const { mode, players, totalRounds, timePerRound } = gameData;

      const response = await axios.post("http://localhost:5000/api/gamesessions", {
        mode,
        players,
        totalRounds,
        timePerRound,
      });
      setScores([])
      setScorePanel(null);
      const newGameID = response.data.newGameSession.gameID;
      navigate(`/game/${newGameID}`);
    } catch (error) {
      console.error("Error starting new game session:", error);
      alert("Failed to start a new game session. Please try again.");
    }
  };

  const endGame = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/gamesessions/${gameID}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error ending game session:", error);
      alert("Failed to end game session. Please try again.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  const playerIGN = gameData?.player?.ign || gameData?.players?.[0]?.ign || "Guest";

  return (
    <div className="gameplay-container">
      <div className="ign-display">IGN: {playerIGN}</div>

      <div className="game-header">
        <div className="round-info">
          Round {currentRound} / {gameData.totalRounds}
        </div>
        {prevRoundScore !== null && (
          <div className="previous-round-score">
            Previous Round Score: {prevRoundScore}
          </div>
        )}
        {roundTimer !== null && (
          <div className={`timer ${roundTimer <= 5 ? 'warning' : ''}`}>
            {roundTimer}s
          </div>
        )}
      </div>

      {countdown > 0 && (
        <div className="countdown-overlay">
          <p>{countdown === 0 ? "GO!" : countdown}</p>
        </div>
      )}

      <div className="street-view-container">
        <StreetView
          latitude={dataSet[i] || 28.7041}
          longitude={dataSet[i] || 77.1025}
          apiKey={GOOGLE_API_KEY}
        />
      </div>
      <div className="minimap-container">
        <MiniMap onGuessPlaced={handleGuessPlaced} />
      </div>

      {lockInAvailable && (
        <button className="lock-in-button" onClick={handleLockIn}>
          Lock In
        </button>
      )}

      {scorePanel &&
        (
          <div className="score-panel active">
            {scorePanel.round === "Final" ? (
              <>
                <h3>Final Scores</h3>
                {scorePanel.allScores.map((scoreData) => (
                  <p key={scoreData.round}>Round {scoreData.round} Score: {scoreData.score}</p>
                ))}
                <p>Total Score: {scorePanel.totalScore}</p>
                <button onClick={endGame}>Exit</button>
                <button onClick={handlePlayAgain}>Play Again</button>
              </>
            ) : (
              <>
                <h3>Round {scorePanel.round} Results</h3>
                <p>Score: {scorePanel.score}</p>
                <p>Distance: {scorePanel.distance}</p>
                <p className="score-panel-location-label">Correct Location:</p>
                <p className="score-panel-location"><strong>{scorePanel.city}, {scorePanel.state}</strong></p>
                <p className="next-round-timer">Next Round in {nextRoundCountdown}s</p>
                <button onClick={handleClick} className="next-round-button">
                  Proceed to Next Round
                </button>
              </>
            )}

          </div>
        )}

      <button className="exit-button" onClick={endGame}>
        <FaTimes size={24} />
      </button>
    </div>
  );
};

export default GamePlay;
