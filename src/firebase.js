import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4mqsCGCSfw6_hISCJHNz1tLq5W-KenT0",
    authDomain: "new1-d8438.firebaseapp.com",
    projectId: "new1-d8438",
    storageBucket: "new1-d8438.appspot.com",
    messagingSenderId: "806462414036",
    appId: "1:806462414036:web:251b71f2c502afbad5ef41"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
