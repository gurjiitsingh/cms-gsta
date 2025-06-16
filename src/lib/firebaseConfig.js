//gurjiitsingh@gmail.com
//Cloud Firestore
//nextjs-course




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//gurjiitsingh2
const firebaseConfig = {
    apiKey: "AIzaSyBK3NHlArybleMDtwWKlFiTxghiM7BtsUk",
  authDomain: "e-commerce-448111.firebaseapp.com",
  databaseURL: "https://e-commerce-448111-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "e-commerce-448111",
  storageBucket: "e-commerce-448111.firebasestorage.app",
  messagingSenderId: "854586150514",
  appId: "1:854586150514:web:55fd54a70c71ff097c7ceb"
};




// Initialize Firebase

let app;
try {
     app = initializeApp(firebaseConfig);
} catch (error) {
 console.log(error)   
}


export const db = getFirestore(app);

