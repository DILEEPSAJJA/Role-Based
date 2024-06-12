import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresCollection = collection(db, 'results');
      const scoresSnapshot = await getDocs(scoresCollection);
      const scoresList = scoresSnapshot.docs.map(doc => doc.data());
      scoresList.sort((a, b) => b.score - a.score); // Sort by score descending
      setScores(scoresList);
    };

    fetchScores();
  }, []);

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      <ul className="list-group">
        {scores.map((score, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {score.studentName} ({index + 1})
            <span className="badge bg-primary rounded-pill">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
