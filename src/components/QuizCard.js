// QuizCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{quiz.title}</h5>
        <p className="card-text">Number of Questions: {quiz.questions.length}</p>
        <Link to={`/take-test/${quiz.id}`} className="btn btn-primary">Take Test</Link>
      </div>
    </div>
  );
};

export default QuizCard;
