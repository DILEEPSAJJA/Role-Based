/*import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizCollection = await getDocs(collection(db, 'quizzes'));
      setQuizzes(quizCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchQuizzes();
  }, []);

  const selectQuiz = async (quizId) => {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (quizDoc.exists()) {
      setSelectedQuiz({ id: quizDoc.id, ...quizDoc.data() });
      setAnswers(new Array(quizDoc.data().questions.length).fill(''));
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can process the answers, e.g., save them to the database or check correctness
    alert('Quiz submitted!');
  };

  return (
    <div className="container">
      <h2>Take Quiz</h2>
      {selectedQuiz ? (
        <form onSubmit={handleSubmit}>
          <h3>{selectedQuiz.title}</h3>
          {selectedQuiz.questions.map((question, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">{question.questionText}</label>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Submit Quiz</button>
        </form>
      ) : (
        <div>
          <h3>Select a Quiz</h3>
          {quizzes.map(quiz => (
            <button key={quiz.id} className="btn btn-link" onClick={() => selectQuiz(quiz.id)}>
              {quiz.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
*/

// StudentDashboard.js
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
