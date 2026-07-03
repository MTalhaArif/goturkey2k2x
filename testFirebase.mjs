import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Hardcoded for testing script since dotenv might not be configured for direct node run here easily
const firebaseConfig = {
  apiKey: "AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0",
  authDomain: "goturkey2k2x.firebaseapp.com",
  projectId: "goturkey2k2x",
  storageBucket: "goturkey2k2x.firebasestorage.app",
  messagingSenderId: "87738448924",
  appId: "1:87738448924:web:b2e0e57401032da0e0b3d9",
};

async function testConnection() {
  console.log("Initializing Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  try {
    console.log("Attempting to write test document to Firestore...");
    const docRef = await addDoc(collection(db, "test_connectivity"), {
      message: "Hello from GoTurkey2k2x!",
      timestamp: new Date()
    });
    console.log("SUCCESS! Document written with ID: ", docRef.id);
    
    console.log("Attempting to read from Firestore...");
    const querySnapshot = await getDocs(collection(db, "test_connectivity"));
    console.log(`SUCCESS! Read ${querySnapshot.size} documents.`);
    
    process.exit(0);
  } catch (error) {
    console.error("FIREBASE ERROR:", error.message);
    
    if (error.message.includes('Missing or insufficient permissions')) {
      console.error("\n❌ FIX REQUIRED: You need to go to Firebase Console > Firestore Database > Rules, and change them to allow read, write: if true;");
    } else if (error.message.includes('NOT_FOUND')) {
      console.error("\n❌ FIX REQUIRED: You need to go to Firebase Console > Build > Firestore Database and click 'Create Database'.");
    }
    
    process.exit(1);
  }
}

testConnection();
