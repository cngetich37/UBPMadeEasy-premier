// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2QnW102Y5_akLaVRV3Zs4TW9MvgqSe2A",
  authDomain: "ubpmadeeasypremier.firebaseapp.com",
  projectId: "ubpmadeeasypremier",
  storageBucket: "ubpmadeeasypremier.firebasestorage.app",
  messagingSenderId: "539896664119",
  appId: "1:539896664119:web:83c6c4de1e13e71b26afb2",
  measurementId: "G-8ML5JV9VZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);