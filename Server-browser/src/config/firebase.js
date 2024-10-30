const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const dotenv = require("dotenv");
const firebaseConfig = {
  apiKey: "AIzaSyAHCYlYXgMS5DHEICOAHkf7a69ReswE-vo",
  authDomain: "thienchu-cc67d.firebaseapp.com",
  projectId: "thienchu-cc67d",
  storageBucket: "thienchu-cc67d.appspot.com",
  messagingSenderId: "855281616928",
  appId: "1:855281616928:web:81d7628b6c7fc882a05445",
  measurementId: "G-VTC7W9F1G5",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function connectDatabase() {
  try {
    if (db) {
      console.log("Connected to Firebase successfully");
      return db;
    } else {
      return console.error("Firestore database instance is undefined");
    }
  } catch (e) {
    return console.log("Error connecting to Firebase");
  }
}

module.exports = { connectDatabase, db };
