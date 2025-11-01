import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2ZyFX73HK3jRtXTYjvDjlcUJJzaQkXow",
  authDomain: "auchessclub-f3cd9.firebaseapp.com",
  databaseURL: "https://auchessclub-f3cd9-default-rtdb.firebaseio.com",
  projectId: "auchessclub-f3cd9",
  storageBucket: "auchessclub-f3cd9.appspot.com",
  messagingSenderId: "989746471960",
  appId: "1:989746471960:web:7307202ea9b10d7e744f6d",
  measurementId: "G-CGF3HYT3GE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;