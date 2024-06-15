import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TakeTest = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [user] = useAuthState(auth);
  const [testTaken, setTestTaken] = useState(false);

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

    const checkIfTestTaken = async () => {
      try {
        const resultsRef = collection(db, 'results');
        const q = query(resultsRef, where('quizId', '==', quizId), where('studentName', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setTestTaken(true);
          toast.error('You have already taken this test.', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/dashboard');  // Redirect to dashboard or any other page
        }
      } catch (error) {
        console.error('Error checking if test was already taken:', error);
      }
    };

    if (user) {
      checkIfTestTaken();
    }
    fetchQuiz();
  }, [quizId, user, navigate]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        navigate('/loading');  // Redirect to loading page if user exits full-screen
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, [navigate]);

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

  const handleFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  if (testTaken) {
    return <div>Loading...</div>; // or return null to render nothing
  }

  return (
    <div className="container">
      <ToastContainer />
      <h2>{quiz.title}</h2>
      <button onClick={handleFullScreen} className="btn btn-primary">Start Full-Screen Quiz</button>
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
