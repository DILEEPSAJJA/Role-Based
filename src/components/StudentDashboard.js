import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import QuizCard from './QuizCard';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizCollection = collection(db, 'quizzes');
      const quizSnapshot = await getDocs(quizCollection);
      const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container">
      <h2>Student Dashboard</h2>
      <div className="row">
        {quizzes.map(quiz => (
          <div className="col-md-4" key={quiz.id}>
            <QuizCard quiz={quiz} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;


