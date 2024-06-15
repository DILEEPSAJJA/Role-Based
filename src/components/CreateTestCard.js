import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTestCard = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'questionText') {
      newQuestions[index].questionText = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('_')[1], 10);
      newQuestions[index].options[optionIndex] = value;
    } else {
      newQuestions[index].correctAnswer = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quiz = { title: quizTitle, questions };
    try {
      await addDoc(collection(db, 'quizzes'), quiz);
      toast.success('Quiz created successfully!');
      setQuizTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (error) {
      console.error('Error adding quiz: ', error);
      toast.error('Error creating quiz. Please try again.');
    }
  };

  return (
    <div className="container">
      <ToastContainer /> {/* Include ToastContainer for toast notifications */}
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="quizTitle" className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
          />
        </div>
        {questions.map((question, index) => (
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
        <button type="submit" className="btn btn-primary">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateTestCard;
