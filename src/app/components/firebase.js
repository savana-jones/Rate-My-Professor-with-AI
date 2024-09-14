// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkElSmqZ7fsZtsuJ3yCcOT_zpDnN0QocA",
  authDomain: "rate-my-professor-50aba.firebaseapp.com",
  projectId: "rate-my-professor-50aba",
  storageBucket: "rate-my-professor-50aba.appspot.com",
  messagingSenderId: "376599482213",
  appId: "1:376599482213:web:22ccb4f6c9d59b0617db8c",
  measurementId: "G-L2QP99FXVB"
};
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

{/*export { app, analytics, auth };

const auth = getAuth(app);
let analytics;*/}




// Initialize Firebase
