import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const resultsCollection = collection(db, 'results');
      const resultsSnapshot = await getDocs(resultsCollection);
      const resultsList = resultsSnapshot.docs.map(doc => doc.data());
      setResults(resultsList.filter(result => result.quizId === quizId));
    };

    fetchResults();
  }, [quizId]);

  return (
    <div className="container">
      <h2>Quiz Results</h2>
      <ul className="list-group">
        {results.map((result, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {result.studentName}
            <span className="badge bg-primary rounded-pill">{result.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;
