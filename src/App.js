import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Profile from './components/Profile'; // Import Profile component
import Navbar from './components/Navbar'; // Import Navbar component
import CreateTestCard from './components/CreateTestCard'; // Import CreateTestCard component
import TakeTest from './components/TakeTest'; // Import TakeTest component
import Results from './components/Results'; // Import Results component
import EditQuiz from './components/EditQuiz'; // Import Leaderboard component
import QuizResults from './components/QuizResults'; // Import QuizResults component
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
      <Navbar user={user} /> {/* Include Navbar component */}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        {user && role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
        {user && role === 'teacher' && (
          <Route path="/dashboard" element={<TeacherDashboard />} />
        )}
        <Route path="/create-test" element={<CreateTestCard />} /> {/* Add CreateTestCard route */}
        <Route path="/take-test/:quizId" element={<TakeTest />} /> {/* Add TakeTest route */}
        <Route path="/results" element={<Results />} /> {/* Add Results route */}
        <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
        <Route path="/quiz-results/:quizId" element={<QuizResults />} /> {/* Add QuizResults route */}
      </Routes>
    </Router>
  );
};

export default App;
