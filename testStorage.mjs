import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0",
  authDomain: "goturkey2k2x.firebaseapp.com",
  projectId: "goturkey2k2x",
  storageBucket: "goturkey2k2x.firebasestorage.app",
  messagingSenderId: "87738448924",
  appId: "1:87738448924:web:b2e0e57401032da0e0b3d9",
};

async function testStorage() {
  console.log("Initializing Firebase Storage...");
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  try {
    const testRef = ref(storage, 'test/test.txt');
    console.log("Attempting to upload file to Storage...");
    await uploadString(testRef, 'This is a test file');
    
    console.log("Attempting to get Download URL...");
    const url = await getDownloadURL(testRef);
    console.log("SUCCESS! Storage is fully working. File URL: " + url);
    process.exit(0);
  } catch (error) {
    console.error("FIREBASE STORAGE ERROR:", error.message);
    process.exit(1);
  }
}

testStorage();
