// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLGIRwPZBGEbJyTUyGEREYu0Bc5lKSOfc",
  authDomain: "recipeverse-6e465.firebaseapp.com",
  projectId: "recipeverse-6e465",
  storageBucket: "recipeverse-6e465.firebasestorage.app",
  messagingSenderId: "721590817595",
  appId: "1:721590817595:web:92ab9b78fdf6fba2d2dd1e",
  measurementId: "G-362PKVBCXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };

