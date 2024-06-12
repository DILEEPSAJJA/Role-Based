import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import TakeTest from './components/TakeTest';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
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
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        {user && role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
        {user && role === 'teacher' && <Route path="/dashboard" element={<TeacherDashboard />} />}
        <Route path="/take-test/:quizId" element={<TakeTest />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
