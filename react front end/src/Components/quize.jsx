// QuizComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuizComponent.css';
import logo from './langpro.png';

const QuizComponent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(1);
  };

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/submit-quiz', {
        quizId: currentQuiz.id,
        answers: userAnswers,
      });
      setScore(response.data.score);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    
    <div className="quiz-container">
     
     {/* Navbar */}
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark full-screen">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="KidsLingo Logo" className="navbar-logo" />
            <span className="h3 mb-0 ms-2">KidsLingo</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/quizes" className="nav-link">Quizzes</Link>
              </li>
              <li className="nav-item">
                <Link to="/activities" className="nav-link">Activities</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">My Progress</Link>
              </li>
            </ul>
            <div className="d-flex">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>


      <h1>Sinhala Language Quizzes</h1>
      {!currentQuiz && (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <button key={quiz.id} onClick={() => startQuiz(quiz)} className="quiz-button">
              {quiz.title}
            </button>
          ))}
        </div>
      )}
      {currentQuiz && !quizCompleted && (
        <div className="question-container">
          <h2>{currentQuiz.title}</h2>
          <p>{currentQuiz.questions[currentQuestion].text}</p>
          <div className="options">
            {currentQuiz.questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)} className="option-button">
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {quizCompleted && (
        <div className="result-container">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score}/{currentQuiz.questions.length}</p>
          <button onClick={() => setCurrentQuiz(null)} className="back-button">
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;