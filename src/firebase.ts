import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase configuration
  apiKey: "AIzaSyDYL5OgwxANTvwvW_KsN4ft2mQTPmmGTFI",
  authDomain: "repl-879e1.firebaseapp.com",
  projectId: "repl-879e1",
  storageBucket: "repl-879e1.appspot.com",
  messagingSenderId: "275524673233",
  appId: "1:275524673233:web:6545e6490b923388752ff0",
  measurementId: "G-L2SRPCQ6C1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);