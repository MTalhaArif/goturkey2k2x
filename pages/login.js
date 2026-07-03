import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Admin backdoor for demo
    if (email === 'admin@goturkey.com' && password === 'admin123') {
      router.push('/admin/dashboard');
      return;
    }

    try {
      // Find student by email
      const q = query(collection(db, 'applications'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Just take the first matching application
        const docRef = querySnapshot.docs[0];
        localStorage.setItem('student_app_id', docRef.id);
        router.push('/student/dashboard');
      } else {
        setError('No application found with this email address.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | GoTurkey 2k2x</title>
      </Head>
      <div className="section section-bg" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>Login to Portal</h2>
            
            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group mb-8">
                <label className="form-label">Password / ID (Use anything for demo)</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Don't have an application? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Apply Now</Link>
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>Admin demo login: admin@goturkey.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
