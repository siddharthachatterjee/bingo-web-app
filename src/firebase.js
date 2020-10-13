import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyApFmjEneYCwJPGdZYEMl44YkMXX4uplG0",
    authDomain: "bingo-f19c5.firebaseapp.com",
    databaseURL: "https://bingo-f19c5.firebaseio.com",
    projectId: "bingo-f19c5",
    storageBucket: "bingo-f19c5.appspot.com",
    messagingSenderId: "495206361739",
    appId: "1:495206361739:web:ef3ab7f7e4e80f19c6428e",
    measurementId: "G-SGJ8TQC92P"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;