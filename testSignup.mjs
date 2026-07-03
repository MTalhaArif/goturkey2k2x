import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0",
  authDomain: "goturkey2k2x.firebaseapp.com",
  projectId: "goturkey2k2x",
  storageBucket: "goturkey2k2x.firebasestorage.app",
  messagingSenderId: "87738448924",
  appId: "1:87738448924:web:b2e0e57401032da0e0b3d9",
};

async function testSignup() {
  console.log("Initializing Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  try {
    console.log("Checking if email exists...");
    const q = query(collection(db, 'applications'), where('email', '==', 'testuser@example.com'));
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} matching emails.`);

    console.log("Attempting to write signup document...");
    const docData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      status: 'Incomplete',
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'applications'), docData);
    console.log("SUCCESS! Signup successful with ID: ", docRef.id);
    
    process.exit(0);
  } catch (error) {
    console.error("FIREBASE ERROR:", error.message);
    process.exit(1);
  }
}

testSignup();
