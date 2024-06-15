import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import CreateTestCard from './components/CreateTestCard';
import TakeTest from './components/TakeTest';
import Results from './components/Results';
import EditQuiz from './components/EditQuiz';
import QuizResults from './components/QuizResults';
import Loading from './components/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  return (
    <Router>
      <Navbar user={user} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        {user && role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
        {user && role === 'teacher' && <Route path="/dashboard" element={<TeacherDashboard />} />}
        {user && role === 'teacher' && <Route path="/create-test" element={<CreateTestCard />} />}
        <Route path="/take-test/:quizId" element={<TakeTest />} />
        <Route path="/results/:quizId" element={<Results />} />
        {user && role === 'teacher' && <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />}
        {user && role === 'teacher' && <Route path="/quiz-results/:quizId" element={<QuizResults />} />}
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </Router>
  );
};

export default App;
