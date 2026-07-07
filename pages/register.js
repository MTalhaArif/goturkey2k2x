import { useState } from 'react';
import Head from 'next/head';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Pre-filled with dummy details as requested
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    reference: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if email already exists
      const q = query(collection(db, 'applications'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('An account with this email already exists. Please login.');
        setLoading(false);
        return;
      }

      // Create new basic account
      const docData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        reference: formData.reference,
        status: 'Incomplete', // Tells dashboard to show the full mandatory form
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'applications'), docData);
      
      // Save ID to localStorage
      localStorage.setItem('student_app_id', docRef.id);
      
      // Hard navigation
      window.location.href = '/student/dashboard';
    } catch (err) {
      console.error('Error creating account:', err);
      setError('There was an error creating your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account | GoTurkey 2k2x</title>
      </Head>
      <div className="section section-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Create Account</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign up to access your student portal and complete your application.</p>
            
            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Password</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type={showPassword ? "text" : "password"} className="form-input" name="password" value={formData.password} onChange={handleInputChange} required style={{ flex: 1 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: '-40px', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="form-group mb-8">
                <label className="form-label">Write down your reference</label>
                <input type="text" className="form-input" name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Agent name, friend, or how you heard about us (optional)" />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
                {loading ? 'Creating Account...' : 'Sign Up & Continue'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
