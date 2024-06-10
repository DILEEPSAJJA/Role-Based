// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Register from './components/Register';
// import Login from './components/Login';
// import StudentDashboard from './components/StudentDashboard';
// import TeacherDashboard from './components/TeacherDashboard';
// import { auth, db } from './firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { doc, getDoc } from 'firebase/firestore';

// const App = () => {
//   const [user] = useAuthState(auth);

//   const [role, setRole] = React.useState(null);

//   React.useEffect(() => {
//     const fetchUserRole = async () => {
//       if (user) {
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setRole(docSnap.data().role);
//         }
//       }
//     };
//     fetchUserRole();
//   }, [user]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         {user && role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
//         {user && role === 'teacher' && <Route path="/dashboard" element={<TeacherDashboard />} />}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Navbar from './components/Navbar'; // Import Navbar component
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
        {user && role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
        {user && role === 'teacher' && <Route path="/dashboard" element={<TeacherDashboard />} />}
      </Routes>
    </Router>
  );
};

export default App;
