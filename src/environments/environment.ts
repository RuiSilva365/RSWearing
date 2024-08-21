// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk2kxLAofDJ3gyWNfz2_iwIU0PrJCqdYc",
  authDomain: "rswearing-4b75f.firebaseapp.com",
  projectId: "rswearing-4b75f",
  storageBucket: "rswearing-4b75f.appspot.com",
  messagingSenderId: "287024306857",
  appId: "1:287024306857:web:85719ec1c07707648627b8",
  measurementId: "G-DECZ1P4QFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);