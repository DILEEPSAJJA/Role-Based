import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesCollection = collection(db, 'quizzes');
      const quizzesSnapshot = await getDocs(quizzesCollection);
      const quizzesList = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizzesList);
    };

    fetchQuizzes();
  }, []);

  const navigateToCreateTest = () => {
    navigate('/create-test');
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz: ', error);
    }
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz-results/${quizId}`);
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  return (
    <div className="container">
      <h2>Teacher Dashboard</h2>
      <button className="btn btn-primary mb-3" onClick={navigateToCreateTest}>
        Create Quiz
      </button>
      <h3>Your Quizzes</h3>
      <ul className="list-group">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {quiz.title} ({quiz.questions.length} questions)
            </span>
            <div>
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => handleEditQuiz(quiz.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleViewResults(quiz.id)}
              >
                View Results
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteQuiz(quiz.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
