

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDBaDvsqmstbbtNZYj72aAgle2vp_RCKUg",
  authDomain: "flood-prediction-df79a.firebaseapp.com",
  projectId: "flood-prediction-df79a",
  storageBucket: "flood-prediction-df79a.firebaseapp.com",
  messagingSenderId: "106969479086",
  appId: "1:106969479086:web:fb2bc2366a5fd99b313a3f",
  measurementId: "G-SPN96MPBTN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { app, auth }; 
