import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
  const storage = getStorage(app);
  
  //export { auth, db, storage };

  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Failed to enable offline persistence. Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.log('Offline persistence is not available in this browser.');
    }
  });
  
  export { db, auth, storage };