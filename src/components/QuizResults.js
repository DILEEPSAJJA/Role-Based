import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsCollection = collection(db, 'results');
        const resultsSnapshot = await getDocs(resultsCollection);
        const resultsList = resultsSnapshot.docs.map(doc => doc.data());
        setResults(resultsList.filter(result => result.quizId === quizId));
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching results. Please try again.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer /> 
      <h2>Quiz Results</h2>
      {results.length > 0 ? (
        <ul className="list-group">
          {results.map((result, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {result.studentName}
              <span className="badge bg-primary rounded-pill">{result.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for this quiz.</p>
      )}
    </div>
  );
};

export default QuizResults;
