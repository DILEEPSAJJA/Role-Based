import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const TakeTest = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);

        if (quizSnap.exists()) {
          setQuiz(quizSnap.data());
          setAnswers(new Array(quizSnap.data().questions.length).fill(''));
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        correctAnswers += 1;
      }
    });

    const result = {
      studentName: user.email, // or user.displayName
      quizId,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      score: (correctAnswers / quiz.questions.length) * 100,
    };

    try {
      await addDoc(collection(db, 'results'), result);
      navigate('/results', { state: { ...result } });
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="container">
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <li key={index}>
                <div>{question.questionText}</div>
                <ul>
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <div>No questions found for this quiz.</div>
          )}
        </ul>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default TakeTest;
