import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0",
  authDomain: "goturkey2k2x.firebaseapp.com",
  projectId: "goturkey2k2x",
  storageBucket: "goturkey2k2x.firebasestorage.app",
  messagingSenderId: "87738448924",
  appId: "1:87738448924:web:b2e0e57401032da0e0b3d9",
};

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@goturkey.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('Set the ADMIN_PASSWORD environment variable before running this script.');
    console.error('Example: ADMIN_PASSWORD="your-strong-password" node createAdmin.mjs');
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const now = new Date().toISOString();

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    console.log('Admin account created. UID:', cred.user.uid, '| Email:', email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error.code || error.message);
    process.exit(1);
  }
}

createAdmin();
