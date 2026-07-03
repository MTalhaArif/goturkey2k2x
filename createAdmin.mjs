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

async function createAdmin() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  try {
    const q = query(collection(db, 'applications'), where('email', '==', 'admin@goturkey.com'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      await addDoc(collection(db, 'applications'), {
        email: 'admin@goturkey.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log("Admin user created in database!");
    } else {
      console.log("Admin user already exists in database!");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
