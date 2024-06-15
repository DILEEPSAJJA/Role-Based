import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      if (quizSnap.exists()) {
        setQuiz(quizSnap.data());
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    if (field === 'questionText') {
      newQuestions[index] = { ...newQuestions[index], questionText: value };
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('_')[1], 10);
      newQuestions[index].options[optionIndex] = value;
    } else {
      newQuestions[index] = { ...newQuestions[index], correctAnswer: value };
    }
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: '' };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'quizzes', quizId), quiz);
      toast.success('Quiz updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating quiz: ', error);
      toast.error('Error updating quiz. Please try again.');
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer /> {/* Include ToastContainer for toast notifications */}
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="quizTitle" className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            id="quizTitle"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            required
          />
        </div>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">Question {index + 1}</label>
            <input
              type="text"
              className="form-control"
              placeholder="Question Text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              required
            />
            {question.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                className="form-control mt-2"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => handleQuestionChange(index, `option_${optIndex}`, e.target.value)}
                required
              />
            ))}
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Correct Answer"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addQuestion}>Add Question</button>
        <button type="submit" className="btn btn-primary">Update Quiz</button>
      </form>
    </div>
  );
};

export default EditQuiz;
